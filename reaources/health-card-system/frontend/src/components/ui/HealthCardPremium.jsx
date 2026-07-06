import { useState } from "react";
import {
  ShieldCheck, QrCode, Heart, Phone, AlertTriangle, Download, Printer, Share2,
  Eye, EyeOff, Copy, CheckCheck,
} from "lucide-react";
import { useLang } from "../../context/LanguageContext";

function QRPlaceholder({ size = 80 }) {
  // Simple QR placeholder pattern
  return (
    <div style={{ width: size, height: size }} className="bg-white rounded-xl p-2 shadow-inner grid grid-cols-7 gap-px">
      {Array.from({ length: 49 }, (_, i) => (
        <div
          key={i}
          className={`rounded-sm ${
            [0,1,2,3,4,5,6,7,14,21,28,35,42,43,44,45,46,47,48,
             8,9,10,11,12,13,15,16,17,18,19,20,22,27,29,30,31,32,33,34,36,37,38,39,40,41].includes(i)
              ? "bg-ink"
              : "bg-white"
          }`}
        />
      ))}
    </div>
  );
}

export default function HealthCardPremium({ card, patientName, photo }) {
  const { t } = useLang();
  const [showId, setShowId] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const copyCardNumber = () => {
    navigator.clipboard.writeText(card?.cardNumber || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Health Card",
        text: `Health Card: ${card?.cardNumber}`,
        url: window.location.href,
      });
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`My Health Card Number: ${card?.cardNumber}\nName: ${patientName}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div>
      {/* Card with flip animation */}
      <div
        className="relative w-full cursor-pointer"
        style={{ perspective: "1000px", height: "220px" }}
        onClick={() => setFlipped((v) => !v)}
        title="Click to flip"
      >
        <div
          className="w-full h-full relative transition-all duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="health-card absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
                  🏥 {t("centralizedSystem")}
                </p>
                <div className="verified-seal">
                  <ShieldCheck size={10} />
                  {t("verified")}
                </div>
              </div>
              <QRPlaceholder size={56} />
            </div>

            {/* Patient name */}
            <div className="flex items-center gap-3">
              {photo ? (
                <img src={photo} alt={patientName} className="h-12 w-12 rounded-xl object-cover border-2 border-white/30" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center text-white font-bold font-display text-lg">
                  {(patientName || "P")[0]}
                </div>
              )}
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest">Patient</p>
                <p className="font-display font-bold text-white text-base leading-tight">{patientName}</p>
              </div>
            </div>

            {/* Card Number */}
            <div className="mt-4">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{t("healthCardNumber")}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="font-mono-card text-white font-semibold tracking-wider text-sm">
                  {card?.cardNumber || "HC-XXXX-XXXX-XXXX"}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); copyCardNumber(); }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Bottom tags */}
            <div className="mt-3 flex items-center gap-2">
              {card?.bloodGroup && (
                <span className="blood-group-badge text-xs">{card.bloodGroup}</span>
              )}
              <span className={`badge ${card?.status === "ACTIVE" ? "badge-vital" : "badge-mist"} bg-white/10 text-white/80`}>
                {card?.status || "ACTIVE"}
              </span>
            </div>

            {/* Flip hint */}
            <p className="absolute bottom-4 right-4 text-[9px] text-white/25">Tap to flip</p>
          </div>

          {/* Back - Emergency Info */}
          <div
            className="health-card absolute inset-0 bg-gradient-to-br from-ink-dark to-vital-700"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-3">⚠️ Emergency Information</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{t("bloodGroup")}</p>
                <p className="text-white font-bold mt-0.5">{card?.bloodGroup || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{t("healthCardId")}</p>
                <p className="font-mono-card text-white text-xs mt-0.5 tracking-wide">
                  {showId ? (card?.secretId || "••••••••") : "••••••••••••"}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{t("allergies")}</p>
              <p className="text-white text-xs mt-0.5 leading-relaxed">
                {card?.allergies?.length ? card.allergies.join(", ") : "None recorded"}
              </p>
            </div>

            <div className="mt-2">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{t("emergencyContact")}</p>
              <p className="text-white text-xs mt-0.5">
                {card?.emergencyContactName || "Not set"} {card?.emergencyContactPhone ? `· ${card.emergencyContactPhone}` : ""}
              </p>
            </div>

            <p className="absolute bottom-4 right-4 text-[9px] text-white/25">Tap to flip</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <button
          onClick={() => setShowId((v) => !v)}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--border-color)] hover:border-vital-500 hover:bg-vital-light/50 transition-all group"
        >
          {showId ? <EyeOff size={17} className="text-vital-500" /> : <Eye size={17} className="text-vital-500" />}
          <span className="text-[10px] text-[var(--text-secondary)] font-medium text-center">Card ID</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--border-color)] hover:border-vital-500 hover:bg-vital-light/50 transition-all"
        >
          <Printer size={17} className="text-vital-500" />
          <span className="text-[10px] text-[var(--text-secondary)] font-medium">{t("print")}</span>
        </button>

        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--border-color)] hover:border-green-500 hover:bg-green-50 transition-all"
        >
          <Share2 size={17} className="text-green-500" />
          <span className="text-[10px] text-[var(--text-secondary)] font-medium">WhatsApp</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--border-color)] hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <Download size={17} className="text-blue-500" />
          <span className="text-[10px] text-[var(--text-secondary)] font-medium">{t("share")}</span>
        </button>
      </div>

      {/* Health Card ID reveal */}
      {showId && (
        <div className="mt-3 rounded-xl border border-vital-500/30 bg-vital-light p-3 animate-fade-in">
          <p className="text-xs text-vital-dark font-medium mb-1">🔒 Your Secret Health Card ID (Keep private)</p>
          <p className="font-mono-card text-sm text-vital-dark font-bold tracking-widest">
            {card?.secretId || "Not available"}
          </p>
          <p className="text-[10px] text-vital-dark/60 mt-1">
            Only share this with your doctor in person during consultation.
          </p>
        </div>
      )}
    </div>
  );
}
