"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import type { User, AuthResponse, LoginRequest, RegisterRequest } from "@sme-mall/shared";
import { authApi, TOKEN_COOKIE } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Why cookies instead of localStorage?
 * Next.js middleware runs on the server/edge — it can read cookies on every
 * request but cannot access localStorage (that only exists in the browser).
 * By storing the JWT in a cookie, our middleware can protect routes before
 * the page even renders — no redirect flicker.
 */
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,        // 7 days, matches JWT expiry
  sameSite: "lax",   // CSRF protection
  secure: process.env.NODE_ENV === "production",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthResponse = (data: AuthResponse): User => {
    Cookies.set(TOKEN_COOKIE, data.token, COOKIE_OPTIONS);
    setUser(data.user);
    return data.user;
  };

  // On mount: if a token cookie exists, hydrate the user from the API.
  // We resolve immediately (isLoading = false) after a short race so public
  // pages never wait for the network — only protected routes need the user.
  useEffect(() => {
    const token = Cookies.get(TOKEN_COOKIE);
    if (!token) {
      setIsLoading(false);
      return;
    }
    const timeout = setTimeout(() => setIsLoading(false), 800); // max wait
    authApi
      .me()
      .then((res) => setUser(res.data.data ?? null))
      .catch(() => Cookies.remove(TOKEN_COOKIE))
      .finally(() => {
        clearTimeout(timeout);
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authApi.login(data);
    return handleAuthResponse(res.data.data!);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await authApi.register(data);
    handleAuthResponse(res.data.data!);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_COOKIE);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
