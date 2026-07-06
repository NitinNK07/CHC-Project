import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { patientApi } from "../../api/patientApi";
import { patientNavItems } from "./patientNav";
import { formatDateTime } from "../../utils/format";
import { FlaskConical, Download, Search } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function MyLabReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientApi.getMyLabReports().then((res) => setReports(res.data)).finally(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter((r) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return r.testName?.toLowerCase().includes(term) || r.findings?.toLowerCase().includes(term);
  });

  return (
    <DashboardLayout navItems={patientNavItems}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink mb-1">My Lab Reports</h1>
          <p className="text-sm text-ink/60">Results uploaded by pathologists for tests your doctor requested.</p>
        </div>
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-mist" />
          </div>
          <Input 
            className="pl-9" 
            placeholder="Search reports..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : reports.length === 0 ? (
        <EmptyState icon={FlaskConical} title="No lab reports yet" subtitle="They'll appear here once a pathologist uploads results." />
      ) : filteredReports.length === 0 ? (
        <p className="text-sm text-mist text-center py-8">No reports found matching "{search}".</p>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display font-semibold text-ink">{r.testName}</p>
                  <p className="text-xs text-mist">{r.pathologistName} · {formatDateTime(r.reportDate)}</p>
                  {r.prescriptionDiagnosis && (
                    <p className="text-xs text-vital mt-1 font-semibold">Linked to: {r.prescriptionDiagnosis}</p>
                  )}
                </div>
                {r.attachmentUrl && (
                  <div className="flex flex-col items-end gap-2">
                    <a
                      href={`${API_BASE}${r.attachmentUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-vital-light px-3 py-1.5 text-xs font-semibold text-vital-dark hover:bg-vital/20"
                    >
                      <Download size={13} /> {r.attachmentOriginalName || "Attachment"}
                    </a>
                    {r.attachmentUrl.match(/\.(jpeg|jpg|png)$/i) && (
                      <img src={`${API_BASE}${r.attachmentUrl}`} alt="Attachment preview" className="mt-2 max-w-[200px] max-h-[200px] rounded-lg border border-mist-light object-contain" />
                    )}
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-ink/80"><strong>Findings:</strong> {r.findings}</p>
              {r.remarks && <p className="mt-1 text-sm text-ink/60"><strong>Remarks:</strong> {r.remarks}</p>}
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
