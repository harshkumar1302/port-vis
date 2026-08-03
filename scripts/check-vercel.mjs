import fs from 'fs';
import path from 'path';

const root = process.cwd();
const apiDir = path.join(root, 'api');
const HOBBY_LIMIT = 12;
const WARN_AT = 10;

const apiFiles = fs.readdirSync(apiDir).filter((f) => f.endsWith('.js'));

if (apiFiles.length > HOBBY_LIMIT) {
  console.error(
    `\nDeploy blocked: ${apiFiles.length} serverless functions in api/ (Vercel Hobby max: ${HOBBY_LIMIT}).\n` +
      `Merge routes before adding new API files. Current: ${apiFiles.join(', ')}\n`
  );
  process.exit(1);
}

if (apiFiles.length >= WARN_AT) {
  console.warn(
    `Warning: ${apiFiles.length}/${HOBBY_LIMIT} API functions — at or near Vercel Hobby limit.`
  );
}

const vercelPath = path.join(root, 'vercel.json');
const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

for (const [index, header] of (vercel.headers || []).entries()) {
  const source = header.source || '';
  // Vercel path-to-regexp rejects alternation groups like (jpg|png|...)
  if (/\([^)]*\|/.test(source)) {
    console.error(
      `\nDeploy blocked: vercel.json headers[${index}] has an invalid source pattern:\n  ${source}\n` +
        `Use separate header entries or rely on Vercel CDN defaults for static files.\n`
    );
    process.exit(1);
  }
}

console.log(`Vercel checks passed (${apiFiles.length}/${HOBBY_LIMIT} API functions).`);
