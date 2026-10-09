const fs = require('fs');
const html = fs.readFileSync('clean-body.html', 'utf8');
const match = html.match(/<section[^>]*id=\"stage\"[^>]*>(.*?)<\/section>/s);
if (match) {
  const content = match[1];
  console.log('Stage content length:', content.length);
  console.log(content.substring(0, 1000));
}
