<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>XML Sitemap</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #1a1a1a;
            background: #f8f9fa;
            padding: 2rem;
          }
          .container { max-width: 1100px; margin: 0 auto; }
          h1 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
          }
          .description {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
          }
          .back {
            display: inline-block;
            color: #2563eb;
            text-decoration: none;
            font-size: 0.875rem;
            margin-bottom: 1rem;
          }
          .back:hover { text-decoration: underline; }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          }
          th {
            background: #111827;
            color: #fff;
            font-weight: 500;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.75rem 1rem;
            text-align: left;
          }
          td {
            padding: 0.625rem 1rem;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.875rem;
          }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: #f9fafb; }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover { text-decoration: underline; }
          .meta { color: #6b7280; }
          .count {
            display: inline-block;
            background: #e5e7eb;
            color: #374151;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            margin-left: 0.5rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <a class="back" href="/sitemap.xml">&#8592; Sitemap Index</a>
          <h1>XML Sitemap</h1>
          <p class="description">
            URLs in this sitemap.
            <span class="count">
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
            </span>
          </p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Freq</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td class="meta"><xsl:value-of select="sitemap:lastmod"/></td>
                  <td class="meta"><xsl:value-of select="sitemap:changefreq"/></td>
                  <td class="meta"><xsl:value-of select="sitemap:priority"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
