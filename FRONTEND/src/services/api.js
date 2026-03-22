import axios from "axios";

export const api = axios.create({
  baseURL: "https://apppedidos-production-f088.up.railway.app/api/",
});

export default api;
