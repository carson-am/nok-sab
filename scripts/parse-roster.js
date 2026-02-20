const XLSX = require('xlsx');
const path = require('path');

const workbook = XLSX.readFile(path.join(__dirname, '..', 'roster-members.xlsx'));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

if (rows.length < 2) {
  console.log(JSON.stringify([]));
  process.exit(0);
}

const headers = rows[0].map((h) => (h || '').toString().trim());
const nameIdx = headers.findIndex((h) => /name/i.test(h));
const titleIdx = headers.findIndex((h) => /title/i.test(h));
const companyIdx = headers.findIndex((h) => /company/i.test(h));
const locationIdx = headers.findIndex((h) => /location/i.test(h));
const roleIdx = headers.findIndex((h) => /role/i.test(h));
const linkedinIdx = headers.findIndex((h) => /linkedin/i.test(h));
const descIdx = headers.findIndex((h) => /description|bio/i.test(h));
const tagsIdx = headers.findIndex((h) => /tag/i.test(h));

function get(row, i) {
  if (i < 0 || i >= row.length) return '';
  const v = row[i];
  return v != null ? String(v).trim() : '';
}

function imagePathFor(name) {
  if (!name) return null;
  const n = name.trim();
  if (n === 'Maddy McIntyre') return '/images/team/maddy-mcIntyre.jpg';
  if (n === 'Nick Salgado') return '/images/team/nick-salgado.jpeg';
  if (n === 'Chris Shonk' || n === 'Edwin Heslinga') return null;
  const slug = n.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `/images/board/${slug}.jpeg`;
}

const result = [];
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const name = get(row, nameIdx);
  if (!name) continue;
  const tagsRaw = get(row, tagsIdx);
  const tags = tagsRaw ? tagsRaw.split(/[,;]/).map((t) => t.trim()).filter(Boolean) : [];
  result.push({
    id: i,
    name,
    title: get(row, titleIdx),
    company: get(row, companyIdx),
    location: get(row, locationIdx),
    role: get(row, roleIdx) || 'Strategic Advisory Board',
    bio: get(row, descIdx),
    linkedin: get(row, linkedinIdx) || '',
    tags,
    imagePath: imagePathFor(name),
  });
}

console.log(JSON.stringify(result, null, 2));
