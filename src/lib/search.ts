import { api } from "./api";
import type { SupplierSearchRequest, SupplierSearchResult } from "@/types/search";

export const searchSuppliers = (payload: SupplierSearchRequest) =>
  api.search(payload) as Promise<SupplierSearchResult[]>;
