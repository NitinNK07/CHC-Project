import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import RegisterChoice from "./pages/auth/RegisterChoice";
import RegisterPatient from "./pages/auth/RegisterPatient";
import RegisterDoctor from "./pages/auth/RegisterDoctor";
import RegisterPathologist from "./pages/auth/RegisterPathologist";

import PatientDashboard from "./pages/patient/PatientDashboard";
import MyHealthCard from "./pages/patient/MyHealthCard";
import FindDoctor from "./pages/patient/FindDoctor";
import MyAppointments from "./pages/patient/MyAppointments";
import MyPrescriptions from "./pages/patient/MyPrescriptions";
import MyLabReports from "./pages/patient/MyLabReports";
import MyBills from "./pages/patient/MyBills";
import AccessLog from "./pages/patient/AccessLog";
import PatientComingSoon from "./pages/patient/PatientComingSoon";
import PatientTimeline from "./pages/patient/PatientTimeline";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientLookup from "./pages/doctor/PatientLookup";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions";

import PathologistDashboard from "./pages/pathologist/PathologistDashboard";
import LabQueue from "./pages/pathologist/LabQueue";
import MyReports from "./pages/pathologist/MyReports";

import AdminDashboard from "./pages/admin/AdminDashboard";
import VerifyAccounts from "./pages/admin/VerifyAccounts";
import AuditLogs from "./pages/admin/AuditLogs";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ToastProvider>
            <AuthProvider>
              <NotificationProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<RegisterChoice />} />
                  <Route path="/register/patient" element={<RegisterPatient />} />
                  <Route path="/register/doctor" element={<RegisterDoctor />} />
                  <Route path="/register/pathologist" element={<RegisterPathologist />} />

                  {/* Patient */}
                  <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientDashboard /></ProtectedRoute>} />
                  <Route path="/patient/health-card" element={<ProtectedRoute allowedRoles={["PATIENT"]}><MyHealthCard /></ProtectedRoute>} />
                  <Route path="/patient/doctors" element={<ProtectedRoute allowedRoles={["PATIENT"]}><FindDoctor /></ProtectedRoute>} />
                  <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={["PATIENT"]}><MyAppointments /></ProtectedRoute>} />
                  <Route path="/patient/prescriptions" element={<ProtectedRoute allowedRoles={["PATIENT"]}><MyPrescriptions /></ProtectedRoute>} />
                  <Route path="/patient/lab-reports" element={<ProtectedRoute allowedRoles={["PATIENT"]}><MyLabReports /></ProtectedRoute>} />
                  <Route path="/patient/bills" element={<ProtectedRoute allowedRoles={["PATIENT"]}><MyBills /></ProtectedRoute>} />
                  <Route path="/patient/access-log" element={<ProtectedRoute allowedRoles={["PATIENT"]}><AccessLog /></ProtectedRoute>} />
                  <Route path="/patient/timeline" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientTimeline /></ProtectedRoute>} />
                  <Route path="/patient/vaccinations" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientComingSoon /></ProtectedRoute>} />
                  <Route path="/patient/allergies" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientComingSoon /></ProtectedRoute>} />
                  <Route path="/patient/analytics" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientComingSoon /></ProtectedRoute>} />
                  <Route path="/patient/emergency" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientComingSoon /></ProtectedRoute>} />
                  <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientComingSoon /></ProtectedRoute>} />

                  {/* Doctor */}
                  <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorDashboard /></ProtectedRoute>} />
                  <Route path="/doctor/lookup" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><PatientLookup /></ProtectedRoute>} />
                  <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorAppointments /></ProtectedRoute>} />
                  <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorPrescriptions /></ProtectedRoute>} />

                  {/* Pathologist */}
                  <Route path="/pathologist/dashboard" element={<ProtectedRoute allowedRoles={["PATHOLOGIST"]}><PathologistDashboard /></ProtectedRoute>} />
                  <Route path="/pathologist/queue" element={<ProtectedRoute allowedRoles={["PATHOLOGIST"]}><LabQueue /></ProtectedRoute>} />
                  <Route path="/pathologist/reports" element={<ProtectedRoute allowedRoles={["PATHOLOGIST"]}><MyReports /></ProtectedRoute>} />

                  {/* Admin */}
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/verify" element={<ProtectedRoute allowedRoles={["ADMIN"]}><VerifyAccounts /></ProtectedRoute>} />
                  <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AuditLogs /></ProtectedRoute>} />

                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </NotificationProvider>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
