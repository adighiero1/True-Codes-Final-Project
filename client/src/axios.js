import axios from "axios";

export const makeRequest = axios.create({
  // creating function to make requests
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});
