import axiosClient from "./axiosClient";

export const authApi = {
  registerPatient: (data) => axiosClient.post("/api/auth/register/patient", data),
  registerDoctor: (data) => axiosClient.post("/api/auth/register/doctor", data),
  registerPathologist: (data) => axiosClient.post("/api/auth/register/pathologist", data),
  login: (data) => axiosClient.post("/api/auth/login", data),
};
