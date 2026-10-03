import React, { useState, useEffect, useCallback, useRef } from "react";

const LANGS = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "zh", label: "ZH" },
];

const TR_NAMES = { ru: "Русский", en: "English", zh: "中文", es: "Español", de: "Deutsch", fr: "Français", ja: "日本語", ko: "한국어" };

const CATS = [
  { id: "all", topic: null, icon: "🌐", name: ["Все", "All", "全部"], desc: ["Все плагины без фильтра", "All plugins, no filter", "全部插件，无筛选"] },
  { id: "tools", topic: "tools", icon: "🔧", name: ["Инструменты", "Tools", "工具"], desc: ["Утилиты, CLI, автоматизация, конвертеры, файловые менеджеры", "Utilities, CLI, automation, converters, file managers", "实用工具、CLI、自动化、转换器"] },
  { id: "ui", topic: "ui", icon: "🎨", name: ["Интерфейс", "UI", "界面"], desc: ["Дизайн, UI-компоненты, сайдбары, виджеты, оверлеи", "Design, UI components, sidebars, widgets, overlays", "设计、UI 组件、侧边栏、小部件"] },
  { id: "models", topic: "llm", icon: "🤖", name: ["Модели", "Models", "模型"], desc: ["LLM, эмбеддинги, реранкеры, локальные модели (Ollama, GGUF)", "LLMs, embeddings, rerankers, local models (Ollama, GGUF)", "LLM、嵌入、重排序、本地模型"] },
  { id: "security", topic: "security", icon: "🛡️", name: ["Безопасность", "Security", "安全"], desc: ["Антивирус-скан, аудит плагинов, песочницы, защита цепочки поставок", "Antivirus scan, plugin audits, sandboxes, supply-chain protection", "病毒扫描、插件审计、沙箱、供应链防护"] },
  { id: "terminal", topic: "terminal", icon: "⌨️", name: ["Терминал", "Terminal", "终端"], desc: ["PowerShell, Bash, TUI, эмуляторы, песочница команд", "PowerShell, Bash, TUI, emulators, command sandbox", "PowerShell、Bash、TUI、模拟器、命令沙箱"] },
  { id: "workflow", topic: "workflow", icon: "⚙️", name: ["Workflow", "Workflow", "工作流"], desc: ["Оркестрация агентов, CI/CD, джобы, автоматизация задач", "Agent orchestration, CI/CD, jobs, task automation", "智能体编排、CI/CD、任务自动化"] },
  { id: "themes", topic: "theme", icon: "🌙", name: ["Темы", "Themes", "主题"], desc: ["Скины, цветовые схемы, иконки, анимации интерфейса", "Skins, color schemes, icons, UI animations", "皮肤、配色、图标、界面动画"] },
];

const TR = {
  search: ["Поиск плагинов...", "Search plugins...", "搜索插件..."],
  find: ["Найти", "Search", "搜索"],
  login: ["Войти", "Sign in", "登录"],
  translator: ["🌍 Переводчик", "🌍 Translator", "🌍 翻译"],
  about: ["ℹ️ О плагине", "ℹ️ About", "ℹ️ 详情"],
  download: ["⬇ Скачать", "⬇ Download", "⬇ 下载"],
  downloadAd: ["⬇ Скачать", "⬇ Download", "⬇ 下载"],
  adTitle: ["Реклама перед загрузкой", "Ad before download", "下载前广告"],
  close: ["Закрыть", "Close", "关闭"],
  by: ["от", "by", "来自"],
  updated: ["обновлён", "updated", "更新于"],
  today: ["сегодня", "today", "今天"],
  yesterday: ["вчера", "yesterday", "昨天"],
  dAgo: ["{n} дн назад", "{n}d ago", "{n} 天前"],
  wAgo: ["{n} нед назад", "{n}w ago", "{n} 周前"],
  mAgo: ["{n} мес назад", "{n}mo ago", "{n} 个月前"],
  yAgo: ["{n} г назад", "{n}y ago", "{n} 年前"],
  loadMore: ["Загрузить ещё", "Load more", "加载更多"],
  loading: ["Загрузка...", "Loading...", "加载中..."],
  none: ["Ничего не найдено", "Nothing found", "未找到结果"],
  error: ["Ошибка", "Error", "错误"],
  stars: ["Звёзды", "Stars", "星标"],
  forks: ["Форки", "Forks", "复刻"],
  language: ["Язык", "Language", "语言"],
  license: ["Лицензия", "License", "许可证"],
  size: ["Размер", "Size", "大小"],
  created: ["Создан", "Created", "创建于"],
  tags: ["Теги", "Tags", "标签"],
  openGithub: ["Открыть на GitHub", "Open on GitHub", "在 GitHub 打开"],
  releases: ["Страница релизов", "Releases page", "发布页"],
  trTitle: ["Переводчик текста", "Text translator", "文本翻译"],
  trBtn: ["Перевести", "Translate", "翻译"],
  trInput: ["Введите текст для перевода...", "Enter text to translate...", "输入要翻译的文本..."],
  trErr: ["Ошибка перевода, попробуйте позже", "Translation error, try later", "翻译失败，请稍后重试"],
  aboutUs: ["О проекте", "About", "关于"],
  platform: ["Платформа", "Platform", "平台"],
  forDevs: ["Разработчикам", "For developers", "开发者"],
  info: ["Информация", "Information", "信息"],
  allPlugins: ["Все плагины", "All plugins", "全部插件"],
  categories: ["Категории", "Categories", "分类"],
  top: ["Топ за неделю", "Top this week", "本周热门"],
  fresh: ["Новые поступления", "New arrivals", "新上架"],
  uploadPlugin: ["Загрузить плагин", "Upload a plugin", "上传插件"],
  docs: ["Документация", "Documentation", "文档"],
  api: ["API", "API", "API"],
  terms: ["Условия использования", "Terms of use", "使用条款"],
  privacy: ["Конфиденциальность", "Privacy policy", "隐私政策"],
  moderation: ["Правила модерации", "Moderation rules", "审核规则"],
  contact: ["Связь с нами", "Contact us", "联系我们"],
  rights: ["Все права защищены", "All rights reserved", "版权所有"],
  aboutText: ["PluginHub — открытый каталог плагинов для DeepSeek Harness. Данные берутся напрямую из GitHub, поэтому каталог работает, даже если отдельные маркетплейсы закроются.", "PluginHub is an open catalog of DeepSeek Harness plugins. Data comes directly from GitHub, so the catalog keeps working even if individual marketplaces shut down.", "PluginHub 是 DeepSeek Harness 插件的开放目录。数据直接来自 GitHub，即使个别市场关闭也能继续运行。"],
};

function fmtNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
}

function agoStr(d, li) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff <= 0) return TR.today[li];
  if (diff === 1) return TR.yesterday[li];
  if (diff < 7) return TR.dAgo[li].replace("{n}", diff);
  if (diff < 30) return TR.wAgo[li].replace("{n}", Math.floor(diff / 7));
  if (diff < 365) return TR.mAgo[li].replace("{n}", Math.floor(diff / 30));
  return TR.yAgo[li].replace("{n}", Math.floor(diff / 365));
}

const MIRRORS = [
  { id: "r2", name: "PluginHub R2 (своё зеркало)", mbps: 25, live: false },
  { id: "proxy", name: "gh-proxy.com", mbps: 6, live: true },
  { id: "gh", name: "GitHub напрямую", mbps: 3, live: true },
];

function fmtTime(sec) {
  if (sec == null) return "—";
  if (sec < 1) return "< 1 с";
  if (sec < 60) return Math.round(sec) + " с";
  return Math.floor(sec / 60) + " м " + Math.round(sec % 60) + " с";
}

function estTime(sizeKB, mbps) {
  if (!sizeKB || sizeKB <= 0) return null;
  return (sizeKB / 1024) / mbps;
}

const detailCache = {};
function useRepoDetail(full) {
  const [d, setD] = useState(detailCache[full] || null);
  useEffect(() => {
    if (!full) return;
    if (detailCache[full]) { setD(detailCache[full]); return; }
    let a = true;
    fetch("https://api.github.com/repos/" + full)
      .then(r => r.json())
      .then(x => { if (a && x && x.size != null) { detailCache[full] = x; setD(x); } })
      .catch(() => {});
    return () => { a = false; };
  }, [full]);
  return d;
}

const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const modalBox = { background: "#161b22", border: "1px solid #30363d", borderRadius: 14, maxWidth: 560, width: "100%", padding: 24, color: "#e6edf3", maxHeight: "85vh", overflowY: "auto" };
const inputStyle = { padding: "8px 12px", borderRadius: 6, border: "1px solid #30363d", background: "#0d1117", color: "#e6edf3", fontSize: 14, outline: "none" };
const primaryBtn = { padding: "8px 16px", borderRadius: 6, border: "none", background: "#2f81f7", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 };
const ghostBtn = { padding: "8px 14px", borderRadius: 6, border: "1px solid #30363d", background: "#21262d", color: "#e6edf3", cursor: "pointer", fontSize: 13 };
const greenBtn = { padding: "8px 14px", borderRadius: 6, border: "none", background: "#238636", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 };

function CardMeta({ repo }) {
  const d = useRepoDetail(repo.full_name);
  const sizeStr = d ? (d.size >= 1024 ? (d.size / 1024).toFixed(1) + " MB" : d.size + " KB") : null;
  return <span style={{ whiteSpace: "nowrap" }}>{sizeStr ? "💾 " + sizeStr : "💾 …"} · 📦 ZIP</span>;
}

function AdModal({ repo, li, onClose }) {
  const t = (k) => TR[k][li];
  const d = useRepoDetail(repo.full_name);
  const [mode, setMode] = useState(null);
  const [left, setLeft] = useState(null);
  const [warn, setWarn] = useState(false);
  const [autoDl, setAutoDl] = useState(false);
  const [fired, setFired] = useState(false);
  const [mirror, setMirror] = useState("proxy");
  const downloadUrl = mirror === "proxy"
    ? "https://gh-proxy.com/https://github.com/" + repo.full_name + "/archive/refs/heads/main.zip"
    : "https://github.com/" + repo.full_name + "/releases";

  const L = [
    {
      choose: "Как получить плагин?",
      adNote: "Выберите тип рекламы — после просмотра скачивание откроется сразу",
      ad1: "🎬 Реклама 15 секунд", ad2: "🎬 Реклама 30 секунд", ad3: "🎬 Реклама 1 минута",
      bg: "🔕 Свернуть окно и подождать",
      bgNote: "Таймер идёт в фоне (до 2 минут). Окно закрывать нельзя — иначе плагин не скачается. Свернуть — можно.",
      auto: "Загрузка начнётся автоматически после ожидания",
      push: "Придёт пуш-уведомление «можно качать»",
      warnTitle: "⚠️ Предупреждение",
      warnText: "Если закроете окно — не сможете скачать плагин. Свернуть можно, но не больше 2 минут.",
      cont: "Продолжить",
      closeAnyway: "Всё равно закрыть",
      bgWait: "Ожидание в фоне",
      bgHint: "Окно можно свернуть — таймер идёт дальше. Закрывать нельзя.",
      mirrorTitle: "Зеркало загрузки — честное время:",
      honest: "Оценка по скорости зеркала; фактическое время зависит и от вашего интернета.",
      installNote: "Формат: ZIP · установка — распаковка, секунды",
    },
    {
      choose: "How to get the plugin?",
      adNote: "Pick an ad type — download unlocks right after watching",
      ad1: "🎬 15-second ad", ad2: "🎬 30-second ad", ad3: "🎬 1-minute ad",
      bg: "🔕 Minimize and wait",
      bgNote: "Timer runs in background (up to 2 minutes). Do not close the window — or the download is lost. Minimizing is fine.",
      auto: "Download starts automatically after the wait",
      push: "You will get a push notification when ready",
      warnTitle: "⚠️ Warning",
      warnText: "If you close this window, you will not be able to download the plugin. Minimizing is allowed — up to 2 minutes.",
      cont: "Continue",
      closeAnyway: "Close anyway",
      bgWait: "Waiting in background",
      bgHint: "You may minimize this window — the timer keeps running. Do not close it.",
      mirrorTitle: "Download mirror — honest ETA:",
      honest: "Estimate at mirror speed; your connection decides the rest.",
      installNote: "Format: ZIP archive · install by unzipping, takes seconds",
    },
    {
      choose: "如何获取插件？",
      adNote: "选择广告类型，观看后立即解锁下载",
      ad1: "🎬 15 秒广告", ad2: "🎬 30 秒广告", ad3: "🎬 1 分钟广告",
      bg: "🔕 最小化窗口并等待",
      bgNote: "计时器在后台运行（最多 2 分钟）。不能关闭窗口，否则无法下载插件。可以最小化。",
      auto: "等待结束后自动开始下载",
      push: "就绪后会收到推送通知",
      warnTitle: "⚠️ 注意",
      warnText: "关闭窗口后将无法下载插件。可以最小化窗口，但不超过 2 分钟。",
      cont: "继续",
      closeAnyway: "仍然关闭",
      bgWait: "后台等待中",
      bgHint: "窗口可以最小化，计时器继续运行。请勿关闭。",
      mirrorTitle: "下载镜像 — 真实预估：",
      honest: "按镜像速度估算，实际还取决于你的网络。",
      installNote: "格式：ZIP 压缩包 · 解压即装，只需几秒",
    },
  ][li];

  useEffect(() => {
    if (left == null || left <= 0) return;
    const id = setTimeout(() => setLeft(l => Math.max(0, (l || 0) - 1)), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const ready = left === 0;

  useEffect(() => {
    if (!ready || fired) return;
    setFired(true);
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("PluginHub", { body: repo.name + " — " + (li === 0 ? "можно качать!" : li === 1 ? "ready to download!" : "可以下载了！") });
      }
    } catch (e) {}
    if (autoDl) {
      const a = document.createElement("a");
      a.href = downloadUrl; a.target = "_blank"; a.rel = "noreferrer";
      document.body.appendChild(a); a.click(); a.remove();
    }
  }, [ready, fired, autoDl, downloadUrl]);

  const startAd = (n) => { setMode("ad"); setLeft(n); };
  const startBg = () => {
    setMode("bg"); setLeft(120);
    try { if ("Notification" in window && Notification.permission === "default") Notification.requestPermission(); } catch (e) {}
  };
  const tryClose = () => { if (mode && !ready && !warn) setWarn(true); else onClose(); };

  const elapsed = mode === "bg" ? 120 - (left || 0) : 0;
  const pct = mode === "bg" ? Math.round((elapsed / 120) * 100) : 0;
  const soonWord = li === 0 ? "скоро" : li === 1 ? "soon" : "即将上线";

  const mirrorPicker = ready && (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>🚚 {L.mirrorTitle}</div>
      {MIRRORS.map(m => {
        const eta = d ? estTime(d.size, m.mbps) : null;
        const sel = mirror === m.id;
        return (
          <button key={m.id} disabled={!m.live} onClick={() => setMirror(m.id)}
            style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", marginBottom: 6, borderRadius: 8, border: "1px solid " + (sel ? "#2f81f7" : "#30363d"), background: sel ? "#1f6feb22" : "#0d1117", color: m.live ? "#e6edf3" : "#8b949e", cursor: m.live ? "pointer" : "not-allowed", opacity: m.live ? 1 : 0.55 }}>
            <span>{m.live ? "✅" : "🕓"} {m.name}</span>
            <span style={{ fontSize: 12, color: "#8b949e" }}>
              {m.live ? "≈ " + fmtTime(eta) + " · ~" + m.mbps + " МБ/с" : soonWord}
            </span>
          </button>
        );
      })}
      <div style={{ fontSize: 11, color: "#8b949e" }}>{L.honest}</div>
      <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>{L.installNote}</div>
    </div>
  );

  return (
    <div style={overlay} onClick={tryClose}>
      <div style={{ ...modalBox, position: "relative" }} onClick={e => e.stopPropagation()}>
        {mode === null && (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{L.choose}</div>
            <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 14 }}>{L.adNote}</div>
            {[15, 30, 60].map(n => (
              <button key={n} onClick={() => startAd(n)}
                style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", marginBottom: 8, borderRadius: 8, border: "1px solid #30363d", background: "#0d1117", color: "#e6edf3", cursor: "pointer", fontSize: 14 }}>
                <span>{n === 15 ? L.ad1 : n === 30 ? L.ad2 : L.ad3}</span>
                <span style={{ color: "#3fb950", fontSize: 12 }}>{t("download")} →</span>
              </button>
            ))}
            <div style={{ borderTop: "1px solid #21262d", margin: "10px 0" }} />
            <button onClick={startBg}
              style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", marginBottom: 8, borderRadius: 8, border: "1px solid #a371f7", background: "#1f6feb11", color: "#e6edf3", cursor: "pointer", fontSize: 14 }}>
              <span>{L.bg}</span>
              <span style={{ color: "#8b949e", fontSize: 12 }}>⏱ 2:00</span>
            </button>
            <div style={{ color: "#8b949e", fontSize: 12, margin: "4px 0 10px" }}>{L.bgNote}</div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#c9d1d9", marginBottom: 4, cursor: "pointer" }}>
              <input type="checkbox" checked={autoDl} onChange={e => setAutoDl(e.target.checked)} />
              {L.auto}
            </label>
            <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 12 }}>🔔 {L.push}</div>
          </>
        )}

        {mode === "ad" && (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>📢 {t("adTitle")}</div>
            <div style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 8, height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "#8b949e", fontSize: 14, margin: "12px 0 16px" }}>
              📺 Рекламный блок · РСЯ / AdMob
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 32, fontWeight: 700, minWidth: 60, textAlign: "center", color: ready ? "#3fb950" : "#e6edf3" }}>
                {ready ? "✓" : (left || 0) + "с"}
              </div>
              <div style={{ flex: 1, height: 8, background: "#0d1117", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: (ready ? 100 : 0) + "%", height: "100%", background: "#2f81f7" }} />
              </div>
            </div>
            {ready && mirrorPicker}
          </>
        )}

        {mode === "bg" && (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>🔕 {L.bgWait}</div>
            <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 12 }}>{L.bgHint}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 32, fontWeight: 700, minWidth: 70, textAlign: "center", color: ready ? "#3fb950" : "#a371f7" }}>
                {ready ? "✓" : Math.floor((left || 0) / 60) + ":" + String((left || 0) % 60).padStart(2, "0")}
              </div>
              <div style={{ flex: 1, height: 8, background: "#0d1117", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: pct + "%", height: "100%", background: "#a371f7", transition: "width 1s linear" }} />
              </div>
            </div>
            {!ready && <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 12 }}>🔔 {L.push}</div>}
            {ready && mirrorPicker}
          </>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {ready ? (
            <a href={downloadUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button style={greenBtn}>{t("download")}</button>
            </a>
          ) : (
            <button style={{ ...greenBtn, opacity: 0.4, cursor: "not-allowed" }} disabled>{t("download")}</button>
          )}
          <button style={ghostBtn} onClick={tryClose}>{t("close")}</button>
        </div>

        {warn && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(1,4,9,.92)", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", zIndex: 2 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{L.warnTitle}</div>
            <div style={{ color: "#c9d1d9", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>{L.warnText}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={primaryBtn} onClick={() => setWarn(false)}>{L.cont}</button>
              <button style={ghostBtn} onClick={onClose}>{L.closeAnyway}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoModal({ repo, li, onClose, onTag }) {
  const t = (k) => TR[k][li];
  const d = useRepoDetail(repo.full_name);
  const sizeStr = d ? (d.size >= 1024 ? (d.size / 1024).toFixed(1) + " MB" : d.size + " KB") : "—";

  const Row = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0", borderBottom: "1px solid #21262d", fontSize: 13 }}>
      <span style={{ color: "#8b949e" }}>{label}</span>
      <span style={{ color: "#e6edf3", textAlign: "right" }}>{value}</span>
    </div>
  );

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <img src={repo.owner?.avatar_url} alt="" style={{ width: 44, height: 44, borderRadius: 8 }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{repo.name}</div>
            <div style={{ color: "#8b949e", fontSize: 12 }}>{t("by")} {repo.owner?.login}</div>
          </div>
        </div>

        <p style={{ color: "#c9d1d9", fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>{repo.description || "—"}</p>

        <Row label={"⭐ " + t("stars")} value={fmtNum(repo.stargazers_count)} />
        <Row label={"🔀 " + t("forks")} value={fmtNum(repo.forks_count)} />
        <Row label={"📄 " + t("language")} value={repo.language || "—"} />
        <Row label={"⚖️ " + t("license")} value={(d && d.license && d.license.spdx_id) || "—"} />
        <Row label={"💾 " + t("size")} value={sizeStr} />
        <Row label={"🕒 " + t("updated")} value={agoStr(repo.updated_at, li)} />
        {d && <Row label={"📅 " + t("created")} value={new Date(d.created_at).toLocaleDateString()} />}

        {repo.topics && repo.topics.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 6 }}>{t("tags")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {repo.topics.map(tg => (
                <button key={tg} onClick={() => { onClose(); onTag(tg); }} title={tg}
                  style={{ padding: "2px 10px", borderRadius: 12, background: "#1f6feb22", color: "#58a6ff", fontSize: 11, border: "1px solid transparent", cursor: "pointer", transition: "all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#2f81f7"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#1f6feb22"; e.currentTarget.style.color = "#58a6ff"; }}>
                  #{tg}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
          <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <button style={ghostBtn}>{t("openGithub")}</button>
          </a>
          <a href={"https://github.com/" + repo.full_name + "/releases"} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <button style={greenBtn}>{t("releases")}</button>
          </a>
        </div>
      </div>
    </div>
  );
}

function TranslatorModal({ li, onClose }) {
  const t = (k) => TR[k][li];
  const [text, setText] = useState("");
  const [src, setSrc] = useState("ru");
  const [dst, setDst] = useState("en");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const go = async () => {
    if (!text.trim()) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + src + "|" + dst);
      const j = await r.json();
      setOut((j.responseData && j.responseData.translatedText) || "");
      if (!j.responseData) setErr(t("trErr"));
    } catch (e) {
      setErr(t("trErr"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>🌍 {t("trTitle")}</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <select value={src} onChange={e => setSrc(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
            {Object.entries(TR_NAMES).map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
          <span style={{ alignSelf: "center" }}>→</span>
          <select value={dst} onChange={e => setDst(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
            {Object.entries(TR_NAMES).map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </div>

        <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t("trInput")} rows={4}
          style={{ ...inputStyle, width: "100%", boxSizing: "border-box", resize: "vertical", marginBottom: 10 }} />

        <button style={primaryBtn} onClick={go} disabled={busy}>
          {busy ? "…" : t("trBtn")}
        </button>

        {err && <div style={{ color: "#f85149", fontSize: 13, marginTop: 10 }}>{err}</div>}
        {out && (
          <div style={{ marginTop: 12, padding: 12, background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {out}
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button style={ghostBtn} onClick={onClose}>{t("close")}</button>
        </div>
      </div>
    </div>
  );
}

function PackRow({ repo, li, mirror, onSize }) {
  const d = useRepoDetail(repo.full_name);
  useEffect(() => { if (d && d.size) onSize(repo.id, d.size); }, [d, repo.id]);
  const m = MIRRORS.find(x => x.id === mirror) || MIRRORS[1];
  const sizeStr = d ? (d.size >= 1024 ? (d.size / 1024).toFixed(1) + " MB" : d.size + " KB") : "…";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderBottom: "1px solid #21262d" }}>
      <img src={repo.owner?.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: 6 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{repo.full_name}</div>
        <div style={{ fontSize: 11, color: "#8b949e" }}>
          {sizeStr} · ≈ {fmtTime(estTime(d ? d.size : null, m.mbps))} · {m.name}
        </div>
      </div>
    </div>
  );
}

function PackModal({ items, li, onClose }) {
  const T = (k) => TR[k][li];
  const [mirror, setMirror] = useState("proxy");
  const [sizes, setSizes] = useState({});
  const setSize = (id, s) => setSizes(prev => (prev[id] === s ? prev : { ...prev, [id]: s }));
  const totalKB = Object.values(sizes).reduce((a, b) => a + b, 0);

  const script = [
    "# PluginHub · пакетная загрузка · " + new Date().toISOString().slice(0, 10),
    "# Выбрано плагинов: " + items.length,
    "# Зеркала пробуются по порядку: gh-proxy.com -> GitHub напрямую (ветки main, затем master)",
    "",
    "$dest = Join-Path $PWD pluginhub-pack",
    "New-Item -ItemType Directory -Force -Path $dest | Out-Null",
    "$repos = @(",
    ...items.map(r => '  "' + r.full_name + '"'),
    ")",
    "",
    "foreach ($r in $repos) {",
    "  $done = $false",
    "  foreach ($br in 'main','master') {",
    "    if ($done) { break }",
    "    foreach ($m in @(",
    "      ('https://gh-proxy.com/https://github.com/' + $r + '/archive/refs/heads/' + $br + '.zip'),",
    "      ('https://github.com/' + $r + '/archive/refs/heads/' + $br + '.zip')",
    "    )) {",
    "      try {",
    "        Write-Host ('Скачиваю ' + $r + ' с ' + $m)",
    "        Invoke-WebRequest -Uri $m -OutFile (Join-Path $dest ($r.Replace('/','__') + '-' + $br + '.zip')) -ErrorAction Stop",
    "        Write-Host ('OK: ' + $r) -ForegroundColor Green",
    "        $done = $true; break",
    "      } catch { Write-Host ('не удалось: ' + $m) -ForegroundColor Yellow }",
    "    }",
    "  }",
    "  if (-not $done) { Write-Host ('НЕ скачан: ' + $r) -ForegroundColor Red }",
    "}",
    "",
    "Write-Host ('Готово. Файлы лежат в ' + $dest) -ForegroundColor Green",
  ].join("\n");

  const copy = () => { if (navigator.clipboard) navigator.clipboard.writeText(script); };
  const savePs1 = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u; a.download = "pluginhub-pack.ps1"; a.click();
    URL.revokeObjectURL(u);
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>📦 {li === 0 ? "Пакетная загрузка" : li === 1 ? "Batch download" : "批量下载"} ({items.length})</div>
        <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 12 }}>
          {li === 0 ? "Общий размер:" : li === 1 ? "Total size:" : "总大小："}{" "}
          {totalKB >= 1024 ? (totalKB / 1024).toFixed(1) + " MB" : totalKB > 0 ? totalKB + " KB" : "…"}
        </div>

        <div style={{ maxHeight: 220, overflowY: "auto", border: "1px solid #30363d", borderRadius: 8, marginBottom: 14 }}>
          {items.map(r => <PackRow key={r.id} repo={r} li={li} mirror={mirror} onSize={setSize} />)}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          🚚 {li === 0 ? "Зеркало — честное время загрузки всего пакета:" : li === 1 ? "Mirror — honest total ETA:" : "镜像 — 整包真实预估："}
        </div>
        {MIRRORS.map(m => {
          const eta = estTime(totalKB, m.mbps);
          const sel = mirror === m.id;
          return (
            <button key={m.id} disabled={!m.live} onClick={() => setMirror(m.id)}
              style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", marginBottom: 6, borderRadius: 8, border: "1px solid " + (sel ? "#2f81f7" : "#30363d"), background: sel ? "#1f6feb22" : "#0d1117", color: m.live ? "#e6edf3" : "#8b949e", cursor: m.live ? "pointer" : "not-allowed", opacity: m.live ? 1 : 0.55 }}>
              <span>{m.live ? "✅" : "🕓"} {m.name}</span>
              <span style={{ fontSize: 12, color: "#8b949e" }}>
                {m.live ? "≈ " + fmtTime(eta) + " · ~" + m.mbps + " МБ/с" : (li === 0 ? "скоро" : li === 1 ? "soon" : "即将上线")}
              </span>
            </button>
          );
        })}
        <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 14 }}>
          {li === 0 ? "Оценка по скорости зеркала, ваш интернет может быть быстрее или медленнее. Установка (распаковка) — секунды." : li === 1 ? "Estimate at mirror speed; your connection decides the rest. Unzip takes seconds." : "按镜像速度估算；解压只需几秒。"}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>📜 {li === 0 ? "Скрипт загрузки (PowerShell):" : li === 1 ? "Download script (PowerShell):" : "下载脚本（PowerShell）："}</div>
        <textarea readOnly value={script} rows={9}
          style={{ width: "100%", boxSizing: "border-box", background: "#0d1117", color: "#c9d1d9", border: "1px solid #30363d", borderRadius: 8, fontSize: 12, fontFamily: "Consolas, monospace", padding: 10 }} />
        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <button style={ghostBtn} onClick={copy}>📋 {li === 0 ? "Копировать" : li === 1 ? "Copy" : "复制"}</button>
          <button style={greenBtn} onClick={savePs1}>⬇ {li === 0 ? "Скачать .ps1" : li === 1 ? "Download .ps1" : "下载 .ps1"}</button>
          <button style={ghostBtn} onClick={onClose}>{T("close")}</button>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ li, onClose, onAuth }) {
  const isRu = li === 0, isEn = li === 1;
  const L = isRu ? {
    reg: "Регистрация", log: "Вход",
    email: "Электронная почта", pass: "Пароль (минимум 6 символов)", pass2: "Повторите пароль",
    agree: "Соглашаюсь с Условиями использования и Политикой конфиденциальности (152-ФЗ)",
    promo: "Присылать новости о новых плагинах (необязательно)",
    btnReg: "Создать аккаунт", btnLog: "Войти",
    oauth: "Или войти через:",
    oauthSoon: "Демо: OAuth через Яндекс ID и GitHub появится вместе с бэкендом",
    eEmail: "Введите корректный e-mail", ePass: "Пароль — минимум 6 символов",
    eMatch: "Пароли не совпадают", eAgree: "Нужно согласие с Условиями и Политикой",
    eNoAcc: "Такого аккаунта нет — зарегистрируйтесь",
  } : isEn ? {
    reg: "Sign up", log: "Sign in",
    email: "Email", pass: "Password (min 6 chars)", pass2: "Repeat password",
    agree: "I agree to the Terms of use and Privacy policy (GDPR-like consent)",
    promo: "Send me news about new plugins (optional)",
    btnReg: "Create account", btnLog: "Sign in",
    oauth: "Or sign in with:",
    oauthSoon: "Demo: OAuth via Yandex ID and GitHub arrives with the backend",
    eEmail: "Enter a valid email", ePass: "Password — minimum 6 characters",
    eMatch: "Passwords do not match", eAgree: "You must agree to Terms and Privacy",
    eNoAcc: "No such account — please sign up",
  } : {
    reg: "注册", log: "登录",
    email: "电子邮箱", pass: "密码（至少 6 位）", pass2: "再次输入密码",
    agree: "同意使用条款与隐私政策（数据保护同意）",
    promo: "接收新插件资讯（可选）",
    btnReg: "创建账号", btnLog: "登录",
    oauth: "或通过以下方式登录：",
    oauthSoon: "演示版：OAuth（Yandex ID / GitHub）将在接入后端后开放",
    eEmail: "请输入有效邮箱", ePass: "密码至少 6 位",
    eMatch: "两次密码不一致", eAgree: "必须同意条款与隐私政策",
    eNoAcc: "账号不存在，请先注册",
  };

  const [tab, setTab] = useState("reg");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [agree, setAgree] = useState(false);
  const [promo, setPromo] = useState(false);
  const [err, setErr] = useState(null);

  const submit = () => {
    setErr(null);
    const em = email.trim().toLowerCase();
    if (!em.includes("@") || em.length < 5) { setErr(L.eEmail); return; }
    if (pass.length < 6) { setErr(L.ePass); return; }
    if (tab === "reg") {
      if (pass !== pass2) { setErr(L.eMatch); return; }
      if (!agree) { setErr(L.eAgree); return; }
      const u = { email: em, plan: "free", since: Date.now(), promo };
      localStorage.setItem("ph_user", JSON.stringify(u));
      onAuth(u); onClose();
    } else {
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem("ph_user") || "null"); } catch (e) {}
      if (!saved || saved.email !== em) { setErr(L.eNoAcc); return; }
      onAuth(saved); onClose();
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...modalBox, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button onClick={() => { setTab("reg"); setErr(null); }} style={{ ...ghostBtn, flex: 1, background: tab === "reg" ? "#2f81f7" : "#21262d", color: tab === "reg" ? "#fff" : "#e6edf3", border: "none" }}>{L.reg}</button>
          <button onClick={() => { setTab("log"); setErr(null); }} style={{ ...ghostBtn, flex: 1, background: tab === "log" ? "#2f81f7" : "#21262d", color: tab === "log" ? "#fff" : "#e6edf3", border: "none" }}>{L.log}</button>
        </div>

        <input value={email} onChange={e => setEmail(e.target.value)} placeholder={L.email} type="email" style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: 8 }} />
        <input value={pass} onChange={e => setPass(e.target.value)} placeholder={L.pass} type="password" style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: 8 }} />
        {tab === "reg" && (
          <input value={pass2} onChange={e => setPass2(e.target.value)} placeholder={L.pass2} type="password" style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: 8 }} />
        )}

        {tab === "reg" && (
          <>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#c9d1d9", margin: "6px 0", cursor: "pointer" }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 2 }} />
              <span>{L.agree}</span>
            </label>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#c9d1d9", margin: "6px 0 10px", cursor: "pointer" }}>
              <input type="checkbox" checked={promo} onChange={e => setPromo(e.target.checked)} style={{ marginTop: 2 }} />
              <span>{L.promo}</span>
            </label>
          </>
        )}

        {err && <div style={{ color: "#f85149", fontSize: 13, margin: "4px 0 8px" }}>⚠️ {err}</div>}

        <button style={{ ...primaryBtn, width: "100%" }} onClick={submit}>{tab === "reg" ? L.btnReg : L.btnLog}</button>

        <div style={{ borderTop: "1px solid #21262d", margin: "14px 0 10px" }} />
        <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 8 }}>{L.oauth}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ ...ghostBtn, flex: 1 }} onClick={() => alert(L.oauthSoon)}>🅰 Яндекс ID</button>
          <button style={{ ...ghostBtn, flex: 1 }} onClick={() => alert(L.oauthSoon)}>🐙 GitHub</button>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ user, li, onClose, onLogout, onPricing }) {
  const isRu = li === 0, isEn = li === 1;
  const planName = isRu ? "Бесплатно" : isEn ? "Free" : "免费";
  const planNote = isRu ? "5 ГБ трафика зеркала в месяц · до 3 плагинов в пакете · реклама перед скачиванием"
    : isEn ? "5 GB mirror traffic per month · up to 3 plugins per pack · ads before download"
    : "每月 5 GB 镜像流量 · 打包最多 3 个 · 下载前广告";
  const pricing = isRu ? "Сменить тариф" : isEn ? "Change plan" : "更改套餐";
  const logout = isRu ? "Выйти" : isEn ? "Sign out" : "退出登录";
  const withUs = isRu ? "с нами" : isEn ? "with us" : "陪伴我们";
  const days = user && user.since ? Math.floor((Date.now() - user.since) / 86400000) : 0;
  const daysLabel = isRu ? (days === 1 ? "1 день" : days + " дн.") : isEn ? (days + (days === 1 ? " day" : " days")) : days + " 天";

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...modalBox, maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: "#2f81f7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{user ? user.email : ""}</div>
            <div style={{ color: "#8b949e", fontSize: 12 }}>{withUs}: {daysLabel}</div>
          </div>
        </div>
        <div style={{ padding: 12, background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>💳 {planName}</div>
          <div style={{ color: "#8b949e", fontSize: 12, lineHeight: 1.5 }}>{planNote}</div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button style={primaryBtn} onClick={() => { onClose(); onPricing(); }}>{pricing}</button>
          <button style={ghostBtn} onClick={() => { localStorage.removeItem("ph_user"); onLogout(); onClose(); }}>{logout}</button>
        </div>
      </div>
    </div>
  );
}

function PricingPage({ li, onClose }) {
  const [yearly, setYearly] = useState(false);
  const isRu = li === 0;
  const isEn = li === 1;
  const U = isRu ? "/мес" : isEn ? "/mo" : "/月";
  const YU = isRu ? "/год" : isEn ? "/yr" : "/年";
  const L = {
    title: isRu ? "💰 Цены PluginHub" : isEn ? "💰 PluginHub Pricing" : "💰 PluginHub 价格",
    sub: isRu ? "Простое и прозрачное ценообразование" : isEn ? "Simple and transparent pricing" : "简单透明的定价",
    users: isRu ? "Пользователи — тарифы скачивания" : isEn ? "Users — download plans" : "用户 — 下载套餐",
    devs: isRu ? "Разработчикам — продвижение и ревшэр" : isEn ? "Developers — promotion & rev-share" : "开发者 — 推广与分成",
    monthly: isRu ? "Ежемесячно" : isEn ? "Monthly" : "按月",
    yearly: isRu ? "Ежегодно (−20%)" : isEn ? "Yearly (−20%)" : "按年（−20%）",
    rec: isRu ? "Рекомендовано" : isEn ? "Recommended" : "推荐",
    note: isRu ? "Трафик — объём скачивания через наше зеркало R2. Сами плагины на GitHub бесплатны всегда." : isEn ? "Traffic = downloads through our R2 mirror. GitHub plugins themselves are always free." : "流量 = 通过 R2 镜像下载的量。GitHub 上的插件本身始终免费。",
    adsTitle: isRu ? "📢 Реклама и партнёры — честный статус" : isEn ? "📢 Ads & partners — honest status" : "📢 广告与合作伙伴 — 真实状态",
    fair: isRu ? "Без скрытых комиссий, отмена в любой день." : isEn ? "No hidden fees, cancel anytime." : "无隐藏费用，随时取消。",
    price: isRu ? "Цена" : isEn ? "Price" : "价格",
  };
  const adsRows = isRu ? [
    "РСЯ (Яндекс) — основная рекламная сеть для аудитории РФ, выплаты от 3000 ₽",
    "Google AdSense / AdMob — с августа 2024 не монетизируют аккаунты из России; работает только через зарубежный аккаунт и зарубежный счёт",
    "Adlook и внешние сети — альтернатива РСЯ, порог выплаты 1000 ₽",
    "Партнёры зеркал: Cloudflare R2 (10 ГБ бесплатно, исходящий трафик 0 $), gh-proxy.com, GitHub",
  ] : isEn ? [
    "RSY (Yandex) — main ad network for RU audience, payouts from 3000 RUB",
    "Google AdSense / AdMob — since Aug 2024 does not monetize Russia-based accounts; works only via a foreign account and foreign bank",
    "Adlook and external networks — alternative to RSY, payout threshold 1000 RUB",
    "Mirror partners: Cloudflare R2 (10 GB free, zero egress), gh-proxy.com, GitHub",
  ] : [
    "RSY（Yandex）— 俄区受众的主要广告网络，起付 3000 ₽",
    "Google AdSense / AdMob — 2024 年 8 月起不再支持俄罗斯账号变现，仅可通过海外账号与海外银行账户",
    "Adlook 等外部网络 — RSY 的替代方案，起付 1000 ₽",
    "镜像伙伴：Cloudflare R2（免费 10 GB、出站流量 0 美元）、gh-proxy.com、GitHub",
  ];

  const UL = {
    traffic: isRu ? "Трафик зеркала" : isEn ? "Mirror traffic" : "镜像流量",
    file: isRu ? "Макс. файл" : isEn ? "Max file" : "单文件上限",
    ads: isRu ? "Реклама" : isEn ? "Ads" : "广告",
    pack: isRu ? "Пакет (ZIP)" : isEn ? "Pack (ZIP)" : "打包 (ZIP)",
    speed: isRu ? "Скорость" : isEn ? "Speed" : "速度",
    par: isRu ? "Параллельно" : isEn ? "Parallel" : "并行",
    queue: isRu ? "Очередь/час" : isEn ? "Queue/hr" : "队列/时",
    prio: isRu ? "приоритетный канал" : isEn ? "priority channel" : "优先通道",
    unl: isRu ? "без лимита" : isEn ? "unlimited" : "无限制",
    noads: isRu ? "без рекламы" : isEn ? "no ads" : "无广告",
    up: isRu ? "до" : isEn ? "up to" : "最高",
  };
  const AD0 = isRu ? "15с/30с/1м" : isEn ? "15s/30s/1m" : "15秒/30秒/1分";
  const AD1 = isRu ? "только 15с" : isEn ? "15s only" : "仅15秒";
  const PL3 = isRu ? "до 3 плагинов" : isEn ? "up to 3 plugins" : "最多 3 个";
  const PL10 = isRu ? "до 10 плагинов" : isEn ? "up to 10 plugins" : "最多 10 个";
  const PL50 = isRu ? "до 50 плагинов" : isEn ? "up to 50 plugins" : "最多 50 个";

  const UPLAN = [
    { p: 0, n: isRu ? "Бесплатно" : isEn ? "Free" : "免费", rec: false, v: ["5 GB" + U, "100 MB", AD0, PL3, UL.up + " 10 MB/s", "1", "5"] },
    { p: 199, n: isRu ? "Стартер" : isEn ? "Starter" : "入门", rec: false, v: ["50 GB" + U, "500 MB", AD1, PL10, UL.up + " 25 MB/s", "3", "60"] },
    { p: 499, n: "Pro", rec: true, v: ["300 GB" + U, "2 GB", UL.noads, PL50, UL.prio, "5", "180"] },
    { p: 1990, n: "Max", rec: false, v: ["2 TB" + U, "10 GB", UL.noads, UL.unl, UL.prio, "10", "300"] },
  ];

  const DL = {
    pub: isRu ? "Публикация плагинов" : isEn ? "Publish plugins" : "发布插件",
    rev: isRu ? "Доля дохода с рекламы" : isEn ? "Ad revenue share" : "广告分成",
    banner: isRu ? "Баннер в каталоге" : isEn ? "Catalog banner" : "目录横幅",
    own: isRu ? "Реклама на его плагинах" : isEn ? "Ads on their plugins" : "其插件上的广告",
    analytics: isRu ? "Аналитика" : isEn ? "Analytics" : "分析",
    std: isRu ? "стандартная" : isEn ? "standard" : "标准",
    shorter: isRu ? "короче" : isEn ? "shorter" : "更短",
    base: isRu ? "базовая" : isEn ? "basic" : "基础",
    full: isRu ? "полная" : isEn ? "full" : "完整",
    fullApi: isRu ? "полная + API" : isEn ? "full + API" : "完整 + API",
    cat1: isRu ? "1 в своей категории" : isEn ? "1 in own category" : "1 个/所在类",
    cat3: isRu ? "3 в любой категории" : isEn ? "3 in any category" : "3 个/任意类",
  };
  const DPLAN = [
    { p: 0, n: isRu ? "Свободный" : isEn ? "Free" : "免费", rec: false, v: [UL.unl, "30%", "—", DL.std, DL.base] },
    { p: 490, n: isRu ? "Продвижение" : isEn ? "Promo" : "推广", rec: false, v: [UL.unl, "50%", DL.cat1, DL.shorter, DL.full] },
    { p: 1900, n: isRu ? "Партнёр" : isEn ? "Partner" : "伙伴", rec: true, v: [UL.unl, "70%", DL.cat3, UL.noads, DL.fullApi] },
  ];

  const fmt = (p) => p === 0 ? "0 ₽" : yearly ? Math.round(p * 12 * 0.8) + " ₽" + YU : p + " ₽" + U;
  const ULBL = [UL.traffic, UL.file, UL.ads, UL.pack, UL.speed, UL.par, UL.queue];
  const DLB = [DL.pub, DL.rev, DL.banner, DL.own, DL.analytics];

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...modalBox, maxWidth: 980 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{L.title}</div>
        <div style={{ color: "#8b949e", fontSize: 13, marginBottom: 12 }}>{L.sub}</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setYearly(false)} style={{ ...ghostBtn, background: yearly ? "#21262d" : "#2f81f7", color: yearly ? "#e6edf3" : "#fff" }}>{L.monthly}</button>
          <button onClick={() => setYearly(true)} style={{ ...ghostBtn, background: yearly ? "#2f81f7" : "#21262d", color: yearly ? "#fff" : "#e6edf3" }}>{L.yearly}</button>
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>{L.users}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
          {UPLAN.map((pl, i) => (
            <div key={i} style={{ flex: "1 1 190px", minWidth: 190, background: "#161b22", border: pl.rec ? "2px solid #2f81f7" : "1px solid #30363d", borderRadius: 12, padding: 16, position: "relative" }}>
              {pl.rec && <div style={{ position: "absolute", top: -10, left: 12, background: "#2f81f7", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 10 }}>{L.rec}</div>}
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{pl.n}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#3fb950", marginBottom: 10 }}>{fmt(pl.p)}</div>
              {ULBL.map((lb, j) => (
                <div key={j} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, color: "#c9d1d9", padding: "3px 0", borderBottom: "1px solid #21262d" }}>
                  <span style={{ color: "#8b949e" }}>{lb}</span>
                  <span style={{ textAlign: "right" }}>{pl.v[j]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ color: "#8b949e", fontSize: 11, margin: "4px 0 18px" }}>{L.note}</div>

        <div style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>{L.devs}</div>
        <div style={{ overflowX: "auto", marginBottom: 6 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, color: "#c9d1d9" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #30363d" }}></th>
                {DPLAN.map((pl, i) => (
                  <th key={i} style={{ padding: "6px 8px", borderBottom: "1px solid #30363d", color: pl.rec ? "#58a6ff" : "#e6edf3", whiteSpace: "nowrap" }}>{pl.n}{pl.rec ? " ⭐" : ""}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DLB.map((lb, j) => (
                <tr key={j}>
                  <td style={{ padding: "6px 8px", borderBottom: "1px solid #21262d", color: "#8b949e", whiteSpace: "nowrap" }}>{lb}</td>
                  {DPLAN.map((pl, i) => <td key={i} style={{ padding: "6px 8px", borderBottom: "1px solid #21262d", textAlign: "center" }}>{pl.v[j]}</td>)}
                </tr>
              ))}
              <tr>
                <td style={{ padding: "6px 8px", color: "#8b949e" }}>{L.price}</td>
                {DPLAN.map((pl, i) => <td key={i} style={{ padding: "6px 8px", textAlign: "center", color: "#3fb950", fontWeight: 700 }}>{fmt(pl.p)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, margin: "14px 0 6px" }}>{L.adsTitle}</div>
        {adsRows.map((r, i) => (
          <div key={i} style={{ color: "#c9d1d9", fontSize: 13, lineHeight: 1.5, padding: "4px 0" }}>· {r}</div>
        ))}

        <div style={{ color: "#3fb950", fontSize: 12, margin: "10px 0 4px" }}>{L.fair}</div>

        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button style={ghostBtn} onClick={onClose}>{TR.close[li]}</button>
        </div>
      </div>
    </div>
  );
}

const SHORTS = [
  { id: "ЗАМЕНИТЕ_ID_1", title: "Как установить плагин DSH за 30 секунд" },
  { id: "ЗАМЕНИТЕ_ID_2", title: "Плагин дня: обзор" },
  { id: "ЗАМЕНИТЕ_ID_3", title: "Топ-5 плагинов недели" },
];

function AdSlot({ li, th }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const o = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) setVis(true); }); }, { threshold: 0.25 });
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  const isShort = Math.random() < 0.35;
  if (!isShort) return (
    <div ref={ref} style={{ margin: "8px 0 16px", padding: 16, background: th.adBg, borderRadius: 8, textAlign: "center", color: th.dim, fontSize: 13, border: "1px solid " + th.border }}>
      📢 Реклама (РСЯ / AdMob) — 728×90
    </div>
  );
  const s = SHORTS[Math.floor(Math.random() * SHORTS.length)];
  return (
    <div ref={ref} style={{ margin: "8px 0 16px", background: th.adBg, borderRadius: 8, border: "1px solid " + th.border, overflow: "hidden" }}>
      <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}>
        {vis ? (
          <iframe src={"https://www.youtube-nocookie.com/embed/" + s.id} title={s.title} allow="encrypted-media; picture-in-picture" allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: th.dim, fontSize: 14 }}>▶️ {s.title}</div>
        )}
      </div>
      <div style={{ padding: "6px 12px", borderTop: "1px solid " + th.border, color: th.dim, fontSize: 12, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <span>🎬 PluginHub Shorts</span>
        <span>{li === 0 ? "иногда вместо рекламы — наш шортс" : li === 1 ? "sometimes instead of an ad" : "有时代替广告"}</span>
      </div>
    </div>
  );
}
function App() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState("dsh-plugin");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("stars");
  const [dark, setDark] = useState(true);
  const [li, setLi] = useState(0);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [adRepo, setAdRepo] = useState(null);
  const [infoRepo, setInfoRepo] = useState(null);
  const [trOpen, setTrOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("ph_user") || "null"); } catch (e) { return null; } });
  const [total, setTotal] = useState(0);
  const [pack, setPack] = useState([]);
  const [packOpen, setPackOpen] = useState(false);

  const t = (k) => TR[k][li];

  const th = dark ? {
    bg: "#0d1117", card: "#161b22", border: "#30363d", text: "#e6edf3",
    dim: "#8b949e", input: "#0d1117", accent: "#2f81f7", tagBg: "#1f6feb22",
    tag: "#58a6ff", adBg: "#21262d", footBg: "#010409",
  } : {
    bg: "#ffffff", card: "#f6f8fa", border: "#d0d7de", text: "#1f2328",
    dim: "#636c76", input: "#f6f8fa", accent: "#0969da", tagBg: "#0969da11",
    tag: "#0969da", adBg: "#f0f0f0", footBg: "#f6f8fa",
  };

  const fetchPlugins = useCallback(async (pg, append) => {
    setLoading(true); setErr(null);
    try {
      const c = CATS.find(x => x.id === cat);
      let sq = "topic:dsh-plugin";
      if (c && c.topic) sq += "+topic:" + c.topic;
      const qt = q.trim().toLowerCase();
      if (qt && qt !== "dsh-plugin") sq += "+" + qt;
      const sp = sort === "updated" ? "&sort=updated&order=desc" : sort === "name" ? "" : "&sort=stars&order=desc";
      const url = "https://api.github.com/search/repositories?q=" + encodeURIComponent(sq) + sp + "&per_page=30&page=" + pg;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.status);
      if (append) setPlugins(prev => [...prev, ...(data.items || [])]);
      else setPlugins(data.items || []);
      setTotal(data.total_count || 0);
      setMore(!!data.items && data.items.length === 30);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }, [q, cat, sort]);

  useEffect(() => { fetchPlugins(1, false); setPage(1); }, [fetchPlugins]);

  const activeCat = CATS.find(c => c.id === cat);
  const searchByTag = (tg) => { setCat("all"); setQ("topic:" + tg); setPage(1); };
  const togglePack = (p) => setPack(prev => prev.some(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]);

  const dl = { hour: 128, today: 2417, week: 13820, total: 1284000 };
  const dlLabel = li === 0
    ? { h: "за час", d: "сегодня", w: "за неделю", t: "всего", note: "(демо-счётчики, реальная статистика появится с бэкендом)" }
    : li === 1
    ? { h: "per hour", d: "today", w: "this week", t: "total", note: "(demo counters until backend is live)" }
    : { h: "每小时", d: "今日", w: "本周", t: "总计", note: "（接入后端前的演示计数）" };
  const platforms = li === 0 ? "Платформы: Windows · Linux · Android · iOS · Браузер"
    : li === 1 ? "Platforms: Windows · Linux · Android · iOS · Browser"
    : "平台：Windows · Linux · Android · iOS · 浏览器";
  const socialLabel = li === 0 ? "Соцсети и реклама:" : li === 1 ? "Social and ads:" : "社交与广告：";
  const availWord = li === 0 ? "доступно для скачивания" : li === 1 ? "available for download" : "可下载";
  const footerCols = [
    { title: t("aboutUs"), items: [t("aboutText")], text: true },
    { title: t("platform"), items: [
      t("allPlugins") + " — " + fmtNum(total),
      t("categories") + " — " + (CATS.length - 1) + (li === 0 ? " (7 тем + «Все»)" : ""),
      t("top"), t("fresh"),
      platforms,
    ]},
    { title: "📊 " + (li === 0 ? "Скачивания" : li === 1 ? "Downloads" : "下载统计"), items: [
      dlLabel.h + ": " + dl.hour,
      dlLabel.d + ": " + dl.today,
      dlLabel.w + ": " + dl.week,
      dlLabel.t + ": " + fmtNum(dl.total),
      dlLabel.note,
    ]},
    { title: t("forDevs"), items: [
      t("uploadPlugin") + " — " + fmtNum(total) + " " + availWord,
      t("docs"),
      "API:",
      "· GitHub Search API — " + (li === 0 ? "поиск плагинов" : li === 1 ? "plugin search" : "插件搜索"),
      "· GitHub Repos API — " + (li === 0 ? "детали, лицензии, размер" : li === 1 ? "details, licenses, size" : "详情、许可、大小"),
      "· MyMemory API — " + (li === 0 ? "переводчик текста" : li === 1 ? "text translator" : "文本翻译"),
      "· РСЯ API — " + (li === 0 ? "реклама (план)" : li === 1 ? "ads (planned)" : "广告（计划）"),
      "· VirusTotal API — " + (li === 0 ? "проверка файлов (план)" : li === 1 ? "file scan (planned)" : "文件扫描（计划）"),
    ]},
    { title: t("info"), items: [
      socialLabel,
      { i: "💬", n: "WhatsApp Business", u: "https://wa.me/79990000000" },
      { i: "✈️", n: "Telegram", u: "#" },
      { i: "🌐", n: "VK", u: "#" },
      { i: "▶️", n: "YouTube", u: "https://www.youtube.com/@viktorgamesandbusinessgore440" },
      t("terms"), t("privacy"), t("moderation"), t("contact"),
    ]},
  ];

  return (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "-apple-system, system-ui, sans-serif", transition: "background .3s" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: th.bg, borderBottom: "1px solid " + th.border, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 700, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 28 }}>🔌</span> PluginHub
        </div>
        <form onSubmit={e => { e.preventDefault(); fetchPlugins(1, false); setPage(1); }} style={{ flex: 1, minWidth: 180, display: "flex", gap: 8 }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("search")} style={{ flex: 1, ...inputStyle, background: th.input, border: "1px solid " + th.border }} />
          <button type="submit" style={primaryBtn}>{t("find")}</button>
        </form>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inputStyle, background: th.input, border: "1px solid " + th.border, cursor: "pointer" }}>
          <option value="stars">⭐</option>
          <option value="updated">🕒</option>
          <option value="name">A-Z</option>
        </select>
        <div style={{ display: "flex", gap: 2, border: "1px solid " + th.border, borderRadius: 6, overflow: "hidden" }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setLi(LANGS.indexOf(l))} style={{ padding: "8px 10px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: li === LANGS.indexOf(l) ? th.accent : "transparent", color: li === LANGS.indexOf(l) ? "#fff" : th.text }}>{l.label}</button>
          ))}
        </div>
        <button style={ghostBtn} onClick={() => setTrOpen(true)}>{t("translator")}</button>
        <button style={ghostBtn} onClick={() => setDark(!dark)}>{dark ? "☀️" : "🌙"}</button>
        <button style={ghostBtn} onClick={() => setPriceOpen(true)}>{["💰 Цены", "💰 Pricing", "💰 价格"][li]}</button>
        <button style={ghostBtn} onClick={() => { if (pack.length) setPackOpen(true); }} title={li === 0 ? "Пакетная загрузка" : li === 1 ? "Batch download" : "批量下载"}>
          📦 {li === 0 ? "Пакет" : li === 1 ? "Pack" : "打包"} ({pack.length})
        </button>
        {user ? (
          <button style={{ ...ghostBtn, borderColor: th.accent }} onClick={() => setProfOpen(true)} title={user.email}>
            👤 {user.email.split("@")[0]}
          </button>
        ) : (
          <button style={ghostBtn} onClick={() => setAuthOpen(true)}>{t("login")}</button>
        )}
      </header>

      <div style={{ display: "flex", gap: 6, padding: "12px 20px 4px", overflowX: "auto", flexWrap: "wrap" }}>
        {CATS.map(c => (
          <button key={c.id} title={c.desc[li]} onClick={() => setCat(c.id)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid " + (cat === c.id ? th.accent : th.border), background: cat === c.id ? th.accent : "transparent", color: cat === c.id ? "#fff" : th.dim, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap", transition: "all .2s" }}>
            {c.icon} {c.name[li]}
          </button>
        ))}
      </div>
      <div style={{ padding: "4px 20px 8px", color: th.dim, fontSize: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span>{activeCat ? activeCat.desc[li] : ""}</span>
        {q.startsWith("topic:") && (
          <button onClick={() => setQ("dsh-plugin")} title="Сбросить ветку"
            style={{ padding: "2px 10px", borderRadius: 12, border: "1px solid " + th.accent, background: th.tagBg, color: th.tag, fontSize: 12, cursor: "pointer" }}>
            🌿 {q} ✕
          </button>
        )}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
        <AdSlot li={li} th={th} />

        {loading && plugins.length === 0 && <div style={{ textAlign: "center", padding: 40, color: th.dim }}>{t("loading")}</div>}
        {err && <div style={{ textAlign: "center", padding: 40, color: "#f85149" }}>{t("error")}: {err}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {plugins.map(p => (
            <div key={p.id} style={{ background: th.card, border: "1px solid " + th.border, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10, transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = th.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <img src={p.owner?.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, border: "1px solid " + th.border }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a href={p.html_url} target="_blank" rel="noreferrer" style={{ color: th.text, textDecoration: "none", fontWeight: 600, fontSize: 15, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</a>
                  <div style={{ color: th.dim, fontSize: 12 }}>{t("by")} {p.owner?.login}</div>
                </div>
              </div>
              {p.description && <p style={{ color: th.dim, fontSize: 13, lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>}
              {p.topics && p.topics.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {p.topics.slice(0, 5).map(tg => (
                    <button key={tg} onClick={() => searchByTag(tg)} title={tg}
                      style={{ padding: "2px 10px", borderRadius: 12, background: th.tagBg, color: th.tag, fontSize: 11, border: "1px solid transparent", cursor: "pointer", transition: "all .15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = th.accent; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = th.tagBg; e.currentTarget.style.color = th.tag; }}>
                      #{tg}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: th.dim, marginTop: "auto", paddingTop: 8, borderTop: "1px solid " + th.border, flexWrap: "wrap" }}>
                <span>⭐ {fmtNum(p.stargazers_count)}</span>
                <span>🔀 {fmtNum(p.forks_count)}</span>
                {p.language && <span>📄 {p.language}</span>}
                <CardMeta repo={p} />
                <span style={{ marginLeft: "auto" }}>{t("updated")} {agoStr(p.updated_at, li)}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button title={li === 0 ? "В пакет" : li === 1 ? "Add to pack" : "加入打包"} onClick={() => togglePack(p)}
                  style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid " + (pack.some(x => x.id === p.id) ? th.accent : th.border), background: pack.some(x => x.id === p.id) ? th.accent : "transparent", color: pack.some(x => x.id === p.id) ? "#fff" : th.dim, cursor: "pointer", fontSize: 13 }}>
                  {pack.some(x => x.id === p.id) ? "✓ " + (li === 0 ? "в пакете" : li === 1 ? "in pack" : "已加入") : "＋ " + (li === 0 ? "в пакет" : li === 1 ? "to pack" : "打包")}
                </button>
                <button style={greenBtn} onClick={() => setAdRepo(p)}>{t("downloadAd")}</button>
                <button style={ghostBtn} onClick={() => setInfoRepo(p)}>{t("about")}</button>
              </div>
            </div>
          ))}
        </div>

        {loading && plugins.length > 0 && <div style={{ textAlign: "center", padding: 20, color: th.dim }}>{t("loading")}</div>}

        {more && !loading && (
          <div style={{ textAlign: "center", padding: 20 }}>
            <button style={primaryBtn} onClick={() => { const n = page + 1; fetchPlugins(n, true); setPage(n); }}>{t("loadMore")}</button>
          </div>
        )}

        {!loading && plugins.length === 0 && !err && <div style={{ textAlign: "center", padding: 40, color: th.dim }}>{t("none")}</div>}
      </div>

      <footer style={{ background: th.footBg, borderTop: "1px solid " + th.border, padding: "32px 20px 20px", marginTop: 20 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {footerCols.map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{col.title}</div>
              {col.text ? (
                <div style={{ color: th.dim, fontSize: 13, lineHeight: 1.6 }}>{col.items[0]}</div>
              ) : (
                col.items.map((it, j) =>
                  it && typeof it === "object" ? (
                    <a key={j} href={it.u} target="_blank" rel="noreferrer" style={{ display: "block", color: th.dim, fontSize: 13, textDecoration: "none", padding: "3px 0" }}
                      onMouseEnter={e => e.currentTarget.style.color = th.accent}
                      onMouseLeave={e => e.currentTarget.style.color = th.dim}>{it.i} {it.n}</a>
                  ) : (
                    <div key={j} style={{ color: th.dim, fontSize: 13, padding: "3px 0" }}>{it}</div>
                  )
                )
              )}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1200, margin: "24px auto 0", paddingTop: 16, borderTop: "1px solid " + th.border, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, color: th.dim, fontSize: 12 }}>
          <span>© 2026 PluginHub · {t("rights")}</span>
          <span>Данные: GitHub API · РСЯ / AdMob</span>
          <span>v0.6.3</span>
        </div>
      </footer>

      {adRepo && <AdModal repo={adRepo} li={li} onClose={() => setAdRepo(null)} />}
      {infoRepo && <InfoModal repo={infoRepo} li={li} onClose={() => setInfoRepo(null)} onTag={searchByTag} />}
      {trOpen && <TranslatorModal li={li} onClose={() => setTrOpen(false)} />}
      {packOpen && <PackModal items={pack} li={li} onClose={() => setPackOpen(false)} />}
      {priceOpen && <PricingPage li={li} onClose={() => setPriceOpen(false)} />}
      {authOpen && <AuthModal li={li} onClose={() => setAuthOpen(false)} onAuth={setUser} />}
      {profOpen && user && <ProfileModal user={user} li={li} onClose={() => setProfOpen(false)} onLogout={() => setUser(null)} onPricing={() => setPriceOpen(true)} />}
    </div>
  );
}

export default App;

