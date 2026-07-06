import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck, FileText, FlaskConical, Receipt, ArrowRight,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import HealthCardVisual from "../../components/HealthCardVisual";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Badge from "../../components/ui/Badge";
import { patientApi } from "../../api/patientApi";
import { formatDateTime, statusColors } from "../../utils/format";
import { patientNavItems } from "./patientNav";

export default function PatientDashboard() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [revealSecretId, setRevealSecretId] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      patientApi.getMe(),
      patientApi.getMyAppointments(),
      patientApi.getMyPrescriptions(),
      patientApi.getMyLabReports(),
    ])
      .then(([me, appts, presc, labs]) => {
        setProfile(me.data);
        setAppointments(appts.data);
        setPrescriptions(presc.data);
        setLabReports(labs.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={patientNavItems}>
      {loading ? (
        <Loader label="Loading your dashboard..." />
      ) : (
        <>
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-ink">Hi, {profile?.fullName?.split(" ")[0]} 👋</h1>
            <p className="text-sm text-ink/60">Here's what's happening with your health record.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <div>
              <HealthCardVisual
                card={profile?.healthCard}
                patientName={profile?.fullName}
                revealSecretId={revealSecretId}
                onToggleReveal={() => setRevealSecretId((v) => !v)}
              />
              <p className="mt-3 text-xs text-ink/50">
                Only share your health card ID with a doctor in person during a consultation. Click it above to reveal/hide.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 content-start sm:grid-cols-2">
              <StatCard icon={CalendarCheck} label="Appointments" value={appointments.length} accent="vital" />
              <StatCard icon={FileText} label="Prescriptions" value={prescriptions.length} accent="gold" />
              <StatCard icon={FlaskConical} label="Lab reports" value={labReports.length} accent="coral" />
              <StatCard icon={Receipt} label="Health card status" value={profile?.healthCard?.status || "—"} accent="ink" />
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display font-semibold text-ink">Upcoming appointments</h3>
                <Link to="/patient/appointments" className="flex items-center gap-1 text-xs font-semibold text-vital">
                  View all <ArrowRight size={13} />
                </Link>
              </div>
              {appointments.length === 0 ? (
                <p className="text-sm text-mist">No appointments yet.</p>
              ) : (
                <ul className="space-y-3">
                  {appointments.slice(0, 4).map((a) => (
                    <li key={a.id} className="flex items-center justify-between rounded-xl border border-mist-light p-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">Dr. {a.doctorName}</p>
                        <p className="text-xs text-mist">{formatDateTime(a.appointmentTime)}</p>
                      </div>
                      <Badge color={statusColors[a.status]}>{a.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display font-semibold text-ink">Recent prescriptions</h3>
                <Link to="/patient/prescriptions" className="flex items-center gap-1 text-xs font-semibold text-vital">
                  View all <ArrowRight size={13} />
                </Link>
              </div>
              {prescriptions.length === 0 ? (
                <p className="text-sm text-mist">No prescriptions yet.</p>
              ) : (
                <ul className="space-y-3">
                  {prescriptions.slice(0, 4).map((p) => (
                    <li key={p.id} className="rounded-xl border border-mist-light p-3">
                      <p className="text-sm font-semibold text-ink">{p.diagnosis}</p>
                      <p className="text-xs text-mist">Dr. {p.doctorName} · {formatDateTime(p.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
