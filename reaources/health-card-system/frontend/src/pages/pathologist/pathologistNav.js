import { LayoutDashboard, ClipboardList, FileText, ScanLine } from "lucide-react";

export const pathologistNavItems = [
  { to: "/pathologist/dashboard", icon: LayoutDashboard, label: "Dashboard", labelKey: "dashboard", section: "main" },
  { to: "/pathologist/queue", icon: ClipboardList, label: "Lab Queue", labelKey: "labQueue", section: "main" },
  { to: "/pathologist/reports", icon: FileText, label: "My Reports", labelKey: "myReports", section: "Reports" },
  { to: "/pathologist/patient-search", icon: ScanLine, label: "Patient Search", labelKey: "patientSearch", section: "Reports" },
];
