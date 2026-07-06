export function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

export function validateEmail(value) {
  if (isEmpty(value)) return "Email is required";
  // simple email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value) ? null : "Enter a valid email address";
}

export function validatePassword(value, min = 8) {
  if (isEmpty(value)) return "Password is required";
  return value && value.length >= min ? null : `Password must be at least ${min} characters`;
}

export function validatePhone(value) {
  if (isEmpty(value)) return "Phone is required";
  const digits = String(value).replace(/[^0-9]/g, "");
  return digits.length >= 7 ? null : "Enter a valid phone number";
}

export function validateRequired(value, label = "This field") {
  return isEmpty(value) ? `${label} is required` : null;
}

export function validateDateOfBirth(value) {
  if (isEmpty(value)) return "Date of birth is required";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Enter a valid date";
  const now = new Date();
  if (d > now) return "Date of birth cannot be in the future";
  return null;
}

export function validateNumber(value, label = "This field") {
  if (isEmpty(value)) return null; // optional
  return isNaN(Number(value)) ? `${label} must be a number` : null;
}

export function validateLogin(form) {
  const errors = {};
  const e = validateEmail(form.email);
  if (e) errors.email = e;
  const p = validatePassword(form.password);
  if (p) errors.password = p;
  return errors;
}

export function validatePatient(form) {
  const errors = {};
  if (validateRequired(form.fullName, "Full name")) errors.fullName = validateRequired(form.fullName, "Full name");
  const e = validateEmail(form.email); if (e) errors.email = e;
  const p = validatePassword(form.password); if (p) errors.password = p;
  const ph = validatePhone(form.phone); if (ph) errors.phone = ph;
  const dob = validateDateOfBirth(form.dateOfBirth); if (dob) errors.dateOfBirth = dob;
  if (validateRequired(form.gender, "Gender")) errors.gender = validateRequired(form.gender, "Gender");
  return errors;
}

export function validateDoctor(form) {
  const errors = {};
  if (validateRequired(form.fullName, "Full name")) errors.fullName = validateRequired(form.fullName, "Full name");
  const e = validateEmail(form.email); if (e) errors.email = e;
  const p = validatePassword(form.password); if (p) errors.password = p;
  const ph = validatePhone(form.phone); if (ph) errors.phone = ph;
  if (validateRequired(form.medicalLicenseNumber, "Medical license number")) errors.medicalLicenseNumber = validateRequired(form.medicalLicenseNumber, "Medical license number");
  if (validateRequired(form.specialization, "Specialization")) errors.specialization = validateRequired(form.specialization, "Specialization");
  const num = validateNumber(form.experienceYears, "Years of experience"); if (num) errors.experienceYears = num;
  return errors;
}

export function validatePathologist(form) {
  const errors = {};
  if (validateRequired(form.fullName, "Full name")) errors.fullName = validateRequired(form.fullName, "Full name");
  const e = validateEmail(form.email); if (e) errors.email = e;
  const p = validatePassword(form.password); if (p) errors.password = p;
  const ph = validatePhone(form.phone); if (ph) errors.phone = ph;
  if (validateRequired(form.labLicenseNumber, "Lab license number")) errors.labLicenseNumber = validateRequired(form.labLicenseNumber, "Lab license number");
  return errors;
}

export function validateFile(file, accept = ".pdf,.jpg,.jpeg,.png", maxSizeMB = 10) {
  if (!file) return null;
  const ext = file.name.split('.').pop().toLowerCase();
  const acceptedExts = accept.split(',').map(ext => ext.trim().replace('.', '').toLowerCase());
  
  if (!acceptedExts.includes(ext)) {
    return `File must be one of: ${accept}`;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File must be less than ${maxSizeMB}MB`;
  }
  return null;
}

export function validateUploadReport(findings, file) {
  const errors = {};
  if (validateRequired(findings, "Findings")) errors.findings = validateRequired(findings, "Findings");
  if (file) {
    const fError = validateFile(file);
    if (fError) errors.file = fError;
  }
  return errors;
}

export function validatePrescription(diagnosis, items) {
  const errors = {};
  if (validateRequired(diagnosis, "Diagnosis")) errors.diagnosis = validateRequired(diagnosis, "Diagnosis");
  
  if (!items || items.length === 0) {
    errors.items = "At least one medicine must be prescribed";
  } else {
    for (let i = 0; i < items.length; i++) {
      if (validateRequired(items[i].medicineName, "Medicine name")) {
        errors[`item_${i}_medicineName`] = "Medicine name is required";
      }
    }
  }
  return errors;
}

export function validateLabTestRequest(testName) {
  const errors = {};
  if (validateRequired(testName, "Test name")) errors.testName = validateRequired(testName, "Test name");
  return errors;
}

export function validateBill(description, amount) {
  const errors = {};
  if (validateRequired(description, "Description")) errors.description = validateRequired(description, "Description");
  
  const numError = validateNumber(amount, "Amount");
  if (numError) {
    errors.amount = numError;
  } else if (Number(amount) <= 0) {
    errors.amount = "Amount must be greater than zero";
  }
  return errors;
}

export function validatePatientLookup(healthCardNumber, healthCardId) {
  const errors = {};
  if (validateRequired(healthCardNumber, "Health card number")) errors.healthCardNumber = validateRequired(healthCardNumber, "Health card number");
  if (validateRequired(healthCardId, "Health card ID")) errors.healthCardId = validateRequired(healthCardId, "Health card ID");
  return errors;
}

export default {
  validateLogin,
  validatePatient,
  validateDoctor,
  validatePathologist,
  validateFile,
  validateUploadReport,
  validatePrescription,
  validateLabTestRequest,
  validateBill,
  validatePatientLookup,
};
