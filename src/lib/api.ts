async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" &&
    init.body instanceof FormData;

  const response = await fetch(
    `/api/backend${path}`,
    {
      ...init,
      headers: {
        ...(!isFormData && init.body
          ? {
            "Content-Type":
              "application/json",
          }
          : {}),
        ...(init.headers || {}),
      },
      cache: "no-store",
    }
  );

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  const payload =
    contentType.includes(
      "application/json"
    )
      ? await response
        .json()
        .catch(() => null)
      : await response
        .text()
        .catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
        payload &&
        "detail" in payload
        ? String(
          (
            payload as {
              detail?: unknown;
            }
          ).detail ||
          "Request failed"
        )
        : typeof payload ===
          "string" &&
          payload
          ? payload
          : "Request failed";

    throw new Error(
      message
    );
  }

  return payload as T;
}


export interface AdminRecentBuyerActivity {
  id: string;
  buyer_name: string;
  buyer_company: string;
  activity: string;
  rfq_title: string;
  status: string;
  created_at: string | null;
}


export interface AdminAnalytics {
  total_buyers: number;
  total_suppliers: number;
  verified_suppliers: number;
  pending_suppliers: number;
  total_rfqs: number;
  quoted_rfqs: number;
  accepted_rfqs: number;
  match_rate: number;

  recent_buyer_activity:
  AdminRecentBuyerActivity[];
}


/*
 * Supplier Discovery Search request.
 *
 * This matches the FastAPI
 * SearchRequest schema.
 */
export interface SupplierSearchRequest {
  query: string;

  category:
  | string
  | null;

  location:
  | string
  | null;

  materials: string[];

  certifications: string[];

  verified_only: boolean;

  use_ai: boolean;

  min_moq?: number | null;
  max_moq?: number | null;
  max_lead_time_days?: number | null;
  employee_count?: string | null;
  capabilities?: string[];
  latitude?: number | null;
  longitude?: number | null;
  radius_km?: number | null;
}


export const api = {
  me: () =>
    request<any>(
      "/users/me"
    ),


  setMyRole: (
    role:
      | "buyer"
      | "supplier"
  ) =>
    request<any>(
      "/users/me/role",
      {
        method: "PATCH",

        body: JSON.stringify({
          role,
        }),
      }
    ),


  /*
   * Real PostgreSQL-backed
   * Admin platform analytics.
   *
   * Admin only.
   */
  adminAnalytics: () =>
    request<AdminAnalytics>(
      "/users/admin/analytics"
    ),


  suppliers: () =>
    request<any[]>(
      "/suppliers"
    ),


  supplier: (
    id: string
  ) =>
    request<any>(
      `/suppliers/${id}`
    ),


  mySupplier: () =>
    request<any | null>(
      "/suppliers/mine"
    ),


  createSupplier: (
    body: unknown
  ) =>
    request<any>(
      "/suppliers",
      {
        method: "POST",

        body:
          JSON.stringify(
            body
          ),
      }
    ),


  updateSupplier: (
    id: string,
    body: unknown
  ) =>
    request<any>(
      `/suppliers/${id}`,
      {
        method: "PUT",

        body:
          JSON.stringify(
            body
          ),
      }
    ),


  /*
   * REAL SUPPLIER DISCOVERY SEARCH
   *
   * Supports:
   * - keyword search
   * - category
   * - location
   * - materials
   * - certifications
   * - verified-only
   * - AI natural-language search
   */
  search: (
    body:
      SupplierSearchRequest
  ) =>
    request<any[]>(
      "/search",
      {
        method: "POST",

        body:
          JSON.stringify(
            body
          ),
      }
    ),


  bookmarks: () =>
    request<any[]>(
      "/bookmarks"
    ),


  addBookmark: (
    supplierId: string
  ) =>
    request<any>(
      `/bookmarks/${supplierId}`,
      {
        method: "POST",
      }
    ),


  removeBookmark: (
    supplierId: string
  ) =>
    request<any>(
      `/bookmarks/${supplierId}`,
      {
        method: "DELETE",
      }
    ),


  createRfq: (
    body: unknown
  ) =>
    request<any>(
      "/rfqs",
      {
        method: "POST",

        body:
          JSON.stringify(
            body
          ),
      }
    ),


  /*
   * Real RFQs belonging to the
   * currently authenticated Buyer.
   */
  buyerRfqs: () =>
    request<any[]>(
      "/rfqs/buyer"
    ),


  /*
   * Real incoming RFQs belonging
   * to the authenticated Supplier.
   */
  supplierRfqs: () =>
    request<any[]>(
      "/rfqs/supplier"
    ),


  /*
   * Real platform-wide RFQs.
   *
   * Admin only.
   */
  adminRfqs: () =>
    request<any[]>(
      "/rfqs/admin"
    ),


  /*
   * Supplier submits a quotation
   * for a real RFQ.
   */
  submitRfqQuote: (
    rfqId: string,

    body: {
      unit_price: number;

      currency: string;

      tooling_cost: number;

      estimated_lead_days:
      number;

      notes: string;

      valid_until: string;
    }
  ) =>
    request<any>(
      `/rfqs/${rfqId}/quote`,
      {
        method: "POST",

        body:
          JSON.stringify(
            body
          ),
      }
    ),


  /*
   * Buyer accepts a Supplier
   * quotation.
   *
   * Backend also creates the
   * persistent Order.
   */
  acceptRfqQuote: (
    rfqId: string
  ) =>
    request<any>(
      `/rfqs/${rfqId}/accept`,
      {
        method: "POST",
      }
    ),


  /*
   * Real Orders belonging to
   * the currently logged-in Buyer.
   */
  buyerOrders: () =>
    request<any[]>(
      "/orders/buyer"
    ),


  /*
   * Real Orders assigned to
   * the currently logged-in
   * Supplier profile.
   */
  supplierOrders: () =>
    request<any[]>(
      "/orders/supplier"
    ),


  /*
   * Supplier profiles currently
   * waiting for Admin verification.
   */
  pendingVerifications: () =>
    request<any[]>(
      "/verification/pending"
    ),


  /*
   * Admin approves/rejects or
   * revokes Supplier verification.
   */
  reviewVerification: (
    supplierId: string,
    approved: boolean,
    notes = ""
  ) =>
    request<any>(
      `/verification/${supplierId}`,
      {
        method: "PATCH",

        body:
          JSON.stringify({
            approved,
            notes,
          }),
      }
    ),


  /*
   * Upload Supplier images or
   * certification documents.
   */
  uploadSupplierFile:
    async (
      supplierId: string,

      folder:
        | "images"
        | "certifications",

      file: File
    ) => {
      const data =
        new FormData();

      data.append(
        "file",
        file
      );

      return request<{
        uri: string;
      }>(
        `/uploads/supplier/${supplierId}/${folder}`,
        {
          method: "POST",
          body: data,
        }
      );
    },


  // V1 completion features
  bulkRfq: (body: unknown) =>
    request<any>("/v1/rfqs/bulk", { method: "POST", body: JSON.stringify(body) }),

  quoteComparison: () =>
    request<any[]>("/v1/rfqs/quote-comparison"),

  buyerAnalytics: () =>
    request<any>("/v1/buyer/analytics"),

  supplierAnalytics: () =>
    request<any>("/v1/supplier/analytics"),

  savedSearches: () =>
    request<any[]>("/v1/saved-searches"),

  saveSearch: (body: unknown) =>
    request<any>("/v1/saved-searches", { method: "POST", body: JSON.stringify(body) }),

  deleteSavedSearch: (id: string) =>
    request<any>(`/v1/saved-searches/${id}`, { method: "DELETE" }),

  rfqTemplates: () =>
    request<any[]>("/v1/rfq-templates"),

  createRfqTemplate: (body: unknown) =>
    request<any>("/v1/rfq-templates", { method: "POST", body: JSON.stringify(body) }),

  createReview: (body: { order_id: string; rating: number; comment?: string }) =>
    request<any>("/v1/reviews", { method: "POST", body: JSON.stringify(body) }),

  supplierReviews: (supplierId: string) =>
    request<any>(`/v1/suppliers/${supplierId}/reviews`),

  recordSupplierView: (supplierId: string) =>
    request<any>(`/v1/suppliers/${supplierId}/view`, { method: "POST" }),

  extractCapabilities: (text: string) =>
    request<any>("/v1/ai/extract-capabilities", { method: "POST", body: JSON.stringify({ text }) }),

  exportReadiness: (body: unknown) =>
    request<any>("/v1/export-readiness", { method: "POST", body: JSON.stringify(body) }),
};