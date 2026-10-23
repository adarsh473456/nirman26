import type { RFQ } from "@/types";

export function RfqList({ rfqs }: { rfqs: RFQ[] }) {
  if (!rfqs.length) return <div className="rounded-xl border bg-white p-6 text-sm text-navy-500">No RFQs yet.</div>;
  return <div className="space-y-3">{rfqs.map((rfq) => <article key={rfq.id} className="rounded-xl border bg-white p-4">
    <div className="flex items-start justify-between gap-4"><div><h3 className="font-bold text-navy-950">{rfq.title}</h3><p className="text-xs text-navy-500">{rfq.supplierName}</p></div><span className="rounded-full border px-2 py-1 text-[11px] font-semibold">{rfq.status}</span></div>
    <p className="mt-3 text-xs text-navy-600">Qty: {rfq.quantity} · Material: {rfq.material || "Not specified"}</p>
    <p className="mt-1 text-xs text-navy-500">Submitted {new Date(rfq.createdAt).toLocaleDateString()}</p>
  </article>)}</div>;
}
