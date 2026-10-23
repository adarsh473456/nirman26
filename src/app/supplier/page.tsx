"use client";

import { useSuppliers } from "@/hooks/useSuppliers";
import { VerificationBadge } from "@/components/supplier/VerificationBadge";

export default function SupplierHomePage(){const {mySupplier,loading}=useSuppliers();if(loading)return <main className="p-8">Loading...</main>;return <main className="mx-auto max-w-5xl px-4 py-8"><h1 className="text-2xl font-black">Supplier Workspace</h1>{mySupplier?<div className="mt-6 rounded-2xl border bg-white p-5"><div className="flex justify-between"><h2 className="text-lg font-bold">{mySupplier.name}</h2><VerificationBadge verified={mySupplier.verified} status={mySupplier.verificationDetails.auditStatus}/></div><p className="mt-2 text-sm text-navy-500">{mySupplier.overview}</p><a href="/supplier/edit" className="mt-4 inline-block text-sm font-bold underline">Edit profile</a></div>:<div className="mt-6 rounded-2xl border bg-white p-5"><p className="text-sm">You have not created a supplier profile yet.</p><a href="/supplier/edit" className="mt-3 inline-block font-bold underline">Create supplier profile</a></div>}</main>}
