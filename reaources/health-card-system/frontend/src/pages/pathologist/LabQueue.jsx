import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import UploadReportModal from "../../components/pathologist/UploadReportModal";
import { pathologistApi } from "../../api/pathologistApi";
import { pathologistNavItems } from "./pathologistNav";
import { formatDateTime, statusColors } from "../../utils/format";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { ListChecks, ClipboardCheck, Upload } from "lucide-react";

export default function LabQueue() {
  const [tab, setTab] = useState("open");
  const [queue, setQueue] = useState([]);
  const [myTests, setMyTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingTest, setUploadingTest] = useState(null);
  const toast = useToast();

  const load = () => {
    Promise.all([pathologistApi.getQueue(), pathologistApi.getMyTests()])
      .then(([q, m]) => {
        setQueue(q.data);
        setMyTests(m.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const claim = async (id) => {
    try {
      await pathologistApi.claim(id);
      toast.success("Test claimed — find it under 'Assigned to me'.");
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const list = tab === "open" ? queue : myTests;

  return (
    <DashboardLayout navItems={pathologistNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Lab Queue</h1>
      <p className="mb-6 text-sm text-ink/60">Claim open requests, then upload findings once testing is complete.</p>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("open")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${tab === "open" ? "bg-ink text-white" : "bg-white text-ink/60 hover:bg-mist-light"}`}
        >
          Open queue ({queue.length})
        </button>
        <button
          onClick={() => setTab("mine")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${tab === "mine" ? "bg-ink text-white" : "bg-white text-ink/60 hover:bg-mist-light"}`}
        >
          Assigned to me ({myTests.length})
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : list.length === 0 ? (
        <EmptyState icon={ListChecks} title={tab === "open" ? "No open requests" : "Nothing assigned yet"} />
      ) : (
        <div className="space-y-3">
          {list.map((t) => (
            <Card key={t.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display font-semibold text-ink">{t.testName} — {t.patientName}</p>
                <p className="text-xs text-mist">Requested by Dr. {t.doctorName} · {formatDateTime(t.requestedAt)}</p>
                {t.clinicalNotes && <p className="mt-1 text-sm text-ink/70">{t.clinicalNotes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge color={statusColors[t.status]}>{t.status}</Badge>
                {tab === "open" ? (
                  <Button size="sm" onClick={() => claim(t.id)}><ClipboardCheck size={14} /> Claim</Button>
                ) : (
                  t.status !== "COMPLETED" && (
                    <Button size="sm" onClick={() => setUploadingTest(t)}><Upload size={14} /> Upload report</Button>
                  )
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <UploadReportModal
        open={!!uploadingTest}
        onClose={() => setUploadingTest(null)}
        labTest={uploadingTest}
        onUploaded={load}
      />
    </DashboardLayout>
  );
}
