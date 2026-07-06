import axiosClient from "./axiosClient";

export const adminApi = {
  getPendingDoctors: () => axiosClient.get("/api/admin/doctors/pending"),
  getPendingPathologists: () => axiosClient.get("/api/admin/pathologists/pending"),
  verifyDoctor: (accountId, verified) => axiosClient.patch("/api/admin/doctors/verify", { accountId, verified }),
  verifyPathologist: (accountId, verified) => axiosClient.patch("/api/admin/pathologists/verify", { accountId, verified }),
  getDashboardStats: () => axiosClient.get("/api/admin/dashboard-stats"),
  getAuditLogs: () => axiosClient.get("/api/admin/audit-logs"),
};
