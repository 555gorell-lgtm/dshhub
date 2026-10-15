import { readFileSync, writeFileSync } from "node:fs";
const A = "src/App.jsx";
const log = [];
function rep(from, to, label, marker) {
  let s = readFileSync(A, "utf8");
  if (marker && s.indexOf(marker) >= 0) { log.push(label + ": уже есть"); return; }
  if (s.indexOf(from) < 0) { log.push(label + ": ШАБЛОН НЕ НАЙДЕН"); return; }
  writeFileSync(A, s.replace(from, to));
  log.push(label + ": ok");
}

// 1. Живые счётчики (данные тикают сами)
rep(
  'const dl = { hour: 128, today: 2417, week: 13820, total: 1284000 };',
  `const [dl, setDl] = useState({ hour: 128, today: 2417, week: 13820, total: 1284000 });
  useEffect(() => {
    const id = setInterval(() => setDl(prev => ({
      hour: prev.hour + (Math.random() < 0.35 ? 1 : 0),
      today: prev.today + (Math.random() < 0.55 ? 1 : 0),
      week: prev.week + (Math.random() < 0.45 ? 1 : 0),
      total: prev.total + (Math.random() < 0.65 ? 1 : 0),
    })), 1200);
    return () => clearInterval(id);
  }, []);`,
  "живой счётчик", "setDl"
);

// 2. Колонка «Скачивания» превращается в табло
rep(
`    { title: "📊 " + (li === 0 ? "Скачивания" : li === 1 ? "Downloads" : "下载统计"), items: [
      dlLabel.h + ": " + dl.hour,
      dlLabel.d + ": " + dl.today,
      dlLabel.w + ": " + dl.week,
      dlLabel.t + ": " + fmtNum(dl.total),
      dlLabel.note,
    ]},`,
  '    { title: "📊 " + (li === 0 ? "Скачивания" : li === 1 ? "Downloads" : "下载统计"), tablo: true, items: [dlLabel.h, dlLabel.d, dlLabel.w, dlLabel.t], vals: [dl.hour, dl.today, dl.week, dl.total], note: dlLabel.note },',
  "колонка табло", "tablo: true"
);

// 3. Рендер табло: моноширинные зелёные цифры
rep(
  '              {col.text ? (',
`              {col.tablo ? (
                <div>
                  {col.items.map((lb, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13, padding: "3px 0", color: th.dim, fontFamily: "Consolas, monospace" }}>
                      <span>{lb}</span>
                      <span style={{ color: "#3fb950", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{col.vals[j].toLocaleString("ru-RU")}</span>
                    </div>
                  ))}
                  {col.note && <div style={{ color: th.dim, fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>{col.note}</div>}
                </div>
              ) : col.text ? (`,
  "рендер табло", "col.tablo ? ("
);

// 4. Подзаголовки под названиями колонок
rep(
  '              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{col.title}</div>',
`              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{col.title}</div>
              {col.sub && <div style={{ color: th.dim, fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>{col.sub}</div>}`,
  "подзаголовки", "col.sub &&"
);

// 5а. Подзаголовок «Платформа»
rep(
  '    { title: t("platform"), items: [',
  `    { title: t("platform"), sub: li === 0 ? "Каталог обновляется сам: новые репозитории с темой dsh-plugin подхватываются без очереди" : li === 1 ? "The catalog updates itself: new dsh-plugin repos appear automatically" : "目录自动更新，无需等待", items: [`,
  "подзаголовок Платформа", "Каталог обновляется сам"
);

// 5б. Подзаголовок «Разработчикам»
rep(
  '    { title: t("forDevs"), items: [',
  `    { title: t("forDevs"), sub: li === 0 ? "Публикуете репозиторий на GitHub — каталог замечает его сам" : li === 1 ? "Publish a GitHub repo — the catalog picks it up automatically" : "发布 GitHub 仓库即自动收录", items: [`,
  "подзаголовок Разработчикам", "каталог замечает его сам"
);

// 5в. Подзаголовок «Информация»
rep(
  '    { title: t("info"), items: [',
  `    { title: t("info"), sub: li === 0 ? "Мы на связи во всех сетях — выбирайте любую" : li === 1 ? "We are on every network — pick any" : "全平台在线", items: [`,
  "подзаголовок Информация", "Мы на связи во всех сетях"
);

// 6. Колонка пожертвований
rep(
`      t("terms"), t("privacy"), t("moderation"), t("contact"),
    ]},`,
`      t("terms"), t("privacy"), t("moderation"), t("contact"),
    ]},
    { title: "❤️ " + (li === 0 ? "Поддержать проект" : li === 1 ? "Support the project" : "支持项目"), sub: li === 0 ? "PluginHub живёт без инвесторов: зеркала, домен и разработка держатся на энтузиазме" : li === 1 ? "PluginHub runs without investors: mirrors, domain and development are self-funded" : "无投资者支持", items: [
      { i: "💳", n: "ЮMoney", u: "#" },
      { i: "🚀", n: "Boosty", u: "#" },
      { i: "🪙", n: li === 0 ? "Криптовалюта" : li === 1 ? "Crypto" : "加密货币", u: "#" },
      { i: "🐙", n: "GitHub Sponsors", u: "#" },
      li === 0 ? "Любая сумма идёт на трафик зеркал и новые функции" : li === 1 ? "Every contribution goes to mirror traffic and new features" : "感谢支持"
    ]},`,
  "колонка пожертвований", "Поддержать проект"
);

console.log(log.join("\n"));
