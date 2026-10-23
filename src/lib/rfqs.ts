import { api } from "./api";
import type { RFQ } from "@/types";
import type { RFQPayload } from "@/types/rfq";

export const createRfq = (payload: RFQPayload) => api.createRfq(payload) as Promise<RFQ>;
export const getBuyerRfqs = () => api.buyerRfqs() as Promise<RFQ[]>;
export const getSupplierRfqs = () => api.supplierRfqs() as Promise<RFQ[]>;
