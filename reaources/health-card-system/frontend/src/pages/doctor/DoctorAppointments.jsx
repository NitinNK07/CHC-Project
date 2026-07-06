import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { doctorApi } from "../../api/doctorApi";
import { doctorNavItems } from "./doctorNav";
import { formatDateTime, statusColors } from "../../utils/format";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { CalendarCheck, Check, X, CheckCheck } from "lucide-react";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = () => {
    doctorApi.getMyAppointments().then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await doctorApi.updateAppointmentStatus(id, { status });
      toast.success(`Marked as ${status.toLowerCase()}`);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <DashboardLayout navItems={doctorNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Appointments</h1>
      <p className="mb-6 text-sm text-ink/60">Confirm, reject, or complete patient requests.</p>

      {loading ? (
        <Loader />
      ) : appointments.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No appointments yet" />
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display font-semibold text-ink">{a.patientName}</p>
                <p className="text-sm text-ink/70">{a.reasonForVisit}</p>
                <p className="text-xs text-mist">{formatDateTime(a.appointmentTime)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={statusColors[a.status]}>{a.status}</Badge>
                {a.status === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => updateStatus(a.id, "CONFIRMED")}><Check size={14} /> Confirm</Button>
                    <Button size="sm" variant="danger" onClick={() => updateStatus(a.id, "REJECTED")}><X size={14} /> Reject</Button>
                  </>
                )}
                {a.status === "CONFIRMED" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "COMPLETED")}><CheckCheck size={14} /> Complete</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
