const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.resolve(dir, file);
    if (fs.statSync(full).isDirectory()) results = results.concat(walk(full));
    else if (full.endsWith('.jsx') || full.endsWith('.js')) results.push(full);
  });
  return results;
}

const files = walk('./client/src');
let changed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('alert(')) return;

  let updated = content;

  // Add toast import if not already imported
  if (!updated.includes("react-hot-toast")) {
    updated = updated.replace(/^(import .+;\n)/m, (m) => m + "import toast from 'react-hot-toast';\n");
  }

  // Replace alert patterns with appropriate toast variants
  updated = updated.replace(/alert\(([^;)]+(?:\([^)]*\))?[^;)]*)\)/g, (match, arg) => {
    const lower = arg.toLowerCase();
    if (lower.includes('error') || lower.includes('failed') || lower.includes('invalid')) {
      return `toast.error(${arg})`;
    }
    return `toast.success(${arg})`;
  });

  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log('Updated:', path.basename(file));
    changed++;
  }
});

console.log('Done. Files updated:', changed);
