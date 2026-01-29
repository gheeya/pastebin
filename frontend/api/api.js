import axios from "axios";

const api = axios.create({
  baseURL: "https://pastebin-backend-umber.vercel.app/api",
});

export default api;
