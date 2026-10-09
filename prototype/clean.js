const fs = require('fs');

try {
  let html = fs.readFileSync('c:/Users/muham/Desktop/Anas/xtreme-xperience-devvys/prototype/extracted-body.html', 'utf8');
  html = html.replace(/<svg[^>]*>.*?<\/svg>/gs, '<svg>...</svg>');
  html = html.replace(/src=\"data:image.*?[^\"]\"/g, 'src=\"base64\"');
  fs.writeFileSync('c:/Users/muham/Desktop/Anas/xtreme-xperience-devvys/prototype/clean-body.html', html);
  console.log('Cleaned body size:', fs.statSync('c:/Users/muham/Desktop/Anas/xtreme-xperience-devvys/prototype/clean-body.html').size);
} catch (e) {
  console.error(e);
}
