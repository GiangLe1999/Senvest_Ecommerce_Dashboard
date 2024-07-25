import axios from "axios";
import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

const baseURL =
  process.env.API_BASE_URL || "http://localhost:8000/api/v1/admins";

const axiosInstance = () => {
  const defaultOptions = {
    baseURL,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getServerSession(authOptions);

    if (session) {
      request.headers.Authorization = `Bearer ${session.backendTokens.accessToken}`;
    }

    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`error`, error);
    },
  );

  return instance;
};

export default axiosInstance();
