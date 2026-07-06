import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import WritePrescriptionModal from "../../components/doctor/WritePrescriptionModal";
import RequestLabTestModal from "../../components/doctor/RequestLabTestModal";
import CreateBillModal from "../../components/doctor/CreateBillModal";
import { doctorApi } from "../../api/doctorApi";
import { doctorNavItems } from "./doctorNav";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { formatDate, formatDateTime, statusColors } from "../../utils/format";
import { ScanLine, ShieldCheck, FileText, FlaskConical, CalendarCheck, Receipt, Pill, Lock, Download, Image as ImageIcon } from "lucide-react";
import { validatePatientLookup } from "../../utils/validation";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const TABS = [
  { key: "prescriptions", label: "Prescriptions", icon: FileText },
  { key: "labReports", label: "Lab Reports", icon: FlaskConical },
  { key: "appointments", label: "Appointments", icon: CalendarCheck },
];

export default function PatientLookup() {
  const [form, setForm] = useState({ healthCardNumber: "", healthCardId: "" });
  const [record, setRecord] = useState(null);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [modal, setModal] = useState(null); // 'prescription' | 'labtest' | 'bill'
  const [labSearch, setLabSearch] = useState("");
  const toast = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();

    const errors = validatePatientLookup(form.healthCardNumber, form.healthCardId);
    if (Object.keys(errors).length > 0) {
      if (errors.healthCardNumber) toast.error(errors.healthCardNumber);
      if (errors.healthCardId) toast.error(errors.healthCardId);
      return;
    }

    setSearching(true);
    try {
      const { data } = await doctorApi.lookupPatient(form);
      setRecord(data);
      toast.success("Patient record unlocked.");
    } catch (err) {
      setRecord(null);
      toast.error(extractErrorMessage(err));
    } finally {
      setSearching(false);
    }
  };

  const refreshRecord = async () => {
    try {
      const { data } = await doctorApi.lookupPatient(form);
      setRecord(data);
    } catch {
      /* silent - access already validated this session */
    }
  };

  return (
    <DashboardLayout navItems={doctorNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Patient Lookup</h1>
      <p className="mb-6 text-sm text-ink/60">
        Enter the patient's health card number <em>and</em> health card ID to unlock their record. Both must match exactly.
      </p>

      <Card className="mb-6">
        <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Input
            label="Health card number"
            required
            placeholder="HC-XXXX-XXXX-XXXX"
            value={form.healthCardNumber}
            onChange={(e) => setForm({ ...form, healthCardNumber: e.target.value.toUpperCase() })}
          />
          <Input
            label="Health card ID (secret)"
            required
            placeholder="Provided by the patient"
            value={form.healthCardId}
            onChange={(e) => setForm({ ...form, healthCardId: e.target.value.toUpperCase() })}
          />
          <Button type="submit" loading={searching}>
            <ScanLine size={16} /> Unlock record
          </Button>
        </form>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-mist">
          <Lock size={12} /> Every lookup attempt — successful or not — is logged and visible to the patient.
        </p>
      </Card>

      {!record ? (
        <EmptyState icon={ScanLine} title="No record loaded" subtitle="Search a patient using their health card credentials to begin." />
      ) : (
        <>
          <Card className="mb-6 bg-card-gradient text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display text-xl font-semibold">{record.profile.fullName}</p>
                  <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium">
                    <ShieldCheck size={12} /> Verified access
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/70">
                  {record.profile.gender} · DOB {formatDate(record.profile.dateOfBirth)} · {record.profile.bloodGroup || "Blood group N/A"}
                </p>
                {record.profile.knownAllergies && (
                  <p className="mt-2 text-sm text-coral-light">⚠ Allergies: {record.profile.knownAllergies}</p>
                )}
                {record.profile.chronicConditions && (
                  <p className="mt-1 text-sm text-white/70">Chronic conditions: {record.profile.chronicConditions}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-gold text-ink hover:bg-gold/90 shadow-glow-gold border-none" onClick={() => setModal("prescription")}>
                  <Pill size={14} /> Prescribe
                </Button>
                <Button size="sm" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-none" onClick={() => setModal("labtest")}>
                  <FlaskConical size={14} /> Lab test
                </Button>
                <Button size="sm" className="bg-coral text-white hover:bg-coral-light border-none shadow-glow" onClick={() => setModal("bill")}>
                  <Receipt size={14} /> Raise bill
                </Button>
              </div>
            </div>
          </Card>

          <div className="mb-4 flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === tab.key ? "bg-ink text-white" : "bg-white text-ink/60 hover:bg-mist-light"
                }`}
              >
                <tab.icon size={15} /> {tab.label} ({record[tab.key]?.length ?? 0})
              </button>
            ))}
          </div>

          {activeTab === "prescriptions" && (
            record.prescriptions.length === 0 ? (
              <EmptyState icon={FileText} title="No prescriptions on file" />
            ) : (
              <div className="space-y-3">
                {record.prescriptions.map((p) => (
                  <Card key={p.id}>
                    <p className="font-display font-semibold text-ink">{p.diagnosis}</p>
                    <p className="text-xs text-mist">Dr. {p.doctorName} · {formatDateTime(p.createdAt)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.items.map((it, i) => (
                        <Badge key={i} color="mist">{it.medicineName}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}

          {activeTab === "labReports" && (
            <div>
              <div className="mb-4">
                <Input 
                  placeholder="Search lab reports by test name or findings..." 
                  value={labSearch}
                  onChange={(e) => setLabSearch(e.target.value)}
                />
              </div>
              {record.labReports.filter(r => !labSearch || r.testName?.toLowerCase().includes(labSearch.toLowerCase()) || r.findings?.toLowerCase().includes(labSearch.toLowerCase())).length === 0 ? (
                <EmptyState icon={FlaskConical} title={labSearch ? "No matching reports" : "No lab reports on file"} />
              ) : (
                <div className="space-y-3">
                  {record.labReports.filter(r => !labSearch || r.testName?.toLowerCase().includes(labSearch.toLowerCase()) || r.findings?.toLowerCase().includes(labSearch.toLowerCase())).map((r) => (
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
                              <Download size={13} /> {r.attachmentOriginalName || "View Attachment"}
                            </a>
                            {r.attachmentUrl.match(/\.(jpeg|jpg|png)$/i) && (
                              <img src={`${API_BASE}${r.attachmentUrl}`} alt="Attachment preview" className="mt-2 max-w-[200px] max-h-[200px] rounded-lg border border-mist-light object-contain" />
                            )}
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-ink/80">{r.findings}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            record.appointments.length === 0 ? (
              <EmptyState icon={CalendarCheck} title="No appointment history" />
            ) : (
              <div className="space-y-3">
                {record.appointments.map((a) => (
                  <Card key={a.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-ink">Dr. {a.doctorName}</p>
                      <p className="text-xs text-mist">{formatDateTime(a.appointmentTime)}</p>
                    </div>
                    <Badge color={statusColors[a.status]}>{a.status}</Badge>
                  </Card>
                ))}
              </div>
            )
          )}
        </>
      )}

      <WritePrescriptionModal open={modal === "prescription"} onClose={() => setModal(null)} cardCredentials={form} onCreated={refreshRecord} />
      <RequestLabTestModal open={modal === "labtest"} onClose={() => setModal(null)} cardCredentials={form} prescriptions={record?.prescriptions || []} onCreated={refreshRecord} />
      <CreateBillModal open={modal === "bill"} onClose={() => setModal(null)} cardCredentials={form} onCreated={refreshRecord} />
    </DashboardLayout>
  );
}
