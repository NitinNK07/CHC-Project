import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { adminApi } from "../../api/adminApi";
import { adminNavItems } from "./adminNav";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/errors";
import { ShieldCheck, Stethoscope, FlaskConical, Check } from "lucide-react";

export default function VerifyAccounts() {
  const [doctors, setDoctors] = useState([]);
  const [pathologists, setPathologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = () => {
    Promise.all([adminApi.getPendingDoctors(), adminApi.getPendingPathologists()])
      .then(([d, p]) => {
        setDoctors(d.data);
        setPathologists(p.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const verifyDoctor = async (id) => {
    try {
      await adminApi.verifyDoctor(id, true);
      toast.success("Doctor verified.");
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const verifyPathologist = async (id) => {
    try {
      await adminApi.verifyPathologist(id, true);
      toast.success("Pathologist verified.");
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <DashboardLayout navItems={adminNavItems}>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Verify Accounts</h1>
      <p className="mb-6 text-sm text-ink/60">Approve license numbers before doctors/pathologists can use the platform.</p>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-ink">
              <Stethoscope size={17} /> Pending doctors ({doctors.length})
            </h3>
            {doctors.length === 0 ? (
              <EmptyState icon={ShieldCheck} title="All caught up" subtitle="No doctors waiting for verification." />
            ) : (
              <div className="space-y-3">
                {doctors.map((d) => (
                  <Card key={d.doctorId} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink">Dr. {d.fullName}</p>
                      <p className="text-xs text-mist">{d.specialization} · License: {d.medicalLicenseNumber}</p>
                      <p className="text-xs text-mist">{d.hospitalName} · {d.email}</p>
                    </div>
                    <Button size="sm" onClick={() => verifyDoctor(d.doctorId)}><Check size={14} /> Verify</Button>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-ink">
              <FlaskConical size={17} /> Pending pathologists ({pathologists.length})
            </h3>
            {pathologists.length === 0 ? (
              <EmptyState icon={ShieldCheck} title="All caught up" subtitle="No pathologists waiting for verification." />
            ) : (
              <div className="space-y-3">
                {pathologists.map((p) => (
                  <Card key={p.pathologistId} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink">{p.fullName}</p>
                      <p className="text-xs text-mist">{p.labName} · License: {p.labLicenseNumber}</p>
                      <p className="text-xs text-mist">{p.email}</p>
                    </div>
                    <Button size="sm" onClick={() => verifyPathologist(p.pathologistId)}><Check size={14} /> Verify</Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
