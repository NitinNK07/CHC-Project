# Centralized Health Card System

A full-stack health record platform for three roles — **Patient**,
**Doctor**, **Pathologist** — plus a lightweight **Admin** layer for
verifying medical/lab licenses. Built on **React + Vite** (frontend) and
**Spring Boot + MySQL** (backend).

## The one rule the whole system is built around

A doctor can only see a patient's medical record if they have **both**:

1. The patient's **health card number** (public, printed on the card / in its QR code), **and**
2. The patient's **health card ID** (secret, like a PIN — never printed, never in the QR code)

...and only if that doctor's medical license has been **verified by an
admin**. Every attempt is logged, and patients can see that log from their
own dashboard. See `backend/README.md` → "The access model" for the full
write-up, and `backend/src/main/java/com/healthcard/backend/service/PatientAccessService.java`
for the actual enforcement code.

## What's included

- **Auth**: JWT, BCrypt passwords, role-based route protection (Spring Security + React route guards)
- **Patient**: auto-issued health card with QR code, profile, browse/book/authorize doctors, prescriptions, lab reports, bills + mock payment, full access log
- **Doctor**: gated patient lookup, write prescriptions, request lab tests, raise bills, manage appointment requests
- **Pathologist**: open lab-test queue, claim requests, upload findings + file attachment
- **Admin**: verify doctor/pathologist licenses, platform-wide stats, full audit trail
- **Notifications**: in-app + email on every key event (prescription issued, report ready, bill raised, account verified...); SMS wired through a single pluggable method
- **Billing**: bill → pay → receipt flow with a mock settlement layer, ready to swap for Razorpay/Stripe

## Run it end to end

### 1. Backend
```bash
cd backend
# set DB_USERNAME / DB_PASSWORD / MAIL_USERNAME / MAIL_PASSWORD / JWT_SECRET as needed
mvn spring-boot:run
```
Runs on `http://localhost:8080`. Default admin: `admin@healthcard.system` / `Admin@123` — **change this immediately**.
Full details, including the access-control writeup, in `backend/README.md`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`. Details in `frontend/README.md`.

### 3. Try the flow
1. Register as a **Patient** → your health card + QR is issued instantly.
2. Register as a **Doctor** → you'll see "verification pending."
3. Log in as **admin** → Verify Accounts → approve the doctor.
4. As the patient, copy your health card number and health card ID from "My Health Card."
5. As the doctor, go to **Patient Lookup**, paste both values → record unlocks → write a prescription, request a lab test, or raise a bill.
6. As the patient, check **Access Log** — you'll see the doctor's lookup recorded.
7. Register as a **Pathologist**, get verified by admin, claim the lab test from the **Lab Queue**, and upload findings.

## A transparency note about this build

This project was generated and reviewed in a sandboxed environment without
access to Maven Central, so the **frontend was built and verified**
(`npm run build` completed cleanly) but the **backend could not be
compiled here** — there was no network path to download Spring Boot's Maven
dependencies. The backend code was written carefully against Spring Boot
3.3 / Spring Security 6 APIs and reviewed by hand for consistency across all
107 files, but please run `mvn clean install` yourself the first time to
catch anything a real compiler would catch before you rely on it.

## Folder layout

```
health-card-system/
  backend/    Spring Boot 3 API — see backend/README.md
  frontend/   React + Vite SPA  — see frontend/README.md
```
