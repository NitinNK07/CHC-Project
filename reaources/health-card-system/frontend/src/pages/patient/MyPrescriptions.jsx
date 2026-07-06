import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { patientApi } from "../../api/patientApi";
import { patientNavItems } from "./patientNav";
import { formatDateTime } from "../../utils/format";
import { FileText, Pill } from "lucide-react";

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientApi.getMyPrescriptions().then((res) => setPrescriptions(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={patientNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">My Prescriptions</h1>
      <p className="mb-6 text-sm text-ink/60">Every prescription issued for you, in one place.</p>

      {loading ? (
        <Loader />
      ) : prescriptions.length === 0 ? (
        <EmptyState icon={FileText} title="No prescriptions yet" subtitle="They'll appear here as soon as a doctor issues one." />
      ) : (
        <div className="space-y-4">
          {prescriptions.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display font-semibold text-ink">{p.diagnosis}</p>
                  <p className="text-xs text-mist">Dr. {p.doctorName} · {formatDateTime(p.createdAt)}</p>
                </div>
              </div>
              {p.advice && <p className="mt-2 text-sm text-ink/70 italic">"{p.advice}"</p>}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {p.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 rounded-xl border border-mist-light p-3">
                    <Pill size={16} className="mt-0.5 shrink-0 text-vital" />
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.medicineName}</p>
                      <p className="text-xs text-mist">
                        {[item.dosage, item.frequency, item.duration].filter(Boolean).join(" · ")}
                      </p>
                      {item.instructions && <p className="mt-0.5 text-xs text-ink/60">{item.instructions}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
