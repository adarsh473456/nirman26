"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRfqs } from "@/hooks/useRfqs";
import { RfqList } from "@/components/rfq/RfqList";

export default function RfqsPage(){const {user,loading:authLoading}=useAuth();const mode=user?.role==="supplier"?"supplier":"buyer";const {rfqs,loading,error}=useRfqs(mode);if(authLoading)return <main className="p-8">Loading...</main>;return <main className="mx-auto max-w-6xl px-4 py-8"><h1 className="text-2xl font-black">RFQs</h1><p className="mb-6 text-sm text-navy-500">{mode==="supplier"?"RFQs received by your supplier profile.":"RFQs submitted by your buyer account."}</p>{loading?<p>Loading...</p>:error?<p className="text-red-600">{error}</p>:<RfqList rfqs={rfqs}/>}</main>}
