import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { adminApi } from "../../api/adminApi";
import { adminNavItems } from "./adminNav";
import { formatDateTime } from "../../utils/format";
import { ScrollText } from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAuditLogs().then((res) => setLogs(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={adminNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Audit Logs</h1>
      <p className="mb-6 text-sm text-ink/60">Full system-wide activity trail.</p>

      {loading ? (
        <Loader />
      ) : logs.length === 0 ? (
        <EmptyState icon={ScrollText} title="No activity recorded yet" />
      ) : (
        <Card>
          <ul className="divide-y divide-mist-light">
            {logs.map((log) => (
              <li key={log.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{log.actorName}</p>
                    <Badge color="mist">{log.actorRole}</Badge>
                    <Badge color={log.action.includes("DENIED") ? "coral" : "vital"}>{log.action.replaceAll("_", " ")}</Badge>
                  </div>
                  {log.targetPatientName && <p className="mt-0.5 text-xs text-mist">Target: {log.targetPatientName}</p>}
                  {log.details && <p className="mt-0.5 text-xs text-ink/60">{log.details}</p>}
                </div>
                <p className="shrink-0 text-xs text-mist">{formatDateTime(log.timestamp)}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </DashboardLayout>
  );
}
