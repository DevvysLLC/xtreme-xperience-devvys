const fs = require('fs');
const css = fs.readFileSync('extracted-styles.css', 'utf8');

const regex = /\.summary[^{]*\{[^}]*\}/gs;
let match;
while ((match = regex.exec(css)) !== null) {
  console.log(match[0]);
}
