'use client';

import React, { useState } from 'react';
import { Supplier, RFQ } from '../types';
import { AdminAnalytics } from '../lib/api';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
  suppliers: Supplier[];
  rfqs: RFQ[];
  analytics: AdminAnalytics | null;
  onSupplierUpdate: (
    supplierId: string,
    payload: unknown
  ) => Promise<unknown>;
  onVerificationDecision: (
    supplierId: string,
    approved: boolean
  ) => Promise<unknown>;
}

export function AdminDashboard({
  activeTab,
  suppliers,
  rfqs,
  analytics,
  onSupplierUpdate,
  onVerificationDecision,
}: AdminDashboardProps) {
  /*
   * Supplier counts primarily use the real
   * Admin analytics endpoint.
   *
   * The supplier-array calculation remains
   * as a safe fallback while analytics loads.
   */
  const verifiedCount =
    analytics?.verified_suppliers ??
    suppliers.filter(
      s => s.verified
    ).length;

  const pendingCount =
    analytics?.pending_suppliers ??
    (
      suppliers.length -
      suppliers.filter(
        s => s.verified
      ).length
    );

  /*
   * Real RFQ analytics.
   *
   * RFQ-array calculations remain only as
   * loading fallbacks.
   */
  const quotedCount =
    analytics?.quoted_rfqs ??
    rfqs.filter(
      r =>
        r.status === 'quoted' ||
        r.status === 'accepted'
    ).length;

  const totalRfqs =
    analytics?.total_rfqs ??
    rfqs.length;

  const matchRate =
    analytics?.match_rate ??
    (
      rfqs.length > 0
        ? Math.round(
          (
            rfqs.filter(
              r =>
                r.status === 'quoted' ||
                r.status === 'accepted'
            ).length /
            rfqs.length
          ) * 1000
        ) / 10
        : 0
    );

  const totalBuyers =
    analytics?.total_buyers ??
    0;

  const recentBuyerActivity =
    analytics?.recent_buyer_activity ??
    [];

  /*
   * Local state for inline editing
   * of Suppliers.
   */
  const [
    editingSupplierId,
    setEditingSupplierId
  ] = useState<string | null>(
    null
  );

  const [
    editForm,
    setEditForm
  ] = useState<
    Partial<Supplier>
  >({});

  const handleEditClick = (
    supplier: Supplier
  ) => {
    setEditingSupplierId(
      supplier.id
    );

    setEditForm(
      supplier
    );
  };

  const handleSaveEdit =
    async () => {
      if (
        !editingSupplierId
      ) {
        return;
      }

      const originalSupplier =
        suppliers.find(
          supplier =>
            supplier.id ===
            editingSupplierId
        );

      if (!originalSupplier) {
        return;
      }

      const editedSupplier = {
        ...originalSupplier,
        ...editForm,

        location: {
          ...originalSupplier.location,
          ...(editForm.location || {}),
        },

        verificationDetails: {
          ...originalSupplier
            .verificationDetails,

          ...(editForm
            .verificationDetails ||
            {}),
        },
      };

      const payload = {
        company_name:
          editedSupplier.name,

        tagline:
          editedSupplier.tagline ||
          '',

        overview:
          editedSupplier.overview ||
          '',

        category:
          editedSupplier.category,

        subcategories:
          editedSupplier
            .subcategories ||
          [],

        capabilities:
          editedSupplier
            .capabilities ||
          [],

        materials:
          editedSupplier.materials ||
          [],

        certifications:
          editedSupplier
            .certifications ||
          [],

        machinery:
          editedSupplier.machinery ||
          [],

        images:
          editedSupplier.images ||
          {},

        contact:
          editedSupplier.contact ||
          {},

        city:
          editedSupplier
            .location?.city ||
          '',

        state:
          editedSupplier
            .location?.state ||
          '',

        country:
          editedSupplier
            .location?.country ||
          'India',

        gst_number:
          editedSupplier
            .verificationDetails
            ?.gstNumber ||
          '',

        registered_legal_name:
          editedSupplier
            .verificationDetails
            ?.registeredLegalName ||
          editedSupplier.name,

        employee_count:
          editedSupplier
            .employeeCount ||
          '',

        established_year:
          editedSupplier
            .establishedYear ||
          new Date()
            .getFullYear(),

        moq:
          editedSupplier.moq ||
          1,

        avg_lead_time_days:
          editedSupplier
            .avgLeadTimeDays ||
          14,
      };

      try {
        await onSupplierUpdate(
          editingSupplierId,
          payload
        );

        setEditingSupplierId(
          null
        );
      } catch (error) {
        console.error(
          'Admin supplier update failed:',
          error
        );
      }
    };

  const handleVerificationClick =
    async (
      supplier: Supplier
    ) => {
      try {
        await onVerificationDecision(
          supplier.id,
          !supplier.verified
        );
      } catch (error) {
        console.error(
          'Supplier verification action failed:',
          error
        );
      }
    };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-navy-900 to-navy-950 rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-amber-900/40">

        <div>

          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-300 text-xs font-semibold mb-2">

            <ShieldAlert className="w-3.5 h-3.5" />

            <span>
              Platform Operations & Trust Audit Hub
            </span>

          </div>

          <h1 className="text-2xl font-extrabold">
            Admin Verification & Quality Control
          </h1>

          <p className="text-xs sm:text-sm text-navy-300 mt-1 max-w-2xl">
            Audit supplier registrations, enforce GST and ISO certification compliance, and issue authentic &quot;Verified Supplier Badges&quot;.
          </p>

        </div>

        <div className="flex items-center space-x-2 text-xs">

          <span className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold">
            {verifiedCount} Verified Live
          </span>

          <span className="px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-300 font-bold">
            {pendingCount} Pending Audit
          </span>

        </div>

      </div>

      {/* PLATFORM ANALYTICS TAB */}
      {activeTab ===
        'platform-analytics' && (
          <section className="space-y-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center space-x-2">

                <TrendingUp className="w-5 h-5 text-brand-600" />

                <h2 className="text-lg font-extrabold text-navy-950">
                  Total User Analysis & KPIs
                </h2>

              </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

              <div className="bg-white p-4 rounded-xl border border-navy-200 shadow-card">

                <span className="text-xs text-navy-500 font-medium block">
                  Total Verified Suppliers
                </span>

                <div className="flex items-baseline space-x-2 mt-1">

                  <span className="text-2xl font-extrabold text-navy-950">
                    {verifiedCount}
                  </span>

                  <span className="text-xs text-emerald-600 font-bold">
                    +{analytics?.total_suppliers ??
                      suppliers.length}{' '}
                    in catalog
                  </span>

                </div>

              </div>

              <div className="bg-white p-4 rounded-xl border border-navy-200 shadow-card">

                <span className="text-xs text-navy-500 font-medium block">
                  Total Buyers
                </span>

                <div className="flex items-baseline space-x-2 mt-1">

                  <span className="text-2xl font-extrabold text-brand-600">
                    {totalBuyers}
                  </span>

                  <span className="text-[10px] text-navy-400">
                    Active this week
                  </span>

                </div>

              </div>

              <div className="bg-white p-4 rounded-xl border border-navy-200 shadow-card">

                <span className="text-xs text-navy-500 font-medium block">
                  Global RFQ Volume
                </span>

                <div className="flex items-baseline space-x-2 mt-1">

                  <span className="text-2xl font-extrabold text-amber-600">
                    {totalRfqs}
                  </span>

                  <span className="text-xs text-navy-500 font-medium">
                    {quotedCount} Quoted
                  </span>

                </div>

              </div>

              <div className="bg-white p-4 rounded-xl border border-navy-200 shadow-card">

                <span className="text-xs text-navy-500 font-medium block">
                  Platform Match Rate
                </span>

                <div className="flex items-baseline space-x-2 mt-1">

                  <span className="text-2xl font-extrabold text-purple-600">
                    {matchRate}%
                  </span>

                </div>

              </div>

            </div>

            {/* Real Buyer Analysis List */}
            <div className="bg-white rounded-xl border border-navy-200 shadow-card p-5 mt-4">

              <h3 className="text-sm font-bold text-navy-900 mb-3">
                Recent Buyer Activity
              </h3>

              <div className="text-xs text-navy-600 space-y-2">

                {recentBuyerActivity.map(
                  (
                    activity,
                    index
                  ) => (
                    <div
                      key={
                        activity.id
                      }
                      className={
                        index <
                          recentBuyerActivity.length -
                          1
                          ? 'flex justify-between border-b pb-2'
                          : 'flex justify-between'
                      }
                    >

                      <span>
                        {
                          activity.buyer_name
                        }
                        {activity.buyer_company
                          ? ` (${activity.buyer_company})`
                          : ''}
                      </span>

                      <span className="font-bold text-brand-600">
                        {
                          activity.activity
                        }
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

          </section>
        )}

      {/* SUPPLIER DIRECTORY MANAGEMENT TAB */}
      {activeTab ===
        'supplier-directory' && (
          <section className="space-y-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center space-x-2">

                <Building2 className="w-5 h-5 text-brand-600" />

                <h2 className="text-lg font-extrabold text-navy-950">
                  Master Supplier Directory
                </h2>

              </div>

              <span className="text-xs text-navy-500">
                Inline Editing Enabled
              </span>

            </div>

            <div className="overflow-x-auto rounded-xl border border-navy-200 bg-white shadow-card">

              <table className="w-full text-left text-xs">

                <thead className="bg-navy-900 text-white uppercase text-[10px] tracking-wider">

                  <tr>

                    <th className="p-3.5">
                      Company Name
                    </th>

                    <th className="p-3.5">
                      City
                    </th>

                    <th className="p-3.5">
                      Category
                    </th>

                    <th className="p-3.5">
                      GST Number
                    </th>

                    <th className="p-3.5">
                      Rating
                    </th>

                    <th className="p-3.5">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-navy-200">

                  {suppliers.map(
                    (s, idx) => (
                      <tr
                        key={s.id}
                        className={
                          idx % 2 === 0
                            ? 'bg-white'
                            : 'bg-navy-50/40'
                        }
                      >

                        {editingSupplierId ===
                          s.id ? (
                          <>

                            <td className="p-2">

                              <input
                                type="text"
                                className="w-full border rounded p-1"
                                value={
                                  editForm.name ||
                                  ''
                                }
                                onChange={e =>
                                  setEditForm({
                                    ...editForm,
                                    name:
                                      e.target.value,
                                  })
                                }
                              />

                            </td>

                            <td className="p-2">

                              <input
                                type="text"
                                className="w-full border rounded p-1"
                                value={
                                  editForm.location
                                    ?.city ||
                                  ''
                                }
                                onChange={e =>
                                  setEditForm({
                                    ...editForm,
                                    location: {
                                      ...editForm.location!,
                                      city:
                                        e.target.value,
                                    },
                                  })
                                }
                              />

                            </td>

                            <td className="p-2">

                              <input
                                type="text"
                                className="w-full border rounded p-1"
                                value={
                                  editForm.category ||
                                  ''
                                }
                                onChange={e =>
                                  setEditForm({
                                    ...editForm,
                                    category:
                                      e.target
                                        .value as Supplier['category'],
                                  })
                                }
                              />

                            </td>

                            <td className="p-2">

                              <input
                                type="text"
                                className="w-full border rounded p-1"
                                value={
                                  editForm
                                    .verificationDetails
                                    ?.gstNumber ||
                                  ''
                                }
                                onChange={e =>
                                  setEditForm({
                                    ...editForm,
                                    verificationDetails: {
                                      ...editForm.verificationDetails!,
                                      gstNumber:
                                        e.target.value,
                                    },
                                  })
                                }
                              />

                            </td>

                            <td className="p-2">

                              <input
                                type="number"
                                className="w-full border rounded p-1"
                                value={
                                  editForm.rating ||
                                  0
                                }
                                onChange={e =>
                                  setEditForm({
                                    ...editForm,
                                    rating:
                                      Number(
                                        e.target.value
                                      ),
                                  })
                                }
                              />

                            </td>

                            <td className="p-2 flex space-x-2">

                              <button
                                onClick={
                                  handleSaveEdit
                                }
                                className="text-emerald-600 font-bold"
                              >
                                Save
                              </button>

                              <button
                                onClick={() =>
                                  setEditingSupplierId(
                                    null
                                  )
                                }
                                className="text-red-500 font-bold"
                              >
                                Cancel
                              </button>

                            </td>

                          </>
                        ) : (
                          <>

                            <td className="p-3.5 font-bold text-navy-900">
                              {s.name}
                            </td>

                            <td className="p-3.5">
                              {s.location.city}
                            </td>

                            <td className="p-3.5">
                              {s.category}
                            </td>

                            <td className="p-3.5 font-mono text-navy-600">
                              {
                                s.verificationDetails
                                  .gstNumber
                              }
                            </td>

                            <td className="p-3.5 text-brand-600 font-bold">
                              {s.rating}/5.0
                            </td>

                            <td className="p-3.5">

                              <button
                                onClick={() =>
                                  handleEditClick(
                                    s
                                  )
                                }
                                className="text-brand-600 font-bold hover:underline"
                              >
                                Edit
                              </button>

                            </td>

                          </>
                        )}

                      </tr>
                    ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

      {/* VERIFICATION AUDITING TAB */}
      {activeTab ===
        'verification-auditing' && (
          <section className="space-y-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center space-x-2">

                <ShieldCheck className="w-5 h-5 text-emerald-600" />

                <h2 className="text-lg font-extrabold text-navy-950">
                  Supplier Verification Queue
                </h2>

              </div>

              <span className="text-xs text-navy-500">
                Toggle badges to simulate manual & automated audits
              </span>

            </div>

            <div className="overflow-x-auto rounded-xl border border-navy-200 bg-white shadow-card">

              <table className="w-full text-left text-xs">

                <thead className="bg-navy-900 text-white uppercase text-[10px] tracking-wider">

                  <tr>

                    <th className="p-3.5">
                      Company Name & Hub
                    </th>

                    <th className="p-3.5">
                      GST / Legal Name
                    </th>

                    <th className="p-3.5">
                      Certifications
                    </th>

                    <th className="p-3.5">
                      Audit Status
                    </th>

                    <th className="p-3.5">
                      Verification Badge Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-navy-200">

                  {suppliers.map(
                    (s, idx) => (
                      <tr
                        key={s.id}
                        className={
                          idx % 2 === 0
                            ? 'bg-white'
                            : 'bg-navy-50/40'
                        }
                      >

                        <td className="p-3.5">

                          <div className="font-bold text-navy-950 text-sm">
                            {s.name}
                          </div>

                          <div className="text-navy-500 text-[11px] mt-0.5">
                            {s.category} •{' '}
                            {s.location.city}
                          </div>

                        </td>

                        <td className="p-3.5">

                          <div className="font-mono font-bold text-navy-800">
                            {
                              s.verificationDetails
                                .gstNumber
                            }
                          </div>

                          <div className="text-navy-500 text-[11px] mt-0.5">
                            {
                              s.verificationDetails
                                .registeredLegalName
                            }
                          </div>

                        </td>

                        <td className="p-3.5">

                          <div className="flex flex-wrap gap-1">

                            {s.certifications.map(
                              c => (
                                <span
                                  key={c.code}
                                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-navy-100 text-navy-800"
                                >
                                  {c.code}
                                </span>
                              )
                            )}

                          </div>

                        </td>

                        <td className="p-3.5">

                          {s.verified ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">

                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />

                              <span>
                                Verified Active
                              </span>

                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">

                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />

                              <span>
                                Audit Pending
                              </span>

                            </span>
                          )}

                        </td>

                        <td className="p-3.5">

                          <button
                            onClick={() =>
                              handleVerificationClick(
                                s
                              )
                            }
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-xs ${s.verified
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                          >

                            {s.verified ? (
                              <>

                                <XCircle className="w-3.5 h-3.5" />

                                <span>
                                  Revoke Verified Badge
                                </span>

                              </>
                            ) : (
                              <>

                                <CheckCircle2 className="w-3.5 h-3.5" />

                                <span>
                                  Approve & Issue Badge
                                </span>

                              </>
                            )}

                          </button>

                        </td>

                      </tr>
                    ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

      {/* GLOBAL RFQS TAB */}
      {activeTab ===
        'global-rfqs' && (
          <section className="space-y-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center space-x-2">

                <FileText className="w-5 h-5 text-brand-600" />

                <h2 className="text-lg font-extrabold text-navy-950">
                  Global RFQ Supervision
                </h2>

              </div>

            </div>

            <div className="space-y-3">

              {rfqs.map(
                rfq => (
                  <div
                    key={rfq.id}
                    className="bg-white p-4 rounded-xl border border-navy-200 shadow-card flex justify-between items-center text-xs"
                  >

                    <div>

                      <h3 className="font-bold text-navy-900 text-sm">
                        {rfq.title}
                      </h3>

                      <p className="text-navy-500 mt-1">
                        Buyer:{' '}
                        <strong className="text-navy-700">
                          {rfq.buyerCompany}
                        </strong>{' '}
                        • Target:{' '}
                        {rfq.targetDeliveryDays}{' '}
                        days
                      </p>

                    </div>

                    <div className="text-right">

                      <span
                        className={`px-2.5 py-1 rounded-full font-bold ${rfq.status ===
                          'quoted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                          }`}
                      >
                        {rfq.status.toUpperCase()}
                      </span>

                      <p className="text-[10px] text-navy-400 mt-2">
                        Target Budget: $
                        {
                          rfq.targetUnitBudget
                        }
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          </section>
        )}

    </div>
  );
}