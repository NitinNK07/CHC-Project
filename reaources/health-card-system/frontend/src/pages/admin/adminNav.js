import {
  LayoutDashboard, Users, Stethoscope, FlaskConical, ShieldCheck,
  ScrollText, FileText, Bell, Settings, Hospital,
} from "lucide-react";

export const adminNavItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", labelKey: "dashboard", section: "main" },
  { to: "/admin/doctors", icon: Stethoscope, label: "Manage Doctors", labelKey: "manageDoctors", section: "Management" },
  { to: "/admin/patients", icon: Users, label: "Manage Patients", labelKey: "managePatients", section: "Management" },
  { to: "/admin/pathologists", icon: FlaskConical, label: "Manage Pathologists", labelKey: "managePathologists", section: "Management" },
  { to: "/admin/hospitals", icon: Hospital, label: "Hospitals", labelKey: "hospitalManagement", section: "Management" },
  { to: "/admin/verify", icon: ShieldCheck, label: "Verify Accounts", labelKey: "verifyAccounts", section: "Operations" },
  { to: "/admin/audit-logs", icon: ScrollText, label: "Audit Logs", labelKey: "auditLogs", section: "Operations" },
  { to: "/admin/reports", icon: FileText, label: "Report Monitoring", labelKey: "reportMonitoring", section: "Operations" },
  { to: "/admin/notifications", icon: Bell, label: "Notifications", labelKey: "notificationManagement", section: "System" },
  { to: "/admin/settings", icon: Settings, label: "System Settings", labelKey: "systemSettings", section: "System" },
];
