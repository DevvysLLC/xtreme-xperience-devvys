const embedHtml = \<script charset='utf-8' type='text/javascript' src='//js.hsforms.net/forms/embed/v2.js'></script> <script>   hbspt.forms.create({     portalId: '43829367',     formId: 'fbbef109-ac09-47e8-8a51-1801a562e0cf',     region: 'na1'   }); </script>  <script type='text/javascript' src='https://assets.revenuehero.io/scheduler.min.js'></script> <script type='text/javascript'>   window.hero = new window.RevenueHero({ routerId: '6715' }); </script>\;
const scripts = [];
const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(embedHtml)) !== null) {
  const attributes = match[1];
  const inlineCode = match[2];
  const srcMatch = /src=[\"']([^\"']+)[\"']/.exec(attributes);
  const src = srcMatch?.[1];

  if (src && src.includes('js.hsforms.net/forms/embed')) continue;
  if (inlineCode && inlineCode.includes('hbspt.forms.create')) continue;

  scripts.push({ src, inlineCode: inlineCode.trim() || undefined });
}
console.log(scripts);
