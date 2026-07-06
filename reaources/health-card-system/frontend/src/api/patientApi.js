import axiosClient from "./axiosClient";

export const patientApi = {
  getMe: () => axiosClient.get("/api/patients/me"),
  updateMe: (data) => axiosClient.put("/api/patients/me", data),
  browseDoctors: () => axiosClient.get("/api/patients/doctors"),
  bookAppointment: (data) => axiosClient.post("/api/patients/appointments", data),
  getMyAppointments: () => axiosClient.get("/api/patients/appointments"),
  getMyPrescriptions: () => axiosClient.get("/api/patients/prescriptions"),
  getMyLabReports: () => axiosClient.get("/api/patients/lab-reports"),
  getMyBills: () => axiosClient.get("/api/patients/bills"),
  payBill: (data) => axiosClient.post("/api/patients/bills/pay", data),
  getAccessLog: () => axiosClient.get("/api/patients/access-log"),
  getAuthorizedDoctors: () => axiosClient.get("/api/patients/authorized-doctors"),
  authorizeDoctor: (data) => axiosClient.post("/api/patients/authorized-doctors", data),
  revokeDoctor: (doctorId) => axiosClient.delete(`/api/patients/authorized-doctors/${doctorId}`),
  getNotifications: () => axiosClient.get("/api/patients/notifications"),
  markNotificationRead: (id) => axiosClient.patch(`/api/patients/notifications/${id}/read`),
};
