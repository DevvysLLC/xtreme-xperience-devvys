const fs = require('fs');
const html = fs.readFileSync('clean-body.html', 'utf8');
const regex = /<section[^>]*id=\"(.*?)\"[^>]*>/g;
let match;
const ids = [];
while ((match = regex.exec(html)) !== null) {
  ids.push(match[1]);
}
console.log('Sections:', ids.join(', '));
