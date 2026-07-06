// helpers/auth.js - Shared auth helper for all tests

/**
 * Injects user auth into localStorage and mocks all backend calls.
 * @param {Page} page
 * @param {string} role - e.g. 'Doctor', 'Patient', 'Chemist', 'Pathologist', 'Admin'
 * @param {string} [healthCardNo]
 */
export async function injectAuth(page, role, healthCardNo = 'TEST001') {
  // Mock all backend API calls globally
  await page.route('http://localhost:8081/**', async route => {
    const url = route.request().url();
    const method = route.request().method();

    // Auth
    if (url.includes('/auth/login'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'mock-jwt-token', role: `ROLE_${role}`, healthCardNo, district: 'Pune' }) });

    // Admin stats
    if (url.includes('/admin/stats'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ totalRegistered: 42, doctors: 10, chemists: 5, patients: 25, teamMembers: 2, openFeedback: 3, resolvedFeedback: 7 }) });

    // Medical history
    if (url.includes('/chc/getPatientMedicalHistory'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ patientEntity: { firstName: 'Test', lastName: 'User', healthCardNo, dob: '2000-01-01', gender: 'Male', bloodGroup: 'O+', age: 24, weight: 70, bloodPressure: '120/80' }, medicalRecordResponseDTOList: [] }) });

    // Lab reports
    if (url.includes('/lab/patient/'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });

    if (url.includes('/lab/downloadReport/'))
      return route.fulfill({ status: 200, contentType: 'application/pdf', body: '' });

    // Medical imaging
    if (url.includes('/medical-imaging/patient/'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 1, title: 'Chest X-Ray', imagingType: 'X-Ray', uploadedAt: '2024-01-15T10:00:00Z', hospitalName: 'City Hospital', description: 'Routine' }]) });

    // Feedback
    if (url.includes('/feedback/my') || url.includes('/feedback/doctor'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    if (url.includes('/feedback/submit') && method === 'POST')
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ msg: 'Feedback submitted successfully' }) });

    // AI Chat
    if (url.includes('/api/chat/history'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    if (url.includes('/api/chat') && method === 'POST')
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ reply: 'I am your AI Health Assistant.' }) });

    // Verify prescription / search
    if (url.includes('/chc/search-users'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });

    // User profile
    if (url.includes('/user/getDoctorRegNo'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: '"DR001"' });

    // Upload report
    if (url.includes('/lab/uploadReport') || url.includes('/medical-imaging/upload'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 99, msg: 'Uploaded' }) });

    // Admin panel - users list
    if (url.includes('/admin/users') || url.includes('/admin/all-users'))
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });

    // Default: return empty OK
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  // Navigate to login to set localStorage context
  await page.goto('http://localhost:5173/login');
  await page.evaluate(({ role, healthCardNo }) => {
    localStorage.setItem('chc_token', 'mock-jwt-token');
    localStorage.setItem('chc_user', JSON.stringify({
      userName: `test${role.toLowerCase()}`,
      role: role,
      healthCardNo,
      district: 'Pune'
    }));
  }, { role, healthCardNo });
}
