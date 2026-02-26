const fs = require("fs");
const path = require("path");

const BASE_URL = "https://devwue.github.io";

const posts = require("../src/post-data.json");

cleanName = function(markdownPage) {
  return markdownPage.replace(/\.md$/,'')
}
const urls = posts.map(post => {
  return `
  <url>
    <loc>${BASE_URL}/posts${cleanName(post.Page)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <priority>0.6</priority>
  </url>
  ${urls}
</urlset>`;

fs.writeFileSync(path.resolve(__dirname, "../public/sitemap.xml"), sitemap);

console.log("sitemap.xml 생성 완료");
