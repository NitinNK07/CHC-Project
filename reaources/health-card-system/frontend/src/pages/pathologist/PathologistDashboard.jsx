import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import { pathologistApi } from "../../api/pathologistApi";
import { pathologistNavItems } from "./pathologistNav";
import { ShieldAlert, ListChecks, FileText, ArrowRight, ClipboardList } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatDateTime } from "../../utils/format";

export default function PathologistDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [queue, setQueue] = useState([]);
  const [myTests, setMyTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([pathologistApi.getMe(), pathologistApi.getQueue(), pathologistApi.getMyTests()])
      .then(([me, q, mine]) => {
        setProfile(me.data);
        setQueue(q.data);
        setMyTests(mine.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={pathologistNavItems}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold text-ink mb-1">Hi, {user?.fullName?.split(" ")[0]} 👋</h1>
          <p className="mb-6 text-sm text-ink/60">{profile?.labName}</p>

          {!profile?.verified && (
            <Card className="mb-6 border-gold/30 bg-gold/5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 shrink-0 text-gold" size={22} />
                <div>
                  <p className="font-display font-semibold text-ink">Verification pending</p>
                  <p className="text-sm text-ink/60">An administrator needs to verify your lab license before requests appear in your queue.</p>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard icon={ListChecks} label="Open queue" value={queue.length} accent="gold" />
            <StatCard icon={FileText} label="Assigned to me" value={myTests.length} accent="vital" />
          </div>

          <Card className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-card-gradient text-white">
            <div>
              <p className="font-display text-lg font-semibold">Tests waiting for a lab</p>
              <p className="text-sm text-white/70">Claim one from the open queue to start processing.</p>
            </div>
            <Link to="/pathologist/queue" className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white/90">
              <ClipboardList size={16} /> Go to queue
            </Link>
          </Card>

          <Card className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-semibold text-ink">My assigned tests</h3>
              <Link to="/pathologist/queue" className="flex items-center gap-1 text-xs font-semibold text-vital">
                View all <ArrowRight size={13} />
              </Link>
            </div>
            {myTests.length === 0 ? (
              <p className="text-sm text-mist">Nothing assigned yet.</p>
            ) : (
              <ul className="space-y-3">
                {myTests.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded-xl border border-mist-light p-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{t.testName} — {t.patientName}</p>
                      <p className="text-xs text-mist">Requested by Dr. {t.doctorName} · {formatDateTime(t.requestedAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
