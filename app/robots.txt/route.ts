export async function GET() {
  const robotsTxt = `# Robots.txt for robust.iverfinne.no

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemaps
Sitemap: https://robust.iverfinne.no/sitemap.xml

# Crawl-delay
Crawl-delay: 1
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
