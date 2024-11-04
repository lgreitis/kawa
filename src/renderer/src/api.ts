import axios, { isAxiosError } from "axios";
import { getCurrentUser, useUserStore } from "./store/userStore";
import { refreshMalToken } from "./services/mal/malServices";

const createAxiosInstance = () => {
  const instance = axios.create();

  instance.interceptors.request.use(
    (config) => {
      const user = getCurrentUser();

      if (user) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error as Error);
    },
  );

  instance.interceptors.response.use(
    (response) => response, // Directly return successful responses.
    async (error) => {
      if (!isAxiosError(error)) {
        return;
      }

      const originalRequest = error.config;

      // @ts-expect-error -- TS doesn't know about the _retry property we're adding to the request.
      if (error.response?.status === 401 && !originalRequest._retry) {
        // @ts-expect-error -- TS doesn't know about the _retry property we're adding to the request.
        originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

        try {
          const user = getCurrentUser();

          if (!user?.refreshToken || !originalRequest) {
            return Promise.reject(error);
          }

          const response = await refreshMalToken(user.refreshToken);
          const { access_token, refresh_token: newRefreshToken } = response;

          useUserStore.getState().updateUserToken(user.id, access_token, newRefreshToken);

          instance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          return Promise.reject(refreshError as Error);
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const malAuthenticatedApi = createAxiosInstance();
