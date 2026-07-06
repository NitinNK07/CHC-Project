import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { patientApi } from "../../api/patientApi";
import { patientNavItems } from "./patientNav";
import { formatDateTime } from "../../utils/format";
import { FileText, FlaskConical, History, Download } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function PatientTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      patientApi.getMyPrescriptions(),
      patientApi.getMyLabReports(),
    ])
      .then(([prescriptions, labReports]) => {
        const prescEvents = prescriptions.data.map(p => ({
          ...p,
          eventType: 'PRESCRIPTION',
          sortDate: new Date(p.createdAt)
        }));
        const labEvents = labReports.data.map(l => ({
          ...l,
          eventType: 'LAB_REPORT',
          sortDate: new Date(l.reportDate)
        }));
        
        const merged = [...prescEvents, ...labEvents].sort((a, b) => b.sortDate - a.sortDate);
        setEvents(merged);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={patientNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Medical History</h1>
      <p className="mb-6 text-sm text-ink/60">A chronological timeline of your prescriptions and lab reports.</p>

      {loading ? (
        <Loader />
      ) : events.length === 0 ? (
        <EmptyState icon={History} title="No medical history yet" subtitle="Your history will appear here over time." />
      ) : (
        <div className="relative border-l-2 border-mist-light ml-4 pl-6 space-y-8 py-4">
          {events.map((evt, idx) => (
            <div key={`${evt.eventType}-${evt.id}`} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[35px] top-4 h-4 w-4 rounded-full border-4 border-white bg-vital shadow-sm" />
              
              {evt.eventType === 'PRESCRIPTION' ? (
                <Card className="border-l-4 border-l-gold">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-gold" />
                    <span className="text-xs font-bold uppercase tracking-wide text-mist">Prescription</span>
                  </div>
                  <p className="font-display font-semibold text-ink">{evt.diagnosis}</p>
                  <p className="text-xs text-mist">Dr. {evt.doctorName} · {formatDateTime(evt.createdAt)}</p>
                  
                  {evt.advice && <p className="mt-2 text-sm text-ink/70 italic">"{evt.advice}"</p>}
                  
                  {evt.items && evt.items.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {evt.items.map((it, i) => (
                        <div key={i} className="rounded-lg bg-mist-light/50 px-2.5 py-1.5 text-xs">
                          <strong className="text-ink">{it.medicineName}</strong>
                          <span className="text-mist ml-1">
                            {[it.dosage, it.frequency, it.duration].filter(Boolean).join(" · ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ) : (
                <Card className="border-l-4 border-l-coral">
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical size={16} className="text-coral" />
                    <span className="text-xs font-bold uppercase tracking-wide text-mist">Lab Report</span>
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold text-ink">{evt.testName}</p>
                      <p className="text-xs text-mist">{evt.pathologistName} · {formatDateTime(evt.reportDate)}</p>
                      {evt.prescriptionDiagnosis && (
                        <p className="text-xs text-vital mt-1 font-semibold">Linked to: {evt.prescriptionDiagnosis}</p>
                      )}
                    </div>
                    {evt.attachmentUrl && (
                      <a
                        href={`${API_BASE}${evt.attachmentUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg bg-vital-light px-3 py-1.5 text-xs font-semibold text-vital-dark hover:bg-vital/20"
                      >
                        <Download size={13} /> View
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink/80"><strong>Findings:</strong> {evt.findings}</p>
                  {evt.remarks && <p className="mt-1 text-sm text-ink/60"><strong>Remarks:</strong> {evt.remarks}</p>}
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
