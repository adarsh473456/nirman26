import { api } from "./api";
import type { Supplier } from "@/types";
import type { SupplierPayload } from "@/types/supplier";

export const getSuppliers = () => api.suppliers() as Promise<Supplier[]>;
export const getSupplier = (id: string) => api.supplier(id) as Promise<Supplier>;
export const getMySupplier = () => api.mySupplier() as Promise<Supplier | null>;
export const createSupplier = (payload: SupplierPayload) => api.createSupplier(payload) as Promise<Supplier>;
export const updateSupplier = (id: string, payload: SupplierPayload) => api.updateSupplier(id, payload) as Promise<Supplier>;
