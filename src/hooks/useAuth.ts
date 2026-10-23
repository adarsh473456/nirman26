"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AuthUser } from "@/types/auth";
import type { UserRole } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await api.me()) as AuthUser;
      setUser(data);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : "Unable to load user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const setRole = useCallback(async (role: Exclude<UserRole, "admin">) => {
    const data = (await api.setMyRole(role)) as AuthUser;
    setUser(data);
    return data;
  }, []);

  return { user, loading, error, refresh, setRole };
}
