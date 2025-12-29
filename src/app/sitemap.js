import { getRecognizedCountries } from '@/lib/recognized-parser';

const BASE_URL = 'http://localhost:3000'; // Change this to your production domain

export default function sitemap() {
    const countries = getRecognizedCountries();

    const countryUrls = countries.map((country) => ({
        url: `${BASE_URL}/country/${encodeURIComponent(country.displayName)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...countryUrls,
    ];
}
