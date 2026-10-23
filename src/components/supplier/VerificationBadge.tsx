export function VerificationBadge({ status, verified }: { status?: string; verified?: boolean }) {
  const label = verified ? "Verified Supplier" : status === "rejected" ? "Verification Rejected" : "Verification Pending";
  const cls = verified ? "bg-emerald-50 text-emerald-700 border-emerald-200" : status === "rejected" ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200";
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${cls}`}>{label}</span>;
}
