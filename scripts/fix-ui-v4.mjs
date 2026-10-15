import { readFileSync, writeFileSync } from "node:fs";
const log = [];

// ==== 1. Метрика в index.html ====
{
  const f = "index.html";
  let h = readFileSync(f, "utf8");
  if (h.indexOf("mc.yandex.ru") < 0) {
    const M = [
      "<!-- Yandex.Metrika counter -->",
      "<script type=\"text/javascript\">",
      "    (function(m,e,t,r,i,k,a){",
      "        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};",
      "        m[i].l=1*new Date();",
      "        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}",
      "        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)",
      "    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=113386707', 'ym');",
      "",
      "    ym(113386707, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:\"dataLayer\", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});",
      "</script>",
      "<noscript><div><img src=\"https://mc.yandex.ru/watch/113386707\" style=\"position:absolute; left:-9999px;\" alt=\"\" /></div></noscript>",
      "<!-- /Yandex.Metrika counter -->",
      ""
    ].join("\n");
    if (h.indexOf("</body>") >= 0) {
      h = h.replace("</body>", M + "</body>");
      writeFileSync(f, h);
      log.push("Метрика: вставлена в index.html");
    } else {
      log.push("ВНИМАНИЕ: </body> в index.html не найден");
    }
  } else {
    log.push("Метрика: уже есть");
  }
}

// ==== 2. Категории — в шапку ====
let s = readFileSync("src/App.jsx", "utf8");
if (s.indexOf("ph-cats-in-header") < 0) {
  const catStart = s.indexOf('<div style={{ display: "flex", gap: 6, padding: "12px 20px 4px"');
  const catEnd = catStart >= 0 ? s.indexOf('<div style={{ padding: "4px 20px 8px"', catStart) : -1;
  if (catEnd > catStart) {
    let cats = s.slice(catStart, catEnd);
    s = s.slice(0, catStart) + s.slice(catEnd);
    cats = cats.replace(
      '<div style={{ display: "flex", gap: 6, padding: "12px 20px 4px", overflowX: "auto", flexWrap: "wrap" }}>',
      '<div className="ph-cats-in-header" style={{ display: "flex", gap: 6, padding: "8px 20px", width: "100%", overflowX: "auto", flexWrap: "wrap" }}>'
    );
    const hEnd = s.indexOf("      </header>");
    if (hEnd >= 0) {
      s = s.slice(0, hEnd) + cats + "      </header>" + s.slice(hEnd + 15);
      log.push("категории: перенесены в шапку");
    } else {
      log.push("ВНИМАНИЕ: </header> не найден, категории не перенесены");
    }
  } else {
    log.push("ВНИМАНИЕ: блок категорий не найден");
  }
} else {
  log.push("категории: уже в шапке");
}

// ==== 3. Переводчик: вставить/копировать + кнопка на карточке ====
if (s.indexOf("function TranslatorModal({ li, onClose, seed })") < 0) {
  s = s.replace("function TranslatorModal({ li, onClose }) {", "function TranslatorModal({ li, onClose, seed }) {");
}
if (s.indexOf('const [text, setText] = useState(seed || "");') < 0) {
  s = s.replace('const [text, setText] = useState("");', 'const [text, setText] = useState(seed || "");');
}
if (s.indexOf("const paste = async () => {") < 0) {
  const tm = s.indexOf("function TranslatorModal");
  const retIdx = s.indexOf("  return (", tm);
  if (retIdx > tm) {
    const INS = [
      "  const paste = async () => {",
      "    try { const clip = await navigator.clipboard.readText(); if (clip) setText(clip); } catch (e) {}",
      "  };",
      "",
      "  const copyOut = async () => {",
      "    try { if (out) await navigator.clipboard.writeText(out); } catch (e) {}",
      "  };",
      "",
      ""
    ].join("\n");
    s = s.slice(0, retIdx) + INS + s.slice(retIdx);
    log.push("переводчик: функции вставки/копирования добавлены");
  } else {
    log.push("ВНИМАНИЕ: return в TranslatorModal не найден");
  }
}
const btnOld = [
  "        <button style={primaryBtn} onClick={go} disabled={busy}>",
  "          {busy ? \"…\" : t(\"trBtn\")}",
  "        </button>"
].join("\n");
if (s.indexOf(btnOld) >= 0) {
  const btnNew = [
    "        <div style={{ display: \"flex\", gap: 8, flexWrap: \"wrap\", alignItems: \"center\" }}>",
    "          <button style={primaryBtn} onClick={go} disabled={busy}>",
    "            {busy ? \"…\" : t(\"trBtn\")}",
    "          </button>",
    "          <button style={ghostBtn} onClick={paste}>📋 {li === 0 ? \"Вставить\" : li === 1 ? \"Paste\" : \"粘贴\"}</button>",
    "          {out && <button style={ghostBtn} onClick={copyOut}>📋 {li === 0 ? \"Копировать перевод\" : li === 1 ? \"Copy translation\" : \"复制译文\"}</button>}",
    "        </div>"
  ].join("\n");
  s = s.replace(btnOld, btnNew);
  log.push("переводчик: кнопки Вставить/Копировать добавлены");
} else {
  log.push("переводчик: кнопки уже стоят или шаблон не найден");
}

// InfoModal: кнопка «Перевести описание»
if (s.indexOf("function InfoModal({ repo, li, onClose, onTag, onTranslate })") < 0) {
  s = s.replace("function InfoModal({ repo, li, onClose, onTag }) {", "function InfoModal({ repo, li, onClose, onTag, onTranslate }) {");
  const aIdx = s.indexOf("          <a href={repo.html_url}");
  if (aIdx >= 0) {
    const bIns = [
      "          <button style={ghostBtn} onClick={() => onTranslate(repo.description || repo.name)}>🌍 {li === 0 ? \"Перевести описание\" : li === 1 ? \"Translate description\" : \"翻译描述\"}</button>",
      ""
    ].join("\n");
    s = s.slice(0, aIdx) + bIns + s.slice(aIdx);
    log.push("карточка: кнопка «Перевести описание» добавлена");
  } else {
    log.push("ВНИМАНИЕ: блок кнопок InfoModal не найден");
  }
}

// App: состояние seed и проброс пропсов
if (s.indexOf("const [trSeed, setTrSeed]") < 0) {
  s = s.replace("  const [packOpen, setPackOpen] = useState(false);", "  const [packOpen, setPackOpen] = useState(false);\n  const [trSeed, setTrSeed] = useState(\"\");");
}
s = s.replace('<TranslatorModal li={li} onClose={() => setTrOpen(false)} />', '<TranslatorModal li={li} onClose={() => setTrOpen(false)} seed={trSeed} />');
if (s.indexOf("onTranslate={(txt)") < 0) {
  s = s.replace(
    '<InfoModal repo={infoRepo} li={li} onClose={() => setInfoRepo(null)} onTag={searchByTag} />',
    '<InfoModal repo={infoRepo} li={li} onClose={() => setInfoRepo(null)} onTag={searchByTag} onTranslate={(txt) => { setTrSeed(txt || ""); setInfoRepo(null); setTrOpen(true); }} />'
  );
}

writeFileSync("src/App.jsx", s);
console.log(log.join("\n"));
