import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { doctorApi } from "../../api/doctorApi";
import { doctorNavItems } from "./doctorNav";
import { formatDateTime } from "../../utils/format";
import { FileText, Pill } from "lucide-react";

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi.getMyPrescriptions().then((res) => setPrescriptions(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={doctorNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">My Prescriptions</h1>
      <p className="mb-6 text-sm text-ink/60">Every prescription you've issued.</p>

      {loading ? (
        <Loader />
      ) : prescriptions.length === 0 ? (
        <EmptyState icon={FileText} title="No prescriptions issued yet" subtitle="Look up a patient to write your first prescription." />
      ) : (
        <div className="space-y-4">
          {prescriptions.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display font-semibold text-ink">{p.patientName}</p>
                  <p className="text-xs text-mist">{p.diagnosis} · {formatDateTime(p.createdAt)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.items.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1 rounded-lg bg-mist-light px-2.5 py-1 text-xs text-ink/70">
                    <Pill size={12} className="text-vital" /> {item.medicineName}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
