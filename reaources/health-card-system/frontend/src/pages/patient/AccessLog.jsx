import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { patientApi } from "../../api/patientApi";
import { patientNavItems } from "./patientNav";
import { formatDateTime } from "../../utils/format";
import { ShieldCheck, ShieldAlert, Eye } from "lucide-react";

const actionLabels = {
  PATIENT_RECORD_ACCESSED: { label: "Record accessed", color: "vital", icon: Eye },
  PATIENT_RECORD_ACCESS_DENIED: { label: "Access attempt denied", color: "coral", icon: ShieldAlert },
  PRESCRIPTION_CREATED: { label: "Prescription issued", color: "gold", icon: Eye },
  LAB_REPORT_UPLOADED: { label: "Lab report uploaded", color: "gold", icon: Eye },
  APPOINTMENT_BOOKED: { label: "Appointment booked", color: "mist", icon: Eye },
  BILL_CREATED: { label: "Bill raised", color: "mist", icon: Eye },
  BILL_PAID: { label: "Bill paid", color: "vital", icon: Eye },
  DOCTOR_AUTHORIZED_BY_PATIENT: { label: "Doctor authorized", color: "vital", icon: ShieldCheck },
  DOCTOR_AUTHORIZATION_REVOKED: { label: "Doctor access revoked", color: "coral", icon: ShieldAlert },
};

export default function AccessLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientApi.getAccessLog().then((res) => setLogs(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={patientNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Access Log</h1>
      <p className="mb-6 text-sm text-ink/60">Every time someone has accessed — or tried to access — your record.</p>

      {loading ? (
        <Loader />
      ) : logs.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No activity yet" subtitle="Your access history will show up here." />
      ) : (
        <Card>
          <ul className="divide-y divide-mist-light">
            {logs.map((log) => {
              const meta = actionLabels[log.action] || { label: log.action, color: "mist", icon: Eye };
              const Icon = meta.icon;
              return (
                <li key={log.id} className="flex items-start gap-3 py-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mist-light text-ink/60">
                    <Icon size={15} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{log.actorName}</p>
                      <Badge color={meta.color}>{meta.label}</Badge>
                    </div>
                    {log.details && <p className="mt-0.5 text-xs text-mist">{log.details}</p>}
                  </div>
                  <p className="shrink-0 text-xs text-mist">{formatDateTime(log.timestamp)}</p>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </DashboardLayout>
  );
}
