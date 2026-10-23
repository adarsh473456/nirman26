import type { UserRole } from "./index";

export interface AuthUser {
  id: string;
  auth0_id: string;
  email: string;
  name: string;
  company: string;
  role: UserRole;
}
