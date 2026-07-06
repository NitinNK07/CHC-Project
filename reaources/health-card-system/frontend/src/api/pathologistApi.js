import axiosClient from "./axiosClient";

export const pathologistApi = {
  getMe: () => axiosClient.get("/api/pathologists/me"),
  getQueue: () => axiosClient.get("/api/pathologists/lab-tests/queue"),
  claim: (id) => axiosClient.post(`/api/pathologists/lab-tests/${id}/claim`),
  getMyTests: () => axiosClient.get("/api/pathologists/lab-tests"),
  uploadReport: (id, formData) =>
    axiosClient.post(`/api/pathologists/lab-tests/${id}/report`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMyReports: () => axiosClient.get("/api/pathologists/reports"),
  createBill: (params) => axiosClient.post("/api/pathologists/bills", null, { params }),
  getMyBills: () => axiosClient.get("/api/pathologists/bills"),
  getNotifications: () => axiosClient.get("/api/pathologists/notifications"),
  markNotificationRead: (id) => axiosClient.patch(`/api/pathologists/notifications/${id}/read`),
};
