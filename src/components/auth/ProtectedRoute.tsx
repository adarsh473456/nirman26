"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-sm">Checking session...</div>;
  if (!user) {
    return <div className="p-8"><a className="underline" href="/auth/login">Sign in to continue</a></div>;
  }
  return <>{children}</>;
}
