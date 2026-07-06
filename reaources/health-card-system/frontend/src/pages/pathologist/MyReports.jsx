import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { pathologistApi } from "../../api/pathologistApi";
import { pathologistNavItems } from "./pathologistNav";
import { formatDateTime } from "../../utils/format";
import { FileText, Download } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pathologistApi.getMyReports().then((res) => setReports(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={pathologistNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">My Reports</h1>
      <p className="mb-6 text-sm text-ink/60">Every report you've uploaded.</p>

      {loading ? (
        <Loader />
      ) : reports.length === 0 ? (
        <EmptyState icon={FileText} title="No reports uploaded yet" />
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display font-semibold text-ink">{r.testName} — {r.patientName}</p>
                  <p className="text-xs text-mist">{formatDateTime(r.reportDate)}</p>
                </div>
                {r.attachmentUrl && (
                  <div className="flex flex-col items-end gap-2">
                    <a href={`${API_BASE}${r.attachmentUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg bg-vital-light px-3 py-1.5 text-xs font-semibold text-vital-dark hover:bg-vital/20">
                      <Download size={13} /> {r.attachmentOriginalName || "Attachment"}
                    </a>
                    {r.attachmentUrl.match(/\.(jpeg|jpg|png)$/i) && (
                      <img src={`${API_BASE}${r.attachmentUrl}`} alt="Attachment preview" className="mt-2 max-w-[200px] max-h-[200px] rounded-lg border border-mist-light object-contain" />
                    )}
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-ink/80">{r.findings}</p>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
