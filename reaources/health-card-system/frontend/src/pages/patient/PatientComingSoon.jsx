import DashboardLayout from "../../components/DashboardLayout";
import { patientNavItems } from "./patientNav";

export default function PatientComingSoon() {
  return (
    <DashboardLayout navItems={patientNavItems}>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-ink mb-2">Coming Soon</h2>
        <p className="text-ink/60">This feature is currently under development.</p>
      </div>
    </DashboardLayout>
  );
}
