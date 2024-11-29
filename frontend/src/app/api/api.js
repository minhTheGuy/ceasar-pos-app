import axios from "axios";
axios.defaults.withCredentials = true;

const api = axios.create({
  // baseURL: "http://localhost:8080/api/v1/",
  baseURL: "https://caesarpos-api.vercel.app/api/v1",
});

export { api };
