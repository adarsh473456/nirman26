"use client";

import { SupplierProfileForm } from "@/components/supplier/SupplierProfileForm";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function SupplierEditPage(){const {mySupplier,loading,saveMine}=useSuppliers();if(loading)return <main className="p-8">Loading...</main>;return <main className="mx-auto max-w-4xl px-4 py-8"><SupplierProfileForm supplier={mySupplier} onSave={saveMine}/></main>}
