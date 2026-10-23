import type { Supplier } from "./index";

export type { Supplier };

export interface SupplierPayload {
  company_name: string;
  tagline?: string;
  overview?: string;
  category: string;
  subcategories?: string[];
  capabilities?: string[];
  materials?: string[];
  certifications?: unknown[];
  machinery?: unknown[];
  images?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  gst_number?: string;
  registered_legal_name?: string;
  employee_count?: string;
  established_year?: number;
  moq?: number;
  avg_lead_time_days?: number;
}
