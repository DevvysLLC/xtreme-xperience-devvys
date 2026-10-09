const fs = require('fs');
const html = fs.readFileSync('clean-body.html', 'utf8');
const regex = /<div[^>]*id=\"([a-zA-Z0-9_-]*contact[a-zA-Z0-9_-]*|payment|checkout[a-zA-Z0-9_-]*)\"[^>]*>/gi;
let match;
const ids = [];
while ((match = regex.exec(html)) !== null) {
  ids.push(match[1]);
}
console.log('Div IDs:', ids.join(', '));
