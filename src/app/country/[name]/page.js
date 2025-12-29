import { getRecognizedCountries } from '@/lib/recognized-parser';
import { State } from 'country-state-city'; // City unused in this file
import CountryClientView from '@/components/CountryClientView';

// Fetch data from RestCountries API (Server Side)
async function getCountryData(name) {
    const decodedName = decodeURIComponent(name);

    // Local lookup for clean name
    const countries = getRecognizedCountries();
    const localData = countries.find(c => c.displayName === decodedName) || { cleanName: decodedName };
    let queryName = localData.cleanName;

    // Manual overrides
    const manualMap = {
        'Almanya': 'Germany',
        'Arnavutluk': 'Albania',
        'Avusturya': 'Austria',
        'Belçika': 'Belgium',
        'Birleşik Krallık': 'United Kingdom',
        'Çekya': 'Czechia',
        'Danimarka': 'Denmark',
        'Estonya': 'Estonia',
        'Finlandiya': 'Finland',
        'Fransa': 'France',
        'Hırvatistan': 'Croatia',
        'Hollanda': 'Netherlands',
        'İrlanda': 'Ireland',
        'İspanya': 'Spain',
        'İsveç': 'Sweden',
        'İsviçre': 'Switzerland',
        'İtalya': 'Italy',
        'İzlanda': 'Iceland',
        'Karadağ': 'Montenegro',
        'Kuzey Makedonya': 'North Macedonia',
        'Letonya': 'Latvia',
        'Litvanya': 'Lithuania',
        'Macaristan': 'Hungary',
        'Polonya': 'Poland',
        'Portekiz': 'Portugal',
        'Romanya': 'Romania',
        'Rusya Federasyonu': 'Russia',
        'Sırbistan': 'Serbia',
        'Slovakya': 'Slovakia',
        'Slovenya': 'Slovenia',
        'Yunanistan': 'Greece',
        'ABD': 'USA',
        'Brezilya': 'Brazil',
        'Çin Halk Cumhuriyeti': 'China',
        'Japonya': 'Japan',
        'Güney Kore': 'South Korea',
        'Kuzey Kore': 'North Korea',
        // Add others as needed
    };
    if (manualMap[queryName]) queryName = manualMap[queryName];

    // Helpers
    const getWiki = async (lang, title) => {
        try {
            const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
            if (!res.ok) return null;
            const json = await res.json();
            return json.extract;
        } catch (e) { return null; }
    };

    const getBorderCountries = async (codes) => {
        if (!codes || codes.length === 0) return [];
        try {
            const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes.join(',')}`);
            if (!res.ok) return [];
            const data = await res.json();
            return data.map(c => ({
                name: c.translations?.tur?.common || c.name.common,
                cca3: c.cca3
            }));
        } catch (e) { return []; }
    };

    // Special Case: KKTC
    if (queryName === 'Kuzey Kıbrıs Türk Cumhuriyeti') {
        const wikiTR = await getWiki('tr', 'Kuzey_Kıbrıs_Türk_Cumhuriyeti');
        return {
            name: { common: 'Kuzey Kıbrıs Türk Cumhuriyeti', official: 'Kuzey Kıbrıs Türk Cumhuriyeti' },
            capital: ['Lefkoşa'],
            region: 'Europe/Asia',
            population: 382836,
            currencies: { TRY: { name: 'Türk Lirası', symbol: '₺' } },
            flags: { svg: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg' },
            latlng: [35.18, 33.38], // Nicosia logs
            isSpecial: true,
            wiki: { tr: wikiTR },
            neighborData: [] // Borders hard to define via API
        };
    }

    try {
        let res = await fetch(`https://restcountries.com/v3.1/translation/${queryName}`);
        if (!res.ok) res = await fetch(`https://restcountries.com/v3.1/name/${queryName}`);

        if (!res.ok) return null;

        const data = await res.json();

        // Smart Selection: Prioritize exact matches or specific codes
        let country = data[0];

        // Fix for France returning territories first or wrong order
        if (queryName === 'France') {
            const france = data.find(c => c.cca3 === 'FRA');
            if (france) country = france;
        }

        // Manual Flag Overrides
        if (country.cca3 === 'FRA') {
            country.flags.svg = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg'; // High quality one
        }

        // Fetch Wiki TR
        const wikiTR = await getWiki('tr', decodedName);
        const borders = await getBorderCountries(country.borders);

        country.wiki = { tr: wikiTR };
        country.neighborData = borders;
        return country;
    } catch (e) { return null; }
}

export async function generateMetadata({ params }) {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);
    const countryData = await getCountryData(name);

    if (!countryData) return { title: 'Not Found' };

    return {
        title: `${decodedName} - World Encyclopedia`,
        description: `Explore ${decodedName} stats, history, and culture.`,
        openGraph: {
            images: countryData.flags?.png ? [countryData.flags.png] : [],
        },
    };
}

export default async function CountryPage({ params }) {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    // Server Side Fetch
    const countryData = await getCountryData(name);

    // States logic (also server side mostly)
    let states = [];
    if (countryData) {
        if (countryData.cca2) {
            states = State.getStatesOfCountry(countryData.cca2);
        } else if (countryData.isSpecial) {
            states = [
                { name: "Lefkoşa", isoCode: "LF" },
                { name: "Gazimağusa", isoCode: "GZ" },
                { name: "Girne", isoCode: "GR" },
                { name: "Güzelyurt", isoCode: "GY" },
                { name: "İskele", isoCode: "IS" },
                { name: "Lefke", isoCode: "LK" }
            ];
        }
    }

    // Pass data to Client View
    return (
        <CountryClientView
            countryData={countryData}
            wikiSummaries={countryData?.wiki || {}}
            states={states}
            borders={countryData?.neighborData || []}
            decodedName={decodedName}
        />
    );
}
