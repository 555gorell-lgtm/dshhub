import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
const log = [];
mkdirSync("public", { recursive: true });

const SITE = "https://dshhub.online";
const TODAY = "2026-10-07";

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  "  <url>",
  "    <loc>" + SITE + "/</loc>",
  "    <lastmod>" + TODAY + "</lastmod>",
  "    <changefreq>daily</changefreq>",
  "    <priority>1.0</priority>",
  "  </url>",
  "</urlset>",
  ""
].join("\n");
writeFileSync("public/sitemap.xml", sitemap);
log.push("sitemap.xml: создан");

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  "Sitemap: " + SITE + "/sitemap.xml",
  ""
].join("\n");
writeFileSync("public/robots.txt", robots);
log.push("robots.txt: создан");

// canonical, чтобы страницы.dev не конкурировали с доменом в поиске
let h = readFileSync("index.html", "utf8");
if (h.indexOf("rel=\"canonical\"") < 0) {
  const canon = [
    "    <link rel=\"canonical\" href=\"" + SITE + "/\" />",
    "    <meta name=\"robots\" content=\"index, follow\" />"
  ].join("\n");
  if (h.indexOf("</head>") >= 0) {
    h = h.replace("</head>", canon + "</head>");
    writeFileSync("index.html", h);
    log.push("canonical: добавлен в index.html");
  } else {
    log.push("ВНИМАНИЕ: </head> не найден");
  }
} else {
  log.push("canonical: уже есть");
}

console.log(log.join("\n"));
