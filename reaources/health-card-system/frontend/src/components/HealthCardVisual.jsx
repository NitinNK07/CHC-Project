import { ShieldCheck, Activity } from "lucide-react";

/**
 * The signature visual of the whole product: a realistic ID-card treatment
 * for the patient's health card. The number is shown in full (it's the public
 * identifier); the secret health card ID is masked by default since it acts
 * like a PIN that unlocks medical records in a doctor's hands.
 */
export default function HealthCardVisual({ card, patientName, revealSecretId = false, onToggleReveal }) {
  if (!card) return null;

  const maskedId = card.healthCardId
    ? card.healthCardId.slice(0, 4) + "•".repeat(Math.max(card.healthCardId.length - 8, 4)) + card.healthCardId.slice(-4)
    : null;

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card-gradient p-6 text-white shadow-card">
      {/* decorative pulse line */}
      <svg className="absolute -right-6 -top-6 h-40 w-40 opacity-10" viewBox="0 0 100 100" fill="none">
        <path d="M0 50 H30 L40 20 L55 80 L65 50 H100" stroke="white" strokeWidth="3" fill="none" />
      </svg>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-white/60">Centralized Health Card</p>
          <p className="mt-1 font-display text-lg font-semibold">{patientName}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
          <ShieldCheck size={13} />
          {card.status}
        </div>
      </div>

      <div className="mt-7">
        <p className="text-[11px] uppercase tracking-widest text-white/50">Health Card Number</p>
        <p className="font-mono-card mt-1 text-xl tracking-wider">{card.healthCardNumber}</p>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-white/50">Health Card ID (secret)</p>
          <button
            onClick={onToggleReveal}
            className="font-mono-card mt-1 text-sm tracking-wide text-white/90 underline-offset-2 hover:underline"
            title="Click to reveal/hide"
          >
            {revealSecretId && card.healthCardId ? card.healthCardId : maskedId || "Hidden"}
          </button>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-white/50">
          <Activity size={13} />
          Expires {card.expiryDate}
        </div>
      </div>

      {card.qrCodeBase64 && (
        <img
          src={card.qrCodeBase64}
          alt="Health card QR"
          className="absolute bottom-4 right-4 h-16 w-16 rounded-lg bg-white p-1"
        />
      )}
    </div>
  );
}
