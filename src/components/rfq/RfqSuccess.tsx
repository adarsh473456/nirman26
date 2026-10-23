export function RfqSuccess({ rfqId }: { rfqId: string }) {
  return <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">RFQ submitted successfully. Reference: <strong>{rfqId}</strong></div>;
}
