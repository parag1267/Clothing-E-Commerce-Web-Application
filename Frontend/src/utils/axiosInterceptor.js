import axiosInstance from "./axiosInstance";

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry =true;

            try {
                await axiosInstance.get("/auth/refresh");
                return axiosInstance(originalRequest);
            } catch (error) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);
export default axiosInstance;