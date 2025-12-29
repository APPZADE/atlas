import { describe, it, expect } from 'vitest';
import { getRecognizedCountries } from './recognized-parser';

describe('Recognized Countries Parser', () => {
    const countries = getRecognizedCountries();

    it('should return a non-empty list of countries', () => {
        expect(countries.length).toBeGreaterThan(0);
    });

    it('should include strictly recognized entities (KKTC)', () => {
        const kktc = countries.find(c => c.cleanName === 'Kuzey Kıbrıs Türk Cumhuriyeti' || c.displayName.includes('Kuzey Kıbrıs Türk Cumhuriyeti'));
        expect(kktc).toBeDefined();
    });

    it('should include Palestine (Filistin)', () => {
        const palestine = countries.find(c => c.cleanName === 'Filistin');
        expect(palestine).toBeDefined();
    });

    it('should NOT include unrecognized entities (South Cyprus as "Republic")', () => {
        // We explicitly state in the MD that "Güney Kıbrıs Rum Yönetimi" is NOT recognized as "Cyprus Republic"
        // The parser should strictly follow the list.
        // Let's check that we don't accidentally have "Güney Kıbrıs" as a recognized entry ID.
        const southCyprus = countries.find(c => c.cleanName.includes('Güney Kıbrıs'));
        expect(southCyprus).toBeUndefined();
    });

    it('should parse continents correctly', () => {
        const germany = countries.find(c => c.cleanName === 'Almanya');
        expect(germany.continent).toBe('Avrupa Kıtası');
    });
});
