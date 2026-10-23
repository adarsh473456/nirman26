"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupplier } from "@/lib/suppliers";
import type { Supplier } from "@/types";
import { VerificationBadge } from "@/components/supplier/VerificationBadge";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { RfqForm } from "@/components/rfq/RfqForm";

export default function SupplierProfilePage(){const params=useSearchParams();const id=params.get("id");const [supplier,setSupplier]=useState<Supplier|null>(null);const [error,setError]=useState<string|null>(null);useEffect(()=>{if(!id)return;getSupplier(id).then(setSupplier).catch(e=>setError(e instanceof Error?e.message:"Unable to load supplier"));},[id]);if(!id)return <main className="p-8">Supplier id is missing.</main>;if(error)return <main className="p-8 text-red-600">{error}</main>;if(!supplier)return <main className="p-8">Loading...</main>;return <main className="mx-auto max-w-6xl space-y-6 px-4 py-8"><section className="rounded-2xl border bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-black">{supplier.name}</h1><p className="text-sm text-navy-500">{supplier.category} · {supplier.location.city}, {supplier.location.state}</p></div><div className="flex gap-2"><VerificationBadge verified={supplier.verified} status={supplier.verificationDetails.auditStatus}/><BookmarkButton supplierId={supplier.id}/></div></div><p className="mt-5 text-sm leading-6 text-navy-700">{supplier.overview}</p><div className="mt-5"><h2 className="text-sm font-bold">Materials</h2><p className="text-sm text-navy-600">{supplier.materials.join(", ") || "Not provided"}</p></div></section><RfqForm supplierId={supplier.id} supplierName={supplier.name}/></main>}
