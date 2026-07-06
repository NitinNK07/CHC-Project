import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { patientApi } from "../../api/patientApi";
import { patientNavItems } from "./patientNav";
import { formatDateTime, statusColors } from "../../utils/format";
import { CalendarCheck } from "lucide-react";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientApi.getMyAppointments().then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={patientNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">My Appointments</h1>
      <p className="mb-6 text-sm text-ink/60">Track requests and confirmations with your doctors.</p>

      {loading ? (
        <Loader />
      ) : appointments.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No appointments yet" subtitle="Book one from the Find a Doctor page." />
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display font-semibold text-ink">Dr. {a.doctorName}</p>
                <p className="text-xs text-mist">{a.doctorSpecialization}</p>
                <p className="mt-1 text-sm text-ink/70">{a.reasonForVisit}</p>
              </div>
              <div className="text-right">
                <Badge color={statusColors[a.status]}>{a.status}</Badge>
                <p className="mt-1.5 text-xs text-mist">{formatDateTime(a.appointmentTime)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
