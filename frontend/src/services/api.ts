import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.3.12:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
