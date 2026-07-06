import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import { doctorApi } from "../../api/doctorApi";
import { doctorNavItems } from "./doctorNav";
import { formatDateTime, statusColors } from "../../utils/format";
import { ShieldAlert, ShieldCheck, ScanLine, CalendarCheck, FileText, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([doctorApi.getMe(), doctorApi.getMyAppointments(), doctorApi.getMyPrescriptions()])
      .then(([me, appts, presc]) => {
        setProfile(me.data);
        setAppointments(appts.data);
        setPrescriptions(presc.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={doctorNavItems}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold text-ink mb-1">Hi, Dr. {user?.fullName?.split(" ")[0]} 👋</h1>
          <p className="mb-6 text-sm text-ink/60">{profile?.specialization} · {profile?.hospitalName}</p>          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={CalendarCheck} label="Appointments" value={appointments.length} accent="vital" />
            <StatCard icon={FileText} label="Prescriptions issued" value={prescriptions.length} accent="gold" />
            <StatCard icon={ShieldCheck} label="Account status" value={profile?.verified ? "Verified" : "Pending"} accent={profile?.verified ? "vital" : "coral"} />
          </div>

          <Card className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-card-gradient text-white">
            <div>
              <p className="font-display text-lg font-semibold">Need to see a patient's history?</p>
              <p className="text-sm text-white/70">Ask them for their health card number and ID.</p>
            </div>
            <Link to="/doctor/lookup" className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white/90">
              <ScanLine size={16} /> Look up patient
            </Link>
          </Card>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display font-semibold text-ink">Upcoming appointments</h3>
                <Link to="/doctor/appointments" className="flex items-center gap-1 text-xs font-semibold text-vital">
                  Manage <ArrowRight size={13} />
                </Link>
              </div>
              {appointments.length === 0 ? (
                <p className="text-sm text-mist">No appointments yet.</p>
              ) : (
                <ul className="space-y-3">
                  {appointments.slice(0, 5).map((a) => (
                    <li key={a.id} className="flex items-center justify-between rounded-xl border border-mist-light p-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">{a.patientName}</p>
                        <p className="text-xs text-mist">{formatDateTime(a.appointmentTime)}</p>
                      </div>
                      <Badge color={statusColors[a.status]}>{a.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <h3 className="mb-4 font-display font-semibold text-ink">Recently issued prescriptions</h3>
              {prescriptions.length === 0 ? (
                <p className="text-sm text-mist">No prescriptions issued yet.</p>
              ) : (
                <ul className="space-y-3">
                  {prescriptions.slice(0, 5).map((p) => (
                    <li key={p.id} className="rounded-xl border border-mist-light p-3">
                      <p className="text-sm font-semibold text-ink">{p.patientName}</p>
                      <p className="text-xs text-mist">{p.diagnosis} · {formatDateTime(p.createdAt)}</p>
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
