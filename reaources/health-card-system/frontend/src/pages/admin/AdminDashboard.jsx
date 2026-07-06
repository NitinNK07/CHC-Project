import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import { adminApi } from "../../api/adminApi";
import { adminNavItems } from "./adminNav";
import { Users, Stethoscope, FlaskConical, ShieldAlert, CalendarCheck, FileText, FlaskRound } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats().then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={adminNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">System Overview</h1>
      <p className="mb-6 text-sm text-ink/60">Platform-wide stats across all roles.</p>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Patients" value={stats.totalPatients} accent="vital" />
            <StatCard icon={Stethoscope} label="Doctors" value={stats.totalDoctors} accent="gold" />
            <StatCard icon={FlaskConical} label="Pathologists" value={stats.totalPathologists} accent="coral" />
            <StatCard icon={ShieldAlert} label="Pending verifications" value={stats.pendingDoctorVerifications + stats.pendingPathologistVerifications} accent="ink" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard icon={CalendarCheck} label="Total appointments" value={stats.totalAppointments} accent="vital" />
            <StatCard icon={FileText} label="Total prescriptions" value={stats.totalPrescriptions} accent="gold" />
            <StatCard icon={FlaskRound} label="Total lab reports" value={stats.totalLabReports} accent="coral" />
          </div>

          <Card className="mt-6">
            <h3 className="mb-4 font-display font-semibold text-ink">Appointments by status</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {Object.entries(stats.appointmentsByStatus).map(([status, count]) => (
                <div key={status} className="rounded-xl border border-mist-light p-3 text-center">
                  <p className="font-display text-xl font-bold text-ink">{count}</p>
                  <p className="text-xs text-mist">{status}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
