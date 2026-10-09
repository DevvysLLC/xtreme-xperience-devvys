const fs = require('fs');
const html = fs.readFileSync('clean-body.html', 'utf8');
const orderSummaryMatch = html.match(/<[^>]*class=\"[^\"]*summary[^\"]*\"[^>]*>(.*?)<\/[a-zA-Z]+>/is);
if (orderSummaryMatch) {
  console.log(orderSummaryMatch[0].substring(0, 500));
} else {
  console.log('No element with class containing "summary" found.');
}
