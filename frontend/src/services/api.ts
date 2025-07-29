import axios from "axios";

export const api = axios.create({
  baseURL: "https://notes-app-x9br.onrender.com/api",
  withCredentials: true, // 🔐 to send cookies
});

// Attach token to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 errors and try refreshing
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post("https://notes-app-x9br.onrender.com/api/auth/refresh-token", {}, { withCredentials: true });
        const newToken = res.data.token;
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // retry original request
      } catch (err) {
        console.error("Refresh token expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
export default api;
