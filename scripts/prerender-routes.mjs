/**
 * Post-build step: gives every route its own static HTML file (dist/<route>/index.html) with that page's
 * title, description, canonical, Open Graph and Twitter tags, plus a <noscript> fallback with the H1 and
 * internal links. Crawlers and link previews that do not run JavaScript then see page-specific content.
 * Also writes dist/sitemap.xml. The React app still renders and manages the head on the client.
 *
 * Page titles/descriptions live in scripts/seo-routes.json: update it when a page's title/description changes.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const { site, routes } = JSON.parse(readFileSync(join(process.cwd(), "scripts/seo-routes.json"), "utf8"));
const base = readFileSync(join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const setAttr = (html, tagRe, attr, value) =>
  html.replace(tagRe, (tag) => tag.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${esc(value)}"`));

function render(path, r) {
  const url = `${site}${path === "/" ? "/" : path}`;
  let html = base;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`);
  html = setAttr(html, /<meta data-static-seo name="description"[^>]*>/, "content", r.description);
  html = setAttr(html, /<link data-static-seo rel="canonical"[^>]*>/, "href", url);
  html = setAttr(html, /<meta data-static-seo property="og:url"[^>]*>/, "content", url);
  html = setAttr(html, /<meta data-static-seo property="og:title"[^>]*>/, "content", r.title);
  html = setAttr(html, /<meta data-static-seo property="og:description"[^>]*>/, "content", r.description);
  html = setAttr(html, /<meta data-static-seo name="twitter:title"[^>]*>/, "content", r.title);
  html = setAttr(html, /<meta data-static-seo name="twitter:description"[^>]*>/, "content", r.description);

  const links = Object.entries(routes)
    .map(([p, v]) => `<li><a href="${p}">${esc(v.h1)}</a></li>`)
    .join("");
  const fallback =
    `<noscript><main><h1>${esc(r.h1)}</h1><p>${esc(r.description)}</p>` +
    `<nav aria-label="Site"><ul>${links}</ul></nav>` +
    `<p>ParcelGrid by Escrow Courier Networks Ltd. Call or WhatsApp 0745 111 555 / 0794 333 888.</p></main></noscript>`;
  return html.replace("<!--seo-fallback-->", fallback);
}

let count = 0;
for (const [path, r] of Object.entries(routes)) {
  const html = render(path, r);
  if (path === "/") {
    writeFileSync(join(dist, "index.html"), html);
  } else {
    const dir = join(dist, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }
  count++;
}

// Fallback for unknown URLs (the app shows its own "page not found"): keep it out of search results.
const notFound = base
  .replace(/<meta data-static-seo name="robots"[^>]*>/, '<meta data-static-seo name="robots" content="noindex, follow" />')
  .replace("<!--seo-fallback-->", "");
writeFileSync(join(dist, "404.html"), notFound);

const today = new Date().toISOString().slice(0, 10);
const urls = Object.entries(routes)
  .map(
    ([p, r]) =>
      `  <url>\n    <loc>${site}${p === "/" ? "/" : p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
  )
  .join("\n");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

console.log(`prerender-routes: wrote ${count} route files, 404.html and sitemap.xml`);
