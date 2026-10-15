import { readFileSync, writeFileSync } from "node:fs";
const f = "src/App.jsx";
let s = readFileSync(f, "utf8");
const log = [];

// ==== 1. Тикер (если ещё не добавлен) ====
if (s.indexOf("ph-ticker-track") < 0) {
  const L = [
    "const TICKER_ITEMS = [",
    '  { n: "\u{1F195} \u041D\u043E\u0432\u044B\u0435 \u043C\u043E\u0434\u0435\u043B\u0438 \u0418\u0418 \u2014 \u043E\u0431\u0437\u043E\u0440 \u043D\u0435\u0434\u0435\u043B\u0438", u: "https://www.youtube.com/@viktorgamesandbusinessgore440" },',
    '  { n: "\u{1F50C} \u041A\u0430\u043A \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043F\u043B\u0430\u0433\u0438\u043D\u044B \u043A \u043D\u043E\u0432\u043E\u0439 \u043C\u043E\u0434\u0435\u043B\u0438 \u2014 \u0433\u0430\u0439\u0434\u044B \u043D\u0430 YouTube", u: "https://www.youtube.com/@viktorgamesandbusinessgore440" },',
    '  { n: "\u{1F3AC} \u0412\u0438\u0434\u0435\u043E\u043E\u0431\u0437\u043E\u0440\u044B \u043C\u043E\u0434\u0435\u043B\u0435\u0439 \u0418\u0418 \u2014 Rutube", u: "https://rutube.ru/search/?text=\u043D\u043E\u0432\u044B\u0435+\u043C\u043E\u0434\u0435\u043B\u0438+\u0418\u0418" },',
    '  { n: "\u{1F4AC} \u041D\u043E\u0432\u043E\u0441\u0442\u0438 \u0418\u0418 \u0438 \u043F\u043B\u0430\u0433\u0438\u043D\u043E\u0432 \u2014 \u043A\u0430\u043D\u0430\u043B \u0432 MAX", u: "https://max.ru/u/f9LHodD0cOKYNaEcNaqKkR0YWam2Zu6PLq0OkBdVs1MJMEhd0jludaVSNPw" },',
    "];",
    "",
    "function Ticker({ th }) {",
    "  const set = (k) => TICKER_ITEMS.map((it, i) => (",
    '    <a key={k + i} href={it.u} target="_blank" rel="noreferrer" style={{ color: th.tag, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>{it.n}</a>',
    "  ));",
    "  return (",
    '    <div style={{ background: th.adBg, border: "1px solid " + th.border, borderRadius: 8, overflow: "hidden", margin: "0 0 16px" }}>',
    '      <style>{".ph-ticker-track{display:inline-flex;white-space:nowrap;padding:8px 0;animation:ph-ticker-scroll 30s linear infinite}.ph-ticker-wrap:hover .ph-ticker-track{animation-play-state:paused}.ph-ticker-set{display:inline-flex;gap:40px;padding-right:40px}.ph-ticker-set a:hover{text-decoration:underline}@keyframes ph-ticker-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}"}</style>',
    '      <div className="ph-ticker-wrap" style={{ overflow: "hidden" }}>',
    '        <div className="ph-ticker-track">',
    '          <div className="ph-ticker-set">{set("a")}</div>',
    '          <div className="ph-ticker-set" aria-hidden="true">{set("b")}</div>',
    "        </div>",
    "      </div>",
    "    </div>",
    "  );",
    "}",
    ""
  ].join("\n");
  s = s.replace("function App() {", L + "\nfunction App() {");
  s = s.replace("        <AdSlot li={li} th={th} />", "        <Ticker li={li} th={th} />\n        <AdSlot li={li} th={th} />");
  log.push("\u0442\u0438\u043A\u0435\u0440: \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D");
} else {
  log.push("\u0442\u0438\u043A\u0435\u0440: \u0443\u0436\u0435 \u0435\u0441\u0442\u044C");
}

// ==== 2. Соцсети: пересобираем блок с реальными ссылками ====
if (s.indexOf("555gorell1") < 0) {
  const from = s.indexOf("      socialLabel,");
  const to = s.indexOf('      t("terms")', from);
  if (from >= 0 && to > from) {
    const BLOCK = [
      "      socialLabel,",
      "      { i: \"\u{1F4DE}\", n: \"E-mail\", u: \"mailto:gorelov8business@gmail.com\" },",
      "      { i: \"\u{1F4AC}\", n: \"WhatsApp Business\", u: \"https://wa.me/79505793201\" },",
      "      { i: \"\u2708\uFE0F\", n: \"Telegram\", u: \"#\" },",
      "      { i: \"\u{1F7E2}\", n: \"MAX\", u: \"https://max.ru/u/f9LHodD0cOKYNaEcNaqKkR0YWam2Zu6PLq0OkBdVs1MJMEhd0jludaVSNPw\" },",
      "      { i: \"\u{1F535}\", n: \"VK\", u: \"#\" },",
      "      { i: \"\u25B6\uFE0F\", n: \"YouTube\", u: \"https://www.youtube.com/@viktorgamesandbusinessgore440\" },",
      "      { i: \"\u{1F4FA}\", n: \"Rutube\", u: \"#\" },",
      "      { i: \"\u{1F4CC}\", n: \"Pinterest\", u: \"https://ru.pinterest.com/555gorell/_saved/\" },",
      "      { i: \"\u{1F7E0}\", n: \"\u041E\u0434\u043D\u043E\u043A\u043B\u0430\u0441\u0441\u043D\u0438\u043A\u0438\", u: \"#\" },",
      "      { i: \"\u{1F4D8}\", n: \"Facebook\", u: \"https://www.facebook.com/Ten-Stars-Design-2081341318827570/\" },",
      "      { i: \"\u{1F4F7}\", n: \"Instagram\", u: \"#\" },",
      "      { i: \"\u2716\uFE0F\", n: \"Twitter / X\", u: \"https://x.com/555gorell1\" },",
      "      { i: \"\u{1F9F5}\", n: \"Threads\", u: \"https://www.threads.com/@tenstarsdesign\" },",
      "      { i: \"\u{1F3AE}\", n: \"Discord\", u: \"#\" },",
    ].join("\n");
    s = s.slice(0, from) + BLOCK + s.slice(to);
    log.push("\u0441\u043E\u0446\u0441\u0435\u0442\u0438: WhatsApp, E-mail, X, Facebook, Threads \u0432\u0448\u0438\u0442\u044B");
  } else {
    log.push("\u0412\u041D\u0418\u041C\u0410\u041D\u0418\u0415: \u0431\u043B\u043E\u043A socialLabel \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
  }
} else {
  log.push("\u0441\u043E\u0446\u0441\u0435\u0442\u0438: \u0443\u0436\u0435 \u0432\u0448\u0438\u0442\u044B");
}

// ==== 3. Пометка про Meta ====
if (s.indexOf("\u043F\u0440\u0438\u0437\u043D\u0430\u043D\u0430 \u044D\u043A\u0441\u0442\u0440\u0435\u043C\u0438\u0441\u0442\u0441\u043A\u043E\u0439") < 0) {
  s = s.replace("<span>v0.6.3</span>", "<span>Instagram \u0438 Facebook \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u0430\u0442 Meta \u2014 \u043F\u0440\u0438\u0437\u043D\u0430\u043D\u0430 \u044D\u043A\u0441\u0442\u0440\u0435\u043C\u0438\u0441\u0442\u0441\u043A\u043E\u0439 \u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u0430 \u0432 \u0420\u0424</span>\n          <span>v0.6.3</span>");
  log.push("\u043F\u043E\u043C\u0435\u0442\u043A\u0430 Meta: \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430");
}

writeFileSync(f, s);
console.log(log.join("\n"));
