import fs from 'fs';
import path from 'path';
import { getRecognizedCountries } from './recognized-parser';

// Data file path
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'countries.json');

// Helper to ensure data directory exists
function ensureDataFile() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf-8');
    }
}

export function getAllCountries() {
    ensureDataFile();

    // 1. Get Static Data
    const staticData = getRecognizedCountries();

    // 2. Get Dynamic Data
    let dynamicData = [];
    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        dynamicData = JSON.parse(fileContent);
    } catch (e) {
        console.error("DB Read Error:", e);
    }

    // 3. Merge (Dynamic overwrites Static if ID matches)
    // We assume static IDs are like 'TUR', 'USA'. Dynamic items need distinct IDs or same to overwrite.
    // Strategy: Map by ID.
    const mergedMap = new Map();

    staticData.forEach(c => mergedMap.set(c.id, { ...c, source: 'static' }));
    dynamicData.forEach(c => {
        // If it was deleted, remove it from map
        if (c.deleted) {
            mergedMap.delete(c.id);
        } else {
            // Merge or Add
            mergedMap.set(c.id, { ...mergedMap.get(c.id), ...c, source: 'dynamic' });
        }
    });

    return Array.from(mergedMap.values());
}

export function getCountryById(id) {
    const all = getAllCountries();
    return all.find(c => c.id === id);
}

export function saveCountry(countryData) {
    ensureDataFile();

    let dynamicData = [];
    try {
        dynamicData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (e) { }

    const existingIndex = dynamicData.findIndex(c => c.id === countryData.id);

    if (existingIndex > -1) {
        // Update existing
        dynamicData[existingIndex] = { ...dynamicData[existingIndex], ...countryData };
    } else {
        // Add new
        dynamicData.push(countryData);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(dynamicData, null, 2), 'utf-8');
    return countryData;
}

export function deleteCountry(id) {
    ensureDataFile();

    // To "delete" a static country, we must mark it as deleted in dynamic file.
    // To delete a purely dynamic country, we can just remove it (or mark deleted for audit).
    // Simple approach: Mark as deleted.

    let dynamicData = [];
    try {
        dynamicData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (e) { }

    const existingIndex = dynamicData.findIndex(c => c.id === id);
    if (existingIndex > -1) {
        dynamicData[existingIndex].deleted = true;
    } else {
        dynamicData.push({ id, deleted: true });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(dynamicData, null, 2), 'utf-8');
    return true;
}
