import { api } from "./api";
import type { Supplier } from "@/types";

export const getBookmarks = () => api.bookmarks() as Promise<Supplier[]>;
export const addBookmark = (supplierId: string) => api.addBookmark(supplierId);
export const removeBookmark = (supplierId: string) => api.removeBookmark(supplierId);
