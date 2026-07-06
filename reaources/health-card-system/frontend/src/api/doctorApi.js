import axiosClient from "./axiosClient";

export const doctorApi = {
  getMe: () => axiosClient.get("/api/doctors/me"),
  lookupPatient: (data) => axiosClient.post("/api/doctors/patients/lookup", data),
  createPrescription: (data) => axiosClient.post("/api/doctors/prescriptions", data),
  getMyPrescriptions: () => axiosClient.get("/api/doctors/prescriptions"),
  requestLabTest: (data) => axiosClient.post("/api/doctors/lab-tests", data),
  getMyLabTests: () => axiosClient.get("/api/doctors/lab-tests"),
  createBill: (data) => axiosClient.post("/api/doctors/bills", data),
  getMyBills: () => axiosClient.get("/api/doctors/bills"),
  getMyAppointments: () => axiosClient.get("/api/doctors/appointments"),
  updateAppointmentStatus: (id, data) => axiosClient.patch(`/api/doctors/appointments/${id}/status`, data),
  getNotifications: () => axiosClient.get("/api/doctors/notifications"),
  markNotificationRead: (id) => axiosClient.patch(`/api/doctors/notifications/${id}/read`),
};
