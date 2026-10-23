import type { Supplier } from "./index";

export interface SupplierSearchRequest {
  query?: string;
  category?: string | null;
  location?: string | null;
  verified_only?: boolean;
  use_ai?: boolean;
}

export interface SupplierSearchResult extends Supplier {
  matchScore?: number;
}
