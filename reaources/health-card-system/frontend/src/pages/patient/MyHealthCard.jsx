import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import HealthCardVisual from "../../components/HealthCardVisual";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { patientApi } from "../../api/patientApi";
import { patientNavItems } from "./patientNav";
import { formatDateTime, formatDate } from "../../utils/format";
import { Droplet, AlertTriangle, HeartPulse, Phone, Download } from "lucide-react";

export default function MyHealthCard() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [revealSecretId, setRevealSecretId] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      patientApi.getMe(),
      patientApi.getMyPrescriptions(),
      patientApi.getMyLabReports(),
    ])
      .then(([profRes, prescRes, labRes]) => {
        setProfile(profRes.data);
        const prescEvents = prescRes.data.map(p => ({ ...p, eventType: 'PRESCRIPTION', sortDate: new Date(p.createdAt) }));
        const labEvents = labRes.data.map(l => ({ ...l, eventType: 'LAB_REPORT', sortDate: new Date(l.reportDate) }));
        setEvents([...prescEvents, ...labEvents].sort((a, b) => b.sortDate - a.sortDate));
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    // Temporarily reveal ID for the PDF if it isn't already
    const wasRevealed = revealSecretId;
    setRevealSecretId(true);
    setTimeout(() => {
      window.print();
      setRevealSecretId(wasRevealed);
    }, 100);
  };

  return (
    <DashboardLayout navItems={patientNavItems}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 no-print">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink mb-1">My Health Card</h1>
          <p className="text-sm text-ink/60">This is the credential doctors use to access your record.</p>
        </div>
        <Button onClick={handlePrint} className="bg-ink text-white hover:bg-ink/90 flex items-center gap-2">
          <Download size={16} /> Download PDF
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <div>
              <HealthCardVisual
                card={profile?.healthCard}
                patientName={profile?.fullName}
                revealSecretId={revealSecretId}
                onToggleReveal={() => setRevealSecretId((v) => !v)}
              />
              <Card className="mt-5 no-print">
                <h4 className="font-display text-sm font-semibold text-ink">Keep this safe</h4>
                <p className="mt-1.5 text-xs text-ink/60">
                  Your <strong>health card number</strong> is fine to show — it's printed on your card and embedded
                  in its QR code. Your <strong>health card ID</strong> is a secret, like a PIN. Only read it out to a
                  doctor in person when you want them to access your record. Anyone with both values can view your
                  medical history, so never share the ID over text, email, or social media.
                </p>
              </Card>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Card>
                <div className="flex items-center gap-2 text-ink/50">
                  <Droplet size={16} /> <span className="text-xs font-semibold uppercase tracking-wide">Blood group</span>
                </div>
                <p className="mt-2 font-display text-xl font-bold text-ink">{profile?.bloodGroup || "Not set"}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 text-ink/50">
                  <HeartPulse size={16} /> <span className="text-xs font-semibold uppercase tracking-wide">Date of birth</span>
                </div>
                <p className="mt-2 font-display text-xl font-bold text-ink">{formatDate(profile?.dateOfBirth)}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 text-ink/50">
                  <AlertTriangle size={16} /> <span className="text-xs font-semibold uppercase tracking-wide">Known allergies</span>
                </div>
                <p className="mt-2 text-sm text-ink">{profile?.knownAllergies || "None recorded"}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2 text-ink/50">
                  <Phone size={16} /> <span className="text-xs font-semibold uppercase tracking-wide">Emergency contact</span>
                </div>
                <p className="mt-2 text-sm text-ink">
                  {profile?.emergencyContactName || "Not set"}
                  {profile?.emergencyContactPhone ? ` · ${profile.emergencyContactPhone}` : ""}
                </p>
              </Card>
            </div>
          </div>

          {/* This section only appears when printing to PDF */}
          <div className="print-only mt-10">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Medical History</h2>
            {events.length === 0 ? (
              <p>No records found.</p>
            ) : (
              <div className="space-y-4">
                {events.map((evt, i) => (
                  <div key={i} className="border p-4 rounded-lg break-inside-avoid">
                    {evt.eventType === 'PRESCRIPTION' ? (
                      <>
                        <h3 className="font-bold">Prescription: {evt.diagnosis}</h3>
                        <p className="text-sm text-gray-600">Dr. {evt.doctorName} · {formatDateTime(evt.createdAt)}</p>
                        {evt.advice && <p className="text-sm mt-2 italic">"{evt.advice}"</p>}
                        {evt.items && evt.items.length > 0 && (
                          <ul className="mt-2 text-sm list-disc pl-5">
                            {evt.items.map((it, idx) => (
                              <li key={idx}>{it.medicineName} ({[it.dosage, it.frequency, it.duration].filter(Boolean).join(" · ")})</li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold">Lab Report: {evt.testName}</h3>
                        <p className="text-sm text-gray-600">Pathologist: {evt.pathologistName} · {formatDateTime(evt.reportDate)}</p>
                        {evt.prescriptionDiagnosis && <p className="text-sm mt-1 text-blue-600">Linked to: {evt.prescriptionDiagnosis}</p>}
                        <p className="mt-2 text-sm"><strong>Findings:</strong> {evt.findings}</p>
                        {evt.remarks && <p className="text-sm"><strong>Remarks:</strong> {evt.remarks}</p>}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
