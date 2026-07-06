# Centralized Health Card System — Frontend

React 19 + Vite + Tailwind CSS. Talks to the Spring Boot backend over REST/JWT.

## Design language

The whole UI is built around one idea: **the health card itself is the
product**. Every dashboard, every doctor lookup screen, treats the card like
a real ID card — monospaced number, masked secret ID, a QR corner — on a
clinical navy/teal palette (`Ink Navy`, `Vital Teal`, `Paper White`, with
`Coral` for alerts and `Gold` for pending/verification states). Headings use
Space Grotesk, body text Inter, and card numbers/IDs use IBM Plex Mono so they
read like real printed credentials. See `tailwind.config.js` for the exact
tokens and `src/components/HealthCardVisual.jsx` for the signature component.

## Running it locally

```bash
npm install
cp .env.example .env      # point VITE_API_BASE_URL at your backend if not localhost:8080
npm run dev
```

Opens on `http://localhost:5173` by default. Make sure the backend's
`app.cors.allowed-origins` includes this URL (it does by default).

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

This project was built and **verified with `npm run build` in this sandbox**
— it compiles cleanly end-to-end. You still need a running backend for any
real data to load.

## Structure

```
src/
  api/            one file per backend module (authApi, patientApi, doctorApi, ...)
  context/        AuthContext (JWT session) and ToastContext (notifications)
  components/
    ui/           Button, Input, Card, Modal, Badge, Loader, StatCard, EmptyState...
    doctor/        WritePrescriptionModal, RequestLabTestModal, CreateBillModal
    pathologist/   UploadReportModal
    HealthCardVisual.jsx   the signature ID-card component
    DashboardLayout.jsx    sidebar + topbar shell, parameterized by role nav items
    AuthLayout.jsx         split-screen layout for login/register
  pages/
    auth/          Login, RegisterChoice, RegisterPatient/Doctor/Pathologist
    patient/       Dashboard, MyHealthCard, FindDoctor, Appointments, Prescriptions,
                   LabReports, Bills, AccessLog
    doctor/        Dashboard, PatientLookup (the core feature), Appointments, Prescriptions
    pathologist/   Dashboard, LabQueue (claim + upload), MyReports
    admin/         Dashboard, VerifyAccounts, AuditLogs
  utils/          formatting (dates/currency/status colors) and error-message extraction
```

## How the gated lookup works on the frontend

`pages/doctor/PatientLookup.jsx` is the centerpiece: the doctor types in a
health card number + health card ID, the form posts to
`POST /api/doctors/patients/lookup`, and only on success does the patient's
full bundle (profile, prescriptions, lab reports, appointments) render. The
same two values are kept in local state and silently re-sent by the
"Prescribe", "Lab test" and "Raise bill" modals, because the backend
re-verifies the card on every one of those writes too — the frontend never
assumes access just because a previous lookup succeeded.

## Notes

- Tailwind v3 is used (not v4) for broad compatibility with the existing ecosystem.
- No browser localStorage is used for anything except the JWT/user session —
  this is a real deployed app, not an in-chat artifact, so that's fine here.
- Lab report attachments are served by the backend at
  `/uploads/lab-reports/**`; the frontend just links to
  `${VITE_API_BASE_URL}${attachmentUrl}`.
