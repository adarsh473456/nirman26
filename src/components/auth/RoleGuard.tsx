"use client";

import type { ReactNode } from "react";
import type { UserRole } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export function RoleGuard({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-sm">Checking access...</div>;
  if (!user) return <div className="p-8">Please sign in.</div>;
  if (!roles.includes(user.role)) return <div className="p-8">You do not have access to this page.</div>;
  return <>{children}</>;
}
