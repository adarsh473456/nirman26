"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function SupplierImageUpload({ supplierId, onUploaded }: { supplierId: string; onUploaded?: (uri: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function upload(file: File) { setBusy(true); try { const r = await api.uploadSupplierFile(supplierId, "images", file); onUploaded?.(r.uri); } finally { setBusy(false); } }
  return <label className="block rounded-xl border border-dashed p-4 text-xs"><span className="font-bold">Supplier photo</span><input disabled={busy} className="mt-2 block w-full" type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0]; if(f) void upload(f);}} /></label>;
}
