import { readFileSync, writeFileSync } from "node:fs";
const log = [];
const A = "src/App.jsx";
function rep(f, from, to, label) {
  let s = readFileSync(f, "utf8");
  if (s.indexOf(from) < 0) { log.push(label + ": \u0428\u0410\u0411\u041B\u041E\u041D \u041D\u0415 \u041D\u0410\u0419\u0414\u0415\u041D"); return; }
  writeFileSync(f, s.replace(from, to));
  log.push(label + ": ok");
}

// ==== 1. Быстрый переводчик: Google -> MyMemory ====
rep(A,
'      const r = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + src + "|" + dst);\n      const j = await r.json();\n      setOut((j.responseData && j.responseData.translatedText) || "");\n      if (!j.responseData) setErr(t("trErr"));',
'      let out2 = "";\n      try {\n        const sl = src === "zh" ? "zh-CN" : src;\n        const tl = dst === "zh" ? "zh-CN" : dst;\n        const g = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sl + "&tl=" + tl + "&dt=t&q=" + encodeURIComponent(text));\n        const gj = await g.json();\n        if (gj && gj[0]) out2 = gj[0].map(x => x[0]).join("");\n      } catch (e) {}\n      if (!out2) {\n        const r = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + src + "|" + dst);\n        const j = await r.json();\n        out2 = (j.responseData && j.responseData.translatedText) || "";\n      }\n      setOut(out2);\n      if (!out2) setErr(t("trErr"));',
"\u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0447\u0438\u043A \u0431\u044B\u0441\u0442\u0440\u044B\u0439");

// ==== 2. Автоязык по браузеру ====
rep(A,
'  const [packOpen, setPackOpen] = useState(false);',
'  const [packOpen, setPackOpen] = useState(false);\n  useEffect(() => {\n    const l = (navigator.language || "ru").toLowerCase();\n    if (l.startsWith("zh")) setLi(2); else if (!l.startsWith("ru")) setLi(1);\n  }, []);',
"\u0430\u0432\u0442\u043E\u044F\u0437\u044B\u043A");

// ==== 3. Кнопка \u00C2 на карточке ====
rep(A,
'                <button style={ghostBtn} onClick={() => setInfoRepo(p)}>{t("about")}</button>',
'                <button style={ghostBtn} title={li === 0 ? "\u041F\u0435\u0440\u0435\u0432\u0435\u0441\u0442\u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" : li === 1 ? "Translate description" : "\u7FFB\u8BD1\u63CF\u8FF0"} onClick={() => { setTrSeed(p.description || ""); setTrOpen(true); }}>🌍</button>\n                <button style={ghostBtn} onClick={() => setInfoRepo(p)}>{t("about")}</button>',
"\u043A\u043D\u043E\u043F\u043A\u0430 \u00C2 \u043D\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435");

// ==== 4. Подвал: кликабельные пункты ====
rep(A,
'      t("allPlugins") + " \u2014 " + fmtNum(total),',
'      { i: "\u{1F310}", n: t("allPlugins") + " \u2014 " + fmtNum(total), act: "all" },',
"\u043F\u043E\u0434\u0432\u0430\u043B: \u0432\u0441\u0435 \u043F\u043B\u0430\u0433\u0438\u043D\u044B");
rep(A,
'      t("top"), t("fresh"),',
'      { i: "\u2B50", n: t("top"), act: "top" },\n      { i: "\u{1F195}", n: t("fresh"), act: "fresh" },',
"\u043F\u043E\u0434\u0432\u0430\u043B: \u0442\u043E\u043F/\u043D\u043E\u0432\u043E\u0435");
rep(A,
'      t("uploadPlugin") + " \u2014 " + fmtNum(total) + " " + availWord,\n      t("docs"),',
'      { i: "\u2B06\uFE0F", n: t("uploadPlugin") + " \u2014 " + fmtNum(total) + " " + availWord, u: "https://github.com/new" },\n      { i: "\u{1F4D8}", n: t("docs"), u: "https://docs.github.com/" },',
"\u043F\u043E\u0434\u0432\u0430\u043B: \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430/\u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F");

// ==== 5. API \u2014 ссылки на официальные доки ====
const apiReps = [
  ["GitHub Search API",
   '{ i: "\u00B7", n: "GitHub Search API \u2014 " + (li === 0 ? "\u043F\u043E\u0438\u0441\u043A \u043F\u043B\u0430\u0433\u0438\u043D\u043E\u0432" : li === 1 ? "plugin search" : "\u63D2\u4EF6\u641C\u7D22"), u: "https://docs.github.com/rest/search" },'],
  ["GitHub Repos API",
   '{ i: "\u00B7", n: "GitHub Repos API \u2014 " + (li === 0 ? "\u0434\u0435\u0442\u0430\u043B\u0438, \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u0438, \u0440\u0430\u0437\u043C\u0435\u0440" : li === 1 ? "details, licenses, size" : "\u8BE6\u60C5\u3001\u8BB8\u53EF\u3001\u5927\u5C0F"), u: "https://docs.github.com/rest/repos/repos" },'],
  ["MyMemory API",
   '{ i: "\u00B7", n: "\u041F\u0435\u0440\u0435\u0432\u043E\u0434\u0447\u0438\u043A \u2014 Google + MyMemory (\u0437\u0430\u043F\u0430\u0441)", u: "https://mymemory.translated.net/doc/spec.php" },'],
  ["\u0420\u0421\u042F API",
   '{ i: "\u00B7", n: "\u0420\u0421\u042F API \u2014 " + (li === 0 ? "\u0440\u0435\u043A\u043B\u0430\u043C\u0430 (\u043F\u043B\u0430\u043D)" : li === 1 ? "ads (planned)" : "\u5E7F\u544A\uFF08\u8BA1\u5212\uFF09"), u: "https://partner.yandex.ru" },'],
  ["VirusTotal API",
   '{ i: "\u00B7", n: "VirusTotal API \u2014 " + (li === 0 ? "\u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0444\u0430\u0439\u043B\u043E\u0432 (\u043F\u043B\u0430\u043D)" : li === 1 ? "file scan (planned)" : "\u6587\u4EF6\u626B\u63CF\uFF08\u8BA1\u5212\uFF09"), u: "https://docs.virustotal.com/" },'],
];
{
  let s = readFileSync(A, "utf8");
  for (const [key, line] of apiReps) {
    const idx = s.indexOf(key);
    if (idx < 0) { log.push("API " + key + ": \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D"); continue; }
    const ls = s.lastIndexOf("\n", idx) + 1;
    const le = s.indexOf("\n", idx);
    if (s.slice(ls, le).indexOf("u:") >= 0) { log.push("API " + key + ": \u0443\u0436\u0435 \u0435\u0441\u0442\u044C"); continue; }
    s = s.slice(0, ls) + "      " + line + s.slice(le);
  }
  writeFileSync(A, s);
  log.push("API-\u0441\u0441\u044B\u043B\u043A\u0438: \u0433\u043E\u0442\u043E\u0432\u043E");
}

// ==== 6. Рендер подвала: поддержка act ====
rep(A,
'                  it && typeof it === "object" ? (',
'                  it && typeof it === "object" && it.act ? (\n                    <button key={j} onClick={() => { if (it.act === "all") { setCat("all"); setQ("dsh-plugin"); } else if (it.act === "top") setSort("stars"); else if (it.act === "fresh") setSort("updated"); }} style={{ display: "block", background: "none", border: "none", color: th.dim, fontSize: 13, padding: "3px 0", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}\n                      onMouseEnter={e => e.currentTarget.style.color = th.accent}\n                      onMouseLeave={e => e.currentTarget.style.color = th.dim}>{it.i} {it.n}</button>\n                  ) : it && typeof it === "object" ? (',
"\u0440\u0435\u043D\u0434\u0435\u0440 \u043F\u043E\u0434\u0432\u0430\u043B\u0430");

// ==== 7. lang="ru" в index.html ====
{
  const f = "index.html";
  let h = readFileSync(f, "utf8");
  if (h.indexOf('lang="en"') >= 0) { writeFileSync(f, h.replace('lang="en"', 'lang="ru"')); log.push("lang=ru: ok"); }
  else if (h.indexOf('lang="ru"') >= 0) log.push("lang=ru: \u0443\u0436\u0435 \u0435\u0441\u0442\u044C");
  else log.push("lang: \u0430\u0442\u0440\u0438\u0431\u0443\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u2014 \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u044E");
}

console.log(log.join("\n"));
