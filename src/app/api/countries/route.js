import { getAllCountries, saveCountry, deleteCountry, getCountryById } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
        const country = getCountryById(id);
        if (country) return NextResponse.json(country);
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const countries = getAllCountries();
    // Return lightweight list
    const simpleList = countries.map(c => ({
        displayName: c.displayName,
        id: c.id,
        cleanName: c.cleanName || c.displayName
    }));
    return NextResponse.json(simpleList);
}

export async function POST(req) {
    try {
        const data = await req.json();
        const saved = saveCountry(data);
        return NextResponse.json(saved);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        deleteCountry(id);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
