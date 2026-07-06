import {
  LayoutDashboard, CreditCard, CalendarCheck, FileText,
  FlaskConical, Stethoscope, Activity, UserCog, Heart, ShieldAlert,
} from "lucide-react";

export const patientNavItems = [
  { to: "/patient/dashboard", icon: LayoutDashboard, label: "Dashboard", labelKey: "dashboard", section: "main" },
  { to: "/patient/health-card", icon: CreditCard, label: "My Health Card", labelKey: "myHealthCard", section: "main" },
  { to: "/patient/timeline", icon: Activity, label: "Health Timeline", labelKey: "healthTimeline", section: "main" },
  { to: "/patient/doctors", icon: Stethoscope, label: "Find Doctor", labelKey: "findDoctor", section: "main" },
  { to: "/patient/appointments", icon: CalendarCheck, label: "Appointments", labelKey: "appointments", section: "Records" },
  { to: "/patient/prescriptions", icon: FileText, label: "Prescriptions", labelKey: "prescriptions", section: "Records" },
  { to: "/patient/lab-reports", icon: FlaskConical, label: "Lab Reports", labelKey: "labReports", section: "Records" },
  { to: "/patient/vaccinations", icon: Heart, label: "Vaccinations", labelKey: "vaccinations", section: "Records" },
  { to: "/patient/allergies", icon: ShieldAlert, label: "Allergies", labelKey: "allergies", section: "Records" },
  { to: "/patient/analytics", icon: Activity, label: "Health Analytics", labelKey: "healthAnalytics", section: "Insights" },
  { to: "/patient/emergency", icon: ShieldAlert, label: "Emergency Info", labelKey: "emergencyInfo", section: "Insights" },
  { to: "/patient/profile", icon: UserCog, label: "Profile", labelKey: "profile", section: "Account" },
  { to: "/patient/access-log", icon: FileText, label: "Access Log", labelKey: "accessLog", section: "Account" },
];
