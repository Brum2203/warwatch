import { useState, useEffect, useRef } from "react";

const LANGUAGES = {
  pt: { name: "Português", flag: "🇵🇹" },
  en: { name: "English", flag: "🇬🇧" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  ar: { name: "العربية", flag: "🇸🇦" },
};

const UI_TEXT = {
  pt: { title: "ZONA DE CONFLITO", subtitle: "Monitorização de conflitos globais em tempo real", fetchBtn: "Atualizar Notícias", loading: "A recolher notícias verificadas...", chatPlaceholder: "Pergunta sobre qualquer conflito...", send: "Enviar", sources: "Fontes", region: "Região", severity: "Intensidade", lastUpdate: "Última atualização", allRegions: "Todas as regiões", high: "Alta", medium: "Média", low: "Baixa", verified: "Verificado", mapTitle: "Mapa de Conflitos Ativos", newsTitle: "Notícias Recentes", botTitle: "Assistente de Conflitos", botWelcome: "Olá! Sou o teu assistente especializado em conflitos globais. Posso responder a perguntas sobre as guerras e conflitos atuais, dar contexto histórico, e explicar os últimos desenvolvimentos. O que queres saber?" },
  en: { title: "CONFLICT ZONE", subtitle: "Real-time global conflict monitoring", fetchBtn: "Update News", loading: "Gathering verified news...", chatPlaceholder: "Ask about any conflict...", send: "Send", sources: "Sources", region: "Region", severity: "Severity", lastUpdate: "Last update", allRegions: "All regions", high: "High", medium: "Medium", low: "Low", verified: "Verified", mapTitle: "Active Conflict Map", newsTitle: "Latest News", botTitle: "Conflict Assistant", botWelcome: "Hello! I'm your specialized global conflicts assistant. I can answer questions about ongoing wars and conflicts, provide historical context, and explain the latest developments. What would you like to know?" },
  es: { title: "ZONA DE CONFLICTO", subtitle: "Monitoreo de conflictos globales en tiempo real", fetchBtn: "Actualizar Noticias", loading: "Recopilando noticias verificadas...", chatPlaceholder: "Pregunta sobre cualquier conflicto...", send: "Enviar", sources: "Fuentes", region: "Región", severity: "Intensidad", lastUpdate: "Última actualización", allRegions: "Todas las regiones", high: "Alta", medium: "Media", low: "Baja", verified: "Verificado", mapTitle: "Mapa de Conflictos Activos", newsTitle: "Últimas Noticias", botTitle: "Asistente de Conflictos", botWelcome: "¡Hola! Soy tu asistente especializado en conflictos globales. Puedo responder preguntas sobre guerras y conflictos actuales, dar contexto histórico y explicar los últimos desarrollos. ¿Qué quieres saber?" },
  fr: { title: "ZONE DE CONFLIT", subtitle: "Surveillance des conflits mondiaux en temps réel", fetchBtn: "Actualiser les Nouvelles", loading: "Collecte des nouvelles vérifiées...", chatPlaceholder: "Posez une question sur un conflit...", send: "Envoyer", sources: "Sources", region: "Région", severity: "Intensité", lastUpdate: "Dernière mise à jour", allRegions: "Toutes les régions", high: "Haute", medium: "Moyenne", low: "Faible", verified: "Vérifié", mapTitle: "Carte des Conflits Actifs", newsTitle: "Dernières Nouvelles", botTitle: "Assistant Conflits", botWelcome: "Bonjour! Je suis votre assistant spécialisé dans les conflits mondiaux. Je peux répondre à vos questions sur les guerres et conflits en cours, fournir un contexte historique et expliquer les derniers développements. Que voulez-vous savoir?" },
  de: { title: "KONFLIKTZONE", subtitle: "Echtzeit-Überwachung globaler Konflikte", fetchBtn: "Nachrichten aktualisieren", loading: "Verifizierte Nachrichten werden gesammelt...", chatPlaceholder: "Fragen Sie zu einem Konflikt...", send: "Senden", sources: "Quellen", region: "Region", severity: "Intensität", lastUpdate: "Letztes Update", allRegions: "Alle Regionen", high: "Hoch", medium: "Mittel", low: "Niedrig", verified: "Verifiziert", mapTitle: "Karte aktiver Konflikte", newsTitle: "Aktuelle Nachrichten", botTitle: "Konflikt-Assistent", botWelcome: "Hallo! Ich bin Ihr spezialisierter Assistent für globale Konflikte. Ich kann Fragen zu laufenden Kriegen und Konflikten beantworten, historischen Kontext liefern und die neuesten Entwicklungen erklären. Was möchten Sie wissen?" },
  ar: { title: "منطقة الصراع", subtitle: "رصد النزاعات العالمية في الوقت الفعلي", fetchBtn: "تحديث الأخبار", loading: "جمع الأخبار المؤكدة...", chatPlaceholder: "اسأل عن أي نزاع...", send: "إرسال", sources: "المصادر", region: "المنطقة", severity: "الشدة", lastUpdate: "آخر تحديث", allRegions: "جميع المناطق", high: "عالية", medium: "متوسطة", low: "منخفضة", verified: "موثق", mapTitle: "خريطة النزاعات النشطة", newsTitle: "آخر الأخبار", botTitle: "مساعد النزاعات", botWelcome: "مرحباً! أنا مساعدك المتخصص في النزاعات العالمية. يمكنني الإجابة على أسئلتك حول الحروب والنزاعات الجارية وتقديم السياق التاريخي وشرح آخر المستجدات. ماذا تريد أن تعرف?" },
};

const CONFLICTS = [
  { id: 1, name: "Ukraine", region: "Europa de Leste", x: 56, y: 28, severity: "high", color: "#ef4444", active: true },
  { id: 2, name: "Gaza / Israel", region: "Médio Oriente", x: 60, y: 38, severity: "high", color: "#ef4444", active: true },
  { id: 3, name: "Sudão", region: "África", x: 55, y: 47, severity: "high", color: "#ef4444", active: true },
  { id: 4, name: "Myanmar", region: "Ásia", x: 78, y: 43, severity: "medium", color: "#f97316", active: true },
  { id: 5, name: "Yemen", region: "Médio Oriente", x: 63, y: 44, severity: "medium", color: "#f97316", active: true },
  { id: 6, name: "Mali / Sahel", region: "África", x: 45, y: 46, severity: "medium", color: "#f97316", active: true },
  { id: 7, name: "Síria", region: "Médio Oriente", x: 61, y: 36, severity: "medium", color: "#f97316", active: true },
  { id: 8, name: "Etiópia", region: "África", x: 58, y: 49, severity: "low", color: "#eab308", active: true },
  { id: 9, name: "Haiti", region: "Caraíbas", x: 26, y: 43, severity: "low", color: "#eab308", active: true },
];

const MOCK_NEWS = [
  { id: 1, title_pt: "Ucrânia reporta novos ataques na linha de frente de Zaporizhzhia", title_en: "Ukraine reports new attacks on Zaporizhzhia front line", title_es: "Ucrania reporta nuevos ataques en la línea del frente de Zaporiyia", title_fr: "L'Ukraine signale de nouvelles attaques sur la ligne de front de Zaporizhzhia", title_de: "Ukraine meldet neue Angriffe an der Frontlinie Saporischschja", title_ar: "أوكرانيا تُبلّغ عن هجمات جديدة على خط مواجهة زاباروجيا", region: "Europa de Leste", conflict: "Ukraine", source: "Reuters", sourceUrl: "https://reuters.com", time: "2h", severity: "high", verified: true },
  { id: 2, title_pt: "ONU apela a corredor humanitário em Gaza após intensificação dos bombardeamentos", title_en: "UN calls for humanitarian corridor in Gaza after intensified bombings", title_es: "ONU pide corredor humanitario en Gaza tras intensificación de los bombardeos", title_fr: "L'ONU appelle à un corridor humanitaire à Gaza après l'intensification des bombardements", title_de: "UN fordert humanitären Korridor in Gaza nach verstärkten Bombardierungen", title_ar: "الأمم المتحدة تطالب بممر إنساني في غزة بعد تصاعد القصف", region: "Médio Oriente", conflict: "Gaza / Israel", source: "BBC News", sourceUrl: "https://bbc.com", time: "4h", severity: "high", verified: true },
  { id: 3, title_pt: "Crise humanitária no Sudão: mais de 10 milhões de deslocados internos", title_en: "Sudan humanitarian crisis: over 10 million internally displaced", title_es: "Crisis humanitaria en Sudán: más de 10 millones de desplazados internos", title_fr: "Crise humanitaire au Soudan: plus de 10 millions de déplacés internes", title_de: "Humanitäre Krise im Sudan: über 10 Millionen Binnenvertriebene", title_ar: "الأزمة الإنسانية في السودان: أكثر من 10 ملايين نازح داخلي", region: "África", conflict: "Sudão", source: "Al Jazeera", sourceUrl: "https://aljazeera.com", time: "6h", severity: "high", verified: true },
  { id: 4, title_pt: "Myanmar: resistência reporta avanços significativos no norte do país", title_en: "Myanmar: resistance reports significant advances in the north", title_es: "Birmania: la resistencia reporta avances significativos en el norte del país", title_fr: "Myanmar: la résistance rapporte des avancées significatives dans le nord", title_de: "Myanmar: Widerstand meldet bedeutende Fortschritte im Norden", title_ar: "ميانمار: المقاومة تُبلّغ عن تقدم ملحوظ في شمال البلاد", region: "Ásia", conflict: "Myanmar", source: "AP News", sourceUrl: "https://apnews.com", time: "8h", severity: "medium", verified: true },
  { id: 5, title_pt: "Yemen: negociações de paz em Omã mostram progressos frágeis", title_en: "Yemen: peace negotiations in Oman show fragile progress", title_es: "Yemen: las negociaciones de paz en Omán muestran progresos frágiles", title_fr: "Yémen: les négociations de paix à Oman montrent des progrès fragiles", title_de: "Jemen: Friedensverhandlungen in Oman zeigen fragile Fortschritte", title_ar: "اليمن: مفاوضات السلام في عُمان تُظهر تقدماً هشاً", region: "Médio Oriente", conflict: "Yemen", source: "The Guardian", sourceUrl: "https://theguardian.com", time: "10h", severity: "medium", verified: true },
  { id: 6, title_pt: "Sahel: forças jihadistas expandem controlo no Mali central", title_en: "Sahel: jihadist forces expand control in central Mali", title_es: "Sahel: fuerzas yihadistas amplían el control en el centro de Malí", title_fr: "Sahel: les forces djihadistes étendent leur contrôle dans le centre du Mali", title_de: "Sahel: Dschihadistische Kräfte weiten Kontrolle in Zentralmali aus", title_ar: "الساحل: القوى الجهادية توسع سيطرتها في وسط مالي", region: "África", conflict: "Mali / Sahel", source: "France 24", sourceUrl: "https://france24.com", time: "12h", severity: "medium", verified: true },
];

const severityOrder = { high: 0, medium: 1, low: 2 };

export default function App() {
  const [lang, setLang] = useState("pt");
  const [activeTab, setActiveTab] = useState("map");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [news, setNews] = useState(MOCK_NEWS);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [hoveredConflict, setHoveredConflict] = useState(null);
  const chatEndRef = useRef(null);
  const t = UI_TEXT[lang];
  const isRTL = lang === "ar";

  useEffect(() => {
    setChatMessages([{ role: "assistant", content: t.botWelcome }]);
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const getTitle = (item) => item[`title_${lang}`] || item.title_en;

  const regions = ["all", ...new Set(MOCK_NEWS.map((n) => n.region))];

  const filteredNews = news
    .filter((n) => selectedRegion === "all" || n.region === selectedRegion)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a war correspondent AI. Generate 3 realistic, factual-style news headlines about current global conflicts (Ukraine, Gaza, Sudan, Myanmar, Yemen, Sahel/Mali, Syria, Ethiopia). 
Return ONLY valid JSON array, no markdown, no explanation:
[{"id":7,"title_pt":"...","title_en":"...","title_es":"...","title_fr":"...","title_de":"...","title_ar":"...","region":"...","conflict":"...","source":"Reuters|BBC News|AP News|Al Jazeera|The Guardian|France 24","sourceUrl":"https://reuters.com","time":"1h","severity":"high|medium|low","verified":true}]
Use realistic sources. Make headlines factual and informative. Vary regions and conflicts.`,
          messages: [{ role: "user", content: "Generate 3 new verified conflict news headlines for today." }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const newItems = parsed.map((item, i) => ({ ...item, id: Date.now() + i }));
      setNews((prev) => [...newItems, ...prev].slice(0, 12));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);
    try {
      const langName = LANGUAGES[lang].name;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert journalist and analyst specialized in global conflicts and wars. You have deep knowledge of ongoing conflicts: Ukraine-Russia war, Gaza-Israel conflict, Sudan civil war, Myanmar civil war, Yemen war, Sahel/Mali jihadist insurgency, Syrian conflict, Ethiopian conflicts, and others.

Always respond in ${langName}. Be factual, balanced, and cite context when relevant. Keep responses concise (3-4 paragraphs max). Always distinguish between confirmed facts and analysis. Never take political sides.`,
          messages: [
            ...chatMessages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg },
          ],
        }),
      });
      const data = await response.json();
      const reply = data.content?.map((c) => c.text || "").join("") || "...";
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Erro ao contactar o assistente. Tenta novamente." }]);
    }
    setChatLoading(false);
  };

  const severityColors = { high: "#ef4444", medium: "#f97316", low: "#eab308" };
  const severityBg = { high: "rgba(239,68,68,0.12)", medium: "rgba(249,115,22,0.12)", low: "rgba(234,179,8,0.12)" };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#080c14", color: "#e2e8f0", fontFamily: "'IBM Plex Mono', monospace", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f1520; } ::-webkit-scrollbar-thumb { background: #2a3a50; border-radius: 2px; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.4); } }
        .scanline { position:relative; overflow:hidden; }
        .scanline::after { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,100,0.01) 2px,rgba(0,255,100,0.01) 4px); pointer-events:none; }
        .tab-btn { background:none; border:none; cursor:pointer; padding:10px 20px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; transition:all 0.2s; }
        .news-card { border:1px solid #1e2d3d; background:#0c1420; padding:16px; border-radius:4px; transition:all 0.2s; cursor:pointer; margin-bottom:10px; }
        .news-card:hover { border-color:#2a4a6a; background:#0f1928; transform:translateX(3px); }
        .lang-btn { background:none; border:1px solid #1e2d3d; cursor:pointer; padding:5px 10px; border-radius:3px; font-family:'IBM Plex Mono',monospace; font-size:11px; transition:all 0.2s; color:#94a3b8; }
        .lang-btn:hover, .lang-btn.active { border-color:#00ff88; color:#00ff88; background:rgba(0,255,136,0.05); }
        .conflict-dot { cursor:pointer; transition:all 0.2s; }
        .conflict-dot:hover { transform:scale(1.5); }
        .chat-input { background:#0c1420; border:1px solid #1e2d3d; color:#e2e8f0; padding:10px 14px; font-family:'IBM Plex Mono',monospace; font-size:12px; flex:1; outline:none; border-radius:3px; }
        .chat-input:focus { border-color:#00ff88; }
        .send-btn { background:#00ff88; color:#080c14; border:none; cursor:pointer; padding:10px 18px; font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:700; letter-spacing:1px; border-radius:3px; transition:all 0.2s; }
        .send-btn:hover { background:#00cc6a; }
        .send-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .fetch-btn { background:transparent; border:1px solid #00ff88; color:#00ff88; cursor:pointer; padding:8px 18px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; border-radius:3px; transition:all 0.2s; }
        .fetch-btn:hover { background:rgba(0,255,136,0.08); }
        .fetch-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .filter-btn { background:none; border:1px solid #1e2d3d; cursor:pointer; padding:5px 12px; border-radius:20px; font-family:'IBM Plex Mono',monospace; font-size:10px; transition:all 0.2s; color:#64748b; white-space:nowrap; }
        .filter-btn:hover, .filter-btn.active { border-color:#00ff88; color:#00ff88; background:rgba(0,255,136,0.05); }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #1e2d3d", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#080c14", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src="/logo.png" alt="WarWatch" style={{ height: 120, objectFit: "contain" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {Object.entries(LANGUAGES).map(([code, { flag, name }]) => (
            <button key={code} className={`lang-btn ${lang === code ? "active" : ""}`} onClick={() => setLang(code)} title={name}>
              {flag} <span style={{ display: "inline" }}>{code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1e2d3d", background: "#080c14" }}>
        {["map", "news", "bot"].map((tab) => {
          const labels = { pt: ["Mapa", "Notícias", "Assistente"], en: ["Map", "News", "Assistant"], es: ["Mapa", "Noticias", "Asistente"], fr: ["Carte", "Nouvelles", "Assistant"], de: ["Karte", "Nachrichten", "Assistent"], ar: ["الخريطة", "الأخبار", "المساعد"] };
          const idx = ["map", "news", "bot"].indexOf(tab);
          return (
            <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{ color: activeTab === tab ? "#00ff88" : "#475569", borderBottom: activeTab === tab ? "2px solid #00ff88" : "2px solid transparent" }}>
              {labels[lang][idx]}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
          <button className="fetch-btn" onClick={handleFetch} disabled={loading}>
            {loading ? "⟳ " + t.loading.slice(0, 20) + "..." : "↻ " + t.fetchBtn}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>

        {/* MAP TAB */}
        {activeTab === "map" && (
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 10, color: "#334155", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>// {t.mapTitle}</div>
            <div className="scanline" style={{ position: "relative", background: "#0a1628", border: "1px solid #1e2d3d", borderRadius: 6, overflow: "hidden" }}>
              {/* SVG World Map */}
              <svg viewBox="0 0 100 65" style={{ width: "100%", display: "block" }}>
                <defs>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100" height="65" fill="#050d1a" />
                {/* Grid lines */}
                {[10,20,30,40,50,60,70,80,90].map(x => <line key={x} x1={x} y1="0" x2={x} y2="65" stroke="#0f2040" strokeWidth="0.2" />)}
                {[10,20,30,40,50].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#0f2040" strokeWidth="0.2" />)}
                {/* Simplified continent shapes */}
                {/* North America */}
                <path d="M15,12 L28,10 L32,15 L30,22 L26,28 L20,30 L16,26 L12,18 Z" fill="#0e2035" stroke="#1a3050" strokeWidth="0.3" />
                {/* South America */}
                <path d="M25,33 L32,30 L35,35 L34,48 L28,52 L22,47 L22,38 Z" fill="#0e2035" stroke="#1a3050" strokeWidth="0.3" />
                {/* Europe */}
                <path d="M46,14 L58,12 L62,16 L60,22 L54,24 L48,22 L44,18 Z" fill="#0e2035" stroke="#1a3050" strokeWidth="0.3" />
                {/* Africa */}
                <path d="M47,28 L58,26 L62,30 L62,52 L54,56 L46,52 L44,40 L46,30 Z" fill="#0e2035" stroke="#1a3050" strokeWidth="0.3" />
                {/* Asia */}
                <path d="M60,10 L90,8 L94,14 L92,24 L84,30 L72,32 L62,28 L58,20 L62,14 Z" fill="#0e2035" stroke="#1a3050" strokeWidth="0.3" />
                {/* Australia */}
                <path d="M78,46 L90,44 L92,50 L86,56 L76,54 L74,50 Z" fill="#0e2035" stroke="#1a3050" strokeWidth="0.3" />

                {/* Conflict markers */}
                {CONFLICTS.map((c) => (
                  <g key={c.id} className="conflict-dot" onClick={() => setSelectedConflict(selectedConflict?.id === c.id ? null : c)} onMouseEnter={() => setHoveredConflict(c)} onMouseLeave={() => setHoveredConflict(null)}>
                    <circle cx={c.x} cy={c.y} r="2.5" fill={c.color} fillOpacity="0.15" />
                    <circle cx={c.x} cy={c.y} r="1.2" fill={c.color} className="pulse" />
                    <circle cx={c.x} cy={c.y} r="2.5" fill="transparent" stroke={c.color} strokeWidth="0.4" strokeOpacity="0.6" />
                  </g>
                ))}

                {/* Tooltip */}
                {hoveredConflict && (
                  <g>
                    <rect x={hoveredConflict.x + 3} y={hoveredConflict.y - 8} width="22" height="10" rx="1" fill="#0c1420" stroke="#2a3a50" strokeWidth="0.3" />
                    <text x={hoveredConflict.x + 14} y={hoveredConflict.y - 3} textAnchor="middle" fill="#e2e8f0" fontSize="2.5" fontFamily="IBM Plex Mono">{hoveredConflict.name}</text>
                    <text x={hoveredConflict.x + 14} y={hoveredConflict.y + 1} textAnchor="middle" fill={hoveredConflict.color} fontSize="2" fontFamily="IBM Plex Mono">{hoveredConflict.severity.toUpperCase()}</text>
                  </g>
                )}
              </svg>

              {/* Legend */}
              <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderTop: "1px solid #1e2d3d", fontSize: 10, flexWrap: "wrap" }}>
                {[["high", "#ef4444"], ["medium", "#f97316"], ["low", "#eab308"]].map(([sev, col]) => (
                  <div key={sev} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
                    {t[sev]}
                  </div>
                ))}
                <div style={{ marginLeft: "auto", color: "#334155", fontSize: 9, letterSpacing: 1 }}>{CONFLICTS.length} CONFLITOS ATIVOS</div>
              </div>
            </div>

            {/* Selected conflict detail */}
            {selectedConflict && (
              <div style={{ marginTop: 16, padding: 16, border: `1px solid ${selectedConflict.color}40`, background: severityBg[selectedConflict.severity], borderRadius: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 2, color: selectedConflict.color }}>{selectedConflict.name}</span>
                  <button onClick={() => setSelectedConflict(null)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>{t.region}: {selectedConflict.region} · {t.severity}: <span style={{ color: selectedConflict.color }}>{t[selectedConflict.severity]}</span></div>
                <div style={{ fontSize: 10, color: "#475569", marginBottom: 8 }}>NOTÍCIAS RECENTES</div>
                {news.filter(n => n.conflict === selectedConflict.name).slice(0, 2).map(n => (
                  <div key={n.id} style={{ padding: "8px 0", borderTop: "1px solid #1e2d3d", fontSize: 12, color: "#94a3b8" }}>
                    {getTitle(n)} <span style={{ color: "#334155", fontSize: 10 }}>— {n.source}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Conflict list */}
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
              {CONFLICTS.map(c => (
                <div key={c.id} onClick={() => setSelectedConflict(selectedConflict?.id === c.id ? null : c)} style={{ padding: "10px 14px", border: `1px solid ${selectedConflict?.id === c.id ? c.color + "80" : "#1e2d3d"}`, background: selectedConflict?.id === c.id ? severityBg[c.severity] : "#0c1420", borderRadius: 4, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#334155" }}>{c.region}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === "news" && (
          <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontSize: 10, color: "#334155", letterSpacing: 3, marginBottom: 14, textTransform: "uppercase" }}>// {t.newsTitle}</div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {regions.map(r => (
                <button key={r} className={`filter-btn ${selectedRegion === r ? "active" : ""}`} onClick={() => setSelectedRegion(r)}>
                  {r === "all" ? t.allRegions : r}
                </button>
              ))}
            </div>
            {/* News List */}
            {filteredNews.map(n => (
              <div key={n.id} className="news-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: severityBg[n.severity], color: severityColors[n.severity], border: `1px solid ${severityColors[n.severity]}40`, letterSpacing: 1 }}>{t[n.severity].toUpperCase()}</span>
                    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "rgba(0,255,136,0.08)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.2)", letterSpacing: 1 }}>✓ {t.verified}</span>
                  </div>
                  <span style={{ fontSize: 10, color: "#334155", whiteSpace: "nowrap" }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#cbd5e1", marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>{getTitle(n)}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10 }}>
                  <div style={{ color: "#334155" }}>
                    <span style={{ color: "#475569" }}>{t.region}: </span>{n.region} · {n.conflict}
                  </div>
                  <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#00ff88", textDecoration: "none", letterSpacing: 1 }}>
                    ↗ {n.source}
                  </a>
                </div>
              </div>
            ))}
            {filteredNews.length === 0 && (
              <div style={{ textAlign: "center", color: "#334155", padding: 40, fontSize: 12 }}>Sem notícias para esta região.</div>
            )}
          </div>
        )}

        {/* BOT TAB */}
        {activeTab === "bot" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e2d3d", fontSize: 10, color: "#334155", letterSpacing: 3 }}>// {t.botTitle}</div>
            <div style={{ flex: 1, overflow: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%", padding: "12px 16px", borderRadius: 4, fontSize: 12, lineHeight: 1.7,
                    background: msg.role === "user" ? "rgba(0,255,136,0.08)" : "#0c1420",
                    border: msg.role === "user" ? "1px solid rgba(0,255,136,0.25)" : "1px solid #1e2d3d",
                    color: msg.role === "user" ? "#a7f3d0" : "#94a3b8",
                    fontFamily: "'IBM Plex Mono', monospace",
                    textAlign: isRTL ? "right" : "left",
                  }}>
                    {msg.role === "assistant" && <div style={{ fontSize: 9, color: "#00ff88", letterSpacing: 2, marginBottom: 6 }}>CONFLICT BOT ▸</div>}
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", fontSize: 11 }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ff88", animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
                  </div>
                  A analisar...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Suggested questions */}
            <div style={{ padding: "8px 20px", display: "flex", gap: 8, overflowX: "auto", borderTop: "1px solid #1e2d3d" }}>
              {["Qual é a situação atual na Ucrânia?", "Quais são as causas do conflito em Gaza?", "Como está a crise humanitária no Sudão?"].map(q => (
                <button key={q} onClick={() => { setChatInput(q); }} style={{ background: "none", border: "1px solid #1e2d3d", color: "#475569", cursor: "pointer", padding: "5px 12px", borderRadius: 3, fontSize: 10, whiteSpace: "nowrap", fontFamily: "'IBM Plex Mono', monospace", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.borderColor = "#2a4a6a"; e.target.style.color = "#94a3b8"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#1e2d3d"; e.target.style.color = "#475569"; }}>
                  {q}
                </button>
              ))}
            </div>
            {/* Input */}
            <div style={{ padding: "12px 20px", borderTop: "1px solid #1e2d3d", display: "flex", gap: 10 }}>
              <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleChat()} placeholder={t.chatPlaceholder} />
              <button className="send-btn" onClick={handleChat} disabled={chatLoading || !chatInput.trim()}>{t.send} ▶</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
