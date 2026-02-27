import { readFileSync } from 'fs';
const content = readFileSync('src/data/layoffs.ts', 'utf-8');
// Find the JSON array - it starts after "= " and is the large array
const match = content.match(/layoffsData:\s*LayoffEntry\[\]\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  // Try to extract just the array between first [ and matching ]
  const firstBracket = content.indexOf('[');
  // Find the matching closing bracket by counting
  let depth = 0;
  let endIdx = -1;
  for (let i = firstBracket; i < content.length; i++) {
    if (content[i] === '[') depth++;
    if (content[i] === ']') depth--;
    if (depth === 0) { endIdx = i; break; }
  }
  var jsonStr = content.substring(firstBracket, endIdx + 1);
} else {
  var jsonStr = match[1];
}

const data = JSON.parse(jsonStr);
console.log('Total entries:', data.length);

const companies = ['UPS', 'Verizon', 'Chevron', 'Accenture', 'Duolingo', 'Intel', 'Klarna', 'Shopify', 'Meta', 'Google', 'Amazon', 'Microsoft', 'Salesforce', 'Cisco'];
for (const c of companies) {
  const matches = data.filter(d => d.company.toLowerCase().includes(c.toLowerCase()));
  console.log(c + ': ' + matches.length + ' entries');
  matches.slice(0, 5).forEach(m => console.log('  ' + m.date + ' | ' + (m.laidOff || '?') + ' | ' + m.industry + ' | ' + m.stage));
  if (matches.length > 5) console.log('  ... and ' + (matches.length - 5) + ' more');
}
