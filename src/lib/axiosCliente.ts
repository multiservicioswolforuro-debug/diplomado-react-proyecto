import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://taskdone-node.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR PARA ENVIAR TOKEN
axiosClient.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;

  }

  return config;
});