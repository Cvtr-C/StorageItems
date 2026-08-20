import axios from "axios";

const api = axios.create({
  baseURL: "http://:",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
