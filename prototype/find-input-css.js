const fs = require('fs');
const css = fs.readFileSync('extracted-styles.css', 'utf8');

const regex = /input\[type=[^\]]+\][^\{]*\{[^}]*\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
  console.log(match[0].substring(0, 200));
}
