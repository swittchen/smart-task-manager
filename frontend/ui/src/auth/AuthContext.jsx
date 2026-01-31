import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthed = !!token;

  async function refreshMe() {
    if (!token) {
      setMe(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/me");
      // твой backend сейчас возвращает "Hello email". Сохраним как текст.
      setMe({ raw: typeof res.data === "string" ? res.data : JSON.stringify(res.data) });
    } catch {
      localStorage.removeItem("accessToken");
      setToken(null);
      setMe(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refreshMe(); }, [token]);

  const value = useMemo(() => ({
    token,
    me,
    loading,
    isAuthed,
    setToken: (t) => {
      if (t) localStorage.setItem("accessToken", t);
      else localStorage.removeItem("accessToken");
      setToken(t);
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      setToken(null);
      setMe(null);
    },
  }), [token, me, loading, isAuthed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
