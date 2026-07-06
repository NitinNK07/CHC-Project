import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, Minimize2 } from "lucide-react";
import { useLang } from "../../context/LanguageContext";

const SYMPTOMS_DB = {
  fever: { diseases: ["Flu", "COVID-19", "Malaria", "Typhoid"], risk: "medium" },
  cough: { diseases: ["Common Cold", "Bronchitis", "COVID-19", "Asthma"], risk: "low" },
  "chest pain": { diseases: ["Heart Disease", "Angina", "GERD", "Costochondritis"], risk: "high" },
  headache: { diseases: ["Migraine", "Tension Headache", "Hypertension", "Sinusitis"], risk: "low" },
  fatigue: { diseases: ["Anemia", "Hypothyroidism", "Depression", "Diabetes"], risk: "low" },
  "shortness of breath": { diseases: ["Asthma", "COPD", "Heart Failure", "Anemia"], risk: "high" },
  "stomach pain": { diseases: ["Gastritis", "Appendicitis", "IBS", "Ulcer"], risk: "medium" },
  "back pain": { diseases: ["Muscle Strain", "Herniated Disc", "Kidney Stone", "Sciatica"], risk: "low" },
  "sore throat": { diseases: ["Pharyngitis", "Tonsillitis", "Strep Throat", "COVID-19"], risk: "low" },
  "joint pain": { diseases: ["Arthritis", "Gout", "Lupus", "Osteoporosis"], risk: "medium" },
  "skin rash": { diseases: ["Allergy", "Eczema", "Psoriasis", "Chickenpox"], risk: "low" },
  dizziness: { diseases: ["Vertigo", "Anemia", "Hypertension", "Inner Ear Disorder"], risk: "medium" },
  vomiting: { diseases: ["Food Poisoning", "Gastroenteritis", "Migraine", "Appendicitis"], risk: "medium" },
  diarrhea: { diseases: ["Gastroenteritis", "IBS", "Food Poisoning", "Cholera"], risk: "medium" },
};

const BOT_RESPONSES = {
  greeting: ["Hello! I'm HealthBot, your AI health assistant. 👋", "Hi there! I can help with symptom checking, health information, and guiding you to the right care.", "Please note: I'm here for guidance only — always consult a qualified doctor for medical advice."],
  help: "I can help you with:\n• **Symptom analysis** — describe your symptoms\n• **Health information** — ask about conditions\n• **Appointment guidance** — when to see a doctor\n• **Medicine reminders** — setting health alerts",
  appointment: "To book an appointment, go to **Find Doctor** in your dashboard and select a verified doctor. Would you like me to help you navigate there?",
  emergency: "⚠️ **This sounds serious!** Please call emergency services (112) immediately or go to the nearest emergency room. Don't delay!",
  thanks: "You're welcome! Take care of your health. 💚 Remember to book regular checkups!",
  default: "I can help you understand your symptoms better. Could you describe what you're experiencing in more detail?",
};

function analyzeSymptoms(message) {
  const lower = message.toLowerCase();
  const matched = [];

  for (const [symptom, data] of Object.entries(SYMPTOMS_DB)) {
    if (lower.includes(symptom)) {
      matched.push({ symptom, ...data });
    }
  }

  if (matched.length === 0) return null;

  const highRisk = matched.some((m) => m.risk === "high");
  const medRisk = matched.some((m) => m.risk === "medium");
  const risk = highRisk ? "high" : medRisk ? "medium" : "low";

  const diseases = [...new Set(matched.flatMap((m) => m.diseases))].slice(0, 4);

  return { symptoms: matched.map((m) => m.symptom), diseases, risk };
}

function generateBotReply(message) {
  const lower = message.toLowerCase();

  if (lower.match(/\b(hi|hello|hey|namaste|namaskar)\b/)) {
    return BOT_RESPONSES.greeting[Math.floor(Math.random() * BOT_RESPONSES.greeting.length)];
  }
  if (lower.match(/\b(help|what can you do|options)\b/)) return BOT_RESPONSES.help;
  if (lower.match(/\b(appointment|book|doctor|schedule)\b/)) return BOT_RESPONSES.appointment;
  if (lower.match(/\b(emergency|urgent|serious|911|112|ambulance)\b/)) return BOT_RESPONSES.emergency;
  if (lower.match(/\b(thank|thanks|thank you|shukriya|dhanyavad)\b/)) return BOT_RESPONSES.thanks;

  const analysis = analyzeSymptoms(message);
  if (analysis) return { type: "analysis", ...analysis };

  return BOT_RESPONSES.default;
}

const RiskBadge = ({ risk }) => {
  const config = {
    low: { label: "Low Risk", class: "risk-low" },
    medium: { label: "Medium Risk", class: "risk-medium" },
    high: { label: "High Risk 🚨", class: "risk-high" },
  };
  const c = config[risk] || config.low;
  return <span className={`badge rounded-lg px-2 py-1 font-semibold ${c.class}`}>{c.label}</span>;
};

export default function AIChat() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: t("aiGreeting"), id: 0 },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = generateBotReply(input);
      setMessages((prev) => [...prev, { from: "bot", text: reply, id: Date.now() + 1 }]);
      setTyping(false);
    }, 800 + Math.random() * 500);
  };

  const renderMessage = (msg) => {
    if (typeof msg.text === "string") {
      return <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />;
    }

    // Analysis result
    const a = msg.text;
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold">Symptom Analysis 🔬</p>
        <div className="flex flex-wrap gap-1">
          {a.symptoms.map((s) => <span key={s} className="badge badge-vital capitalize">{s}</span>)}
        </div>
        <RiskBadge risk={a.risk} />
        {a.risk === "high" && (
          <p className="text-xs text-coral font-semibold">⚠️ Please seek medical attention immediately!</p>
        )}
        <div>
          <p className="text-xs text-[var(--text-secondary)] mb-1">Possible conditions:</p>
          <div className="flex flex-wrap gap-1">
            {a.diseases.map((d) => <span key={d} className="badge badge-mist">{d}</span>)}
          </div>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">{t("aiDisclaimer")}</p>
      </div>
    );
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className={`fixed bottom-20 right-4 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden border border-[var(--border-color)] flex flex-col transition-all duration-300 ${minimized ? "h-14" : "h-[450px]"}`}
          style={{ background: "var(--card-bg)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-vital-500 to-vital-600 flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{t("aiAssistant")}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                <p className="text-[10px] text-white/70">Online</p>
              </div>
            </div>
            <button onClick={() => setMinimized((v) => !v)} className="text-white/70 hover:text-white p-1">
              <Minimize2 size={14} />
            </button>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1">
              <X size={16} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} gap-2`}>
                    {msg.from === "bot" && (
                      <div className="h-7 w-7 rounded-full bg-vital-light flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles size={13} className="text-vital-500" />
                      </div>
                    )}
                    <div className={msg.from === "user" ? "ai-chat-bubble-user" : "ai-chat-bubble-ai"}>
                      {renderMessage(msg)}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2 items-center">
                    <div className="h-7 w-7 rounded-full bg-vital-light flex items-center justify-center">
                      <Sparkles size={13} className="text-vital-500" />
                    </div>
                    <div className="ai-chat-bubble-ai flex gap-1 items-center">
                      <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={t("typeMessage")}
                    className="input-base flex-1 text-sm py-2"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="btn-primary px-3 py-2 rounded-xl disabled:opacity-40"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => { setOpen((v) => !v); setMinimized(false); }}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-vital-500 to-vital-600 text-white shadow-glow flex items-center justify-center z-50 transition-all hover:scale-110 hover:shadow-lg"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
