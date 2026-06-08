import axios from "axios";
import Cookies from "js-cookie";
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@sme-mall/shared";

const COOKIE_NAME = "sme_token";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 8000, // fail fast — don't hang the page if API is slow
});

// Attach JWT from cookie on every request
api.interceptors.request.use((config) => {
  const token = Cookies.get(COOKIE_NAME);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token — Next.js router.push handles redirect
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove(COOKIE_NAME);
    }
    return Promise.reject(error);
  }
);

export const TOKEN_COOKIE = COOKIE_NAME;

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register", data),

  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", data),

  me: () => api.get<ApiResponse<User>>("/auth/me"),
};

export default api;
