import type { RFQ } from "./index";

export type { RFQ };

export interface RFQPayload {
  supplier_id: string;
  title: string;
  category?: string;
  material?: string;
  quantity: number;
  target_unit_budget?: number;
  target_delivery_days?: number;
  specifications?: string;
  certifications_required?: string[];
  attachments?: Array<{ name: string; sizeKb?: number; type?: string; uri?: string }>;
}
