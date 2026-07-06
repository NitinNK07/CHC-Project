import {
  LayoutDashboard, ScanLine, CalendarCheck, FileText, Users, Activity,
} from "lucide-react";

export const doctorNavItems = [
  { to: "/doctor/dashboard", icon: LayoutDashboard, label: "Dashboard", labelKey: "dashboard", section: "main" },
  { to: "/doctor/lookup", icon: ScanLine, label: "Patient Lookup", labelKey: "patientLookup", section: "main" },
  { to: "/doctor/appointments", icon: CalendarCheck, label: "Appointments", labelKey: "appointments", section: "Practice" },
  { to: "/doctor/prescriptions", icon: FileText, label: "Prescriptions", labelKey: "prescriptions", section: "Practice" },
];
