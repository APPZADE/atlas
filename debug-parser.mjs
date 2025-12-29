
// Mock fs path for the parser since we are running in node
import { getRecognizedCountries } from './src/lib/recognized-parser.js';

const countries = getRecognizedCountries();
console.log("Total countries:", countries.length);

const kktc = countries.find(c => c.cleanName.includes('Kıbrıs'));
console.log("KKTC Found:", kktc);

const palestine = countries.find(c => c.cleanName === 'Filistin');
console.log("Palestine Found:", palestine);

const germany = countries.find(c => c.cleanName === 'Almanya');
console.log("Germany Continent:", germany?.continent);
