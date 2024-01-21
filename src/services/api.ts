import axios from "axios";
import { getSession } from "next-auth/react";

const ApiClient = () => {
  const instance = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });
  instance.interceptors.request.use(async (request) => {
    const session = await getSession();

    if (session) {
      request.headers.Authorization = `Bearer ${session.token}`;
    }

    return request;
  });

  return instance;
};

export default ApiClient();
