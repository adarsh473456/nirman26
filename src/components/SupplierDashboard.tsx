'use client';

import React, { useState } from 'react';
import { Supplier, RFQ, RfqQuote } from '../types';
import type { SupplierPayload } from '../types/supplier';
import { SupplierProfileForm } from './supplier/SupplierProfileForm';
import {
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  DollarSign,
  Wrench,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface SupplierDashboardProps {
  activeTab: string;

  // Supplier can temporarily be missing while the profile is loading.
  supplier?: Supplier | null;

  rfqs?: RFQ[];

  onRespondToRfq: (
    rfqId: string,
    quote: RfqQuote
  ) => void | Promise<unknown>;

  onUpdateProfile: (
    supplierId: string,
    payload: SupplierPayload
  ) => Promise<unknown>;
}

export function SupplierDashboard({
  activeTab,
  supplier,
  rfqs = [],
  onRespondToRfq,
  onUpdateProfile,
}: SupplierDashboardProps) {
  /*
   * IMPORTANT:
   * The supplier profile is fetched asynchronously.
   * Do not access supplier.id, supplier.images, etc.
   * until the supplier exists.
   */
  if (!supplier) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-navy-200 shadow-card p-10 text-center">
          <Building2 className="w-10 h-10 text-brand-600 mx-auto mb-4" />

          <h2 className="text-lg font-extrabold text-navy-950">
            Loading Supplier Dashboard
          </h2>

          <p className="text-sm text-navy-500 mt-2">
            Fetching your supplier profile...
          </p>
        </div>
      </div>
    );
  }

  const supplierRfqs = (rfqs ?? []).filter(
    rfq => rfq.supplierId === supplier.id
  );

  const [
    selectedRfqForQuote,
    setSelectedRfqForQuote,
  ] = useState<RFQ | null>(null);

  const [
    isEditingProfile,
    setIsEditingProfile,
  ] = useState(false);

  // Quote form state
  const [unitPrice, setUnitPrice] =
    useState(150);

  const [toolingCost, setToolingCost] =
    useState(400);

  const [leadDays, setLeadDays] =
    useState(12);

  const [quoteNotes, setQuoteNotes] =
    useState(
      'Stock raw material available. Full CMM inspection report provided upon dispatch.'
    );

  const handleSendQuote = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedRfqForQuote) {
      return;
    }

    const newQuote: RfqQuote = {
      supplierId: supplier.id,
      supplierName:
        supplier.name || 'Supplier',
      unitPrice: Number(unitPrice),
      currency: 'USD',
      toolingCost: Number(toolingCost),
      estimatedLeadDays:
        Number(leadDays),
      notes: quoteNotes,
      quotedAt:
        new Date().toISOString(),
      validUntil: new Date(
        Date.now() +
        30 *
        24 *
        60 *
        60 *
        1000
      ).toISOString(),
    };

    try {
      await onRespondToRfq(
        selectedRfqForQuote.id,
        newQuote
      );

      setSelectedRfqForQuote(null);
    } catch (error) {
      console.error(
        'Failed to submit quotation:',
        error
      );
    }
  };

  const handleProfileSave = async (
    payload: SupplierPayload
  ) => {
    try {
      const updatedSupplier =
        await onUpdateProfile(
          supplier.id,
          payload
        );

      setIsEditingProfile(false);

      return updatedSupplier;
    } catch (error) {
      console.error(
        'Failed to update supplier profile:',
        error
      );

      throw error;
    }
  };

  const certifications =
    supplier.certifications ?? [];

  const machinery =
    supplier.machinery ?? [];

  const gstNumber =
    supplier.verificationDetails
      ?.gstNumber || 'Not provided';

  const city =
    supplier.location?.city ||
    'Location not provided';

  const state =
    supplier.location?.state || '';

  const contactPerson =
    supplier.contact?.contactPerson ||
    'Not provided';

  const contactEmail =
    supplier.contact?.email ||
    'No email provided';

  const responseRate =
    supplier.responseRatePct ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* =========================================================
          TOP SUPPLIER PROFILE BANNER
      ========================================================= */}

      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          {/* Supplier Logo */}
          <div className="w-16 h-16 rounded-xl bg-white p-1 border border-navy-700 shadow-md flex-shrink-0">
            {supplier.images?.logo ? (
              <img
                src={supplier.images.logo}
                alt={
                  supplier.name ||
                  'Supplier'
                }
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-navy-100 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-navy-500" />
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-900 text-brand-300 text-[10px] uppercase font-bold">
                Supplier Portal
              </span>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {supplier.name ||
                  'Supplier'}
              </h1>

              {supplier.verified ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                  <ShieldCheck className="w-3.5 h-3.5" />

                  <span>
                    Verified Supplier
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white">
                  <AlertCircle className="w-3.5 h-3.5" />

                  <span>
                    Pending Admin Audit
                  </span>
                </span>
              )}
            </div>

            <p className="text-xs text-navy-200 mt-1">
              {supplier.tagline ||
                'Supplier profile'}
            </p>

            <p className="text-xs text-navy-400 mt-0.5">
              GST:{' '}
              <strong className="text-navy-200">
                {gstNumber}
              </strong>{' '}
              • {city}
              {state
                ? `, ${state}`
                : ''}
            </p>
          </div>
        </div>

        {/* Dashboard summary */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-navy-950/80 border border-navy-700 px-4 py-2.5 rounded-xl text-center">
            <span className="text-navy-400 block text-[10px] uppercase font-bold">
              Incoming RFQs
            </span>

            <span className="text-lg font-extrabold text-white">
              {supplierRfqs.length}
            </span>
          </div>

          <div className="bg-navy-950/80 border border-navy-700 px-4 py-2.5 rounded-xl text-center">
            <span className="text-navy-400 block text-[10px] uppercase font-bold">
              Response Rate
            </span>

            <span className="text-lg font-extrabold text-emerald-400">
              {responseRate}%
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          PROFILE MANAGEMENT
      ========================================================= */}

      {activeTab ===
        'profile-management' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-brand-600" />

                <h2 className="text-lg font-extrabold text-navy-950">
                  Company Profile
                </h2>
              </div>
            </div>

            {!isEditingProfile ? (
              <div className="bg-white p-6 rounded-xl border border-navy-200 shadow-card text-sm text-navy-700 space-y-4">
                <p>
                  <strong>
                    About Us:
                  </strong>{' '}
                  {supplier.overview ||
                    'No company overview added yet.'}
                </p>

                <p>
                  <strong>
                    Certifications:
                  </strong>{' '}
                  {certifications.length >
                    0
                    ? certifications
                      .map(
                        certification =>
                          certification.code
                      )
                      .filter(Boolean)
                      .join(', ')
                    : 'No certifications added'}
                </p>

                <p>
                  <strong>
                    Contact:
                  </strong>{' '}
                  {contactPerson}{' '}
                  ({contactEmail})
                </p>

                <button
                  onClick={() =>
                    setIsEditingProfile(
                      true
                    )
                  }
                  className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded shadow"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <SupplierProfileForm
                supplier={supplier}
                onSave={
                  handleProfileSave
                }
              />
            )}
          </section>
        )}

      {/* =========================================================
          INCOMING RFQs / QUOTATION BIDDING
      ========================================================= */}

      {(activeTab ===
        'incoming-rfqs' ||
        activeTab ===
        'quotation-bidding') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-brand-600" />

                <h2 className="text-lg font-extrabold text-navy-950">
                  {activeTab ===
                    'quotation-bidding'
                    ? 'Quotation Bidding Center'
                    : 'Incoming RFQs & Inquiries'}
                </h2>
              </div>

              <span className="text-xs text-navy-500">
                {supplierRfqs.length}{' '}
                Requests
              </span>
            </div>

            {supplierRfqs.length ===
              0 ? (
              <div className="bg-white rounded-xl p-8 border border-navy-200 text-center space-y-2">
                <p className="text-sm font-semibold text-navy-700">
                  No incoming RFQs at
                  the moment.
                </p>

                <p className="text-xs text-navy-500">
                  When buyers dispatch
                  quote requests matching
                  your capabilities, they
                  will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {supplierRfqs.map(
                  rfq => {
                    const attachments =
                      rfq.attachments ??
                      [];

                    return (
                      <div
                        key={rfq.id}
                        className="bg-white rounded-xl border border-navy-200 shadow-card p-5 space-y-4"
                      >
                        {/* RFQ Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-100">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-navy-400">
                                {rfq.id}
                              </span>

                              <h3 className="text-base font-extrabold text-navy-950">
                                {rfq.title ||
                                  'RFQ'}
                              </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-navy-600">
                              <span>
                                Buyer:{' '}
                                <strong className="text-navy-900">
                                  {rfq.buyerCompany ||
                                    'Buyer'}
                                </strong>{' '}
                                (
                                {rfq.buyerName ||
                                  'Unknown'}
                                )
                              </span>

                              <span>
                                •
                              </span>

                              <span>
                                Required
                                Material:{' '}
                                <strong>
                                  {rfq.material ||
                                    'Not specified'}
                                </strong>
                              </span>

                              <span>
                                •
                              </span>

                              <span>
                                Qty:{' '}
                                <strong>
                                  {rfq.quantity ??
                                    0}{' '}
                                  units
                                </strong>
                              </span>

                              <span>
                                •
                              </span>

                              <span>
                                Target
                                Delivery:{' '}
                                <strong>
                                  {rfq.targetDeliveryDays ??
                                    'N/A'}{' '}
                                  days
                                </strong>
                              </span>
                            </div>
                          </div>

                          <div>
                            {rfq.status ===
                              'submitted' ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />

                                <span>
                                  Action
                                  Required:
                                  Submit
                                  Quote
                                </span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />

                                <span>
                                  Quotation
                                  Dispatched
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Technical Specs */}
                        <div className="p-3 bg-navy-50 rounded-lg text-xs text-navy-800">
                          <p>
                            <strong>
                              Technical
                              Notes:
                            </strong>{' '}
                            {rfq.specifications ||
                              'No technical notes provided.'}
                          </p>

                          {attachments.length >
                            0 && (
                              <div className="mt-2 pt-2 border-t border-navy-200 flex flex-wrap items-center gap-2 text-[11px]">
                                <span className="text-navy-500">
                                  CAD /
                                  Drawing
                                  Files:
                                </span>

                                {attachments.map(
                                  (
                                    att,
                                    idx
                                  ) => (
                                    <span
                                      key={
                                        idx
                                      }
                                      className="px-2 py-0.5 bg-white border border-navy-300 rounded font-semibold text-brand-700"
                                    >
                                      {att.name ||
                                        `Attachment ${idx + 1}`}{' '}
                                      {typeof att.sizeKb ===
                                        'number'
                                        ? `(${(
                                          att.sizeKb /
                                          1024
                                        ).toFixed(
                                          1
                                        )} MB)`
                                        : ''}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                        </div>

                        {/* Quote already submitted */}
                        {rfq.quote ? (
                          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-emerald-950">
                                You
                                Quoted:{' '}
                              </span>

                              <span className="text-emerald-800 font-extrabold text-sm">
                                $
                                {rfq.quote
                                  .unitPrice ??
                                  0}
                                /unit
                              </span>

                              <span className="text-navy-500">
                                {' '}
                                ($
                                {rfq.quote
                                  .toolingCost ??
                                  0}{' '}
                                tooling,{' '}
                                {rfq.quote
                                  .estimatedLeadDays ??
                                  'N/A'}{' '}
                                days
                                delivery)
                              </span>
                            </div>

                            <span className="text-[11px] text-emerald-700 font-medium">
                              Status:
                              Awaiting
                              Buyer
                              Confirmation
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                setSelectedRfqForQuote(
                                  rfq
                                )
                              }
                              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow transition flex items-center space-x-1.5"
                            >
                              <DollarSign className="w-4 h-4" />

                              <span>
                                Prepare &
                                Submit
                                Formal
                                Quote
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>
        )}

      {/* =========================================================
          FACILITY SHOWCASE
      ========================================================= */}

      {activeTab ===
        'facility-showcase' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-brand-600" />

                <h2 className="text-lg font-extrabold text-navy-950">
                  Registered Machinery &
                  Facility Setup
                </h2>
              </div>

              <span className="text-xs text-navy-500">
                {machinery.length}{' '}
                Active Machines
              </span>
            </div>

            {machinery.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-navy-200 text-center">
                <Wrench className="w-8 h-8 text-navy-400 mx-auto mb-3" />

                <p className="text-sm font-semibold text-navy-700">
                  No machinery added yet.
                </p>

                <p className="text-xs text-navy-500 mt-1">
                  Add your manufacturing
                  equipment through the
                  supplier profile.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {machinery.map(
                  (machine, index) => (
                    <div
                      key={
                        machine.id ||
                        index
                      }
                      className="p-4 bg-white rounded-xl border border-navy-200 shadow-card space-y-2 text-xs"
                    >
                      <h3 className="font-bold text-navy-950 text-sm">
                        {machine.name ||
                          'Machine'}
                      </h3>

                      <p className="text-brand-700 font-semibold">
                        {machine.category ||
                          'Equipment'}
                      </p>

                      <div className="pt-2 border-t border-navy-100 space-y-1 text-navy-600">
                        <p>
                          Model:{' '}
                          <strong className="text-navy-900">
                            {machine.model ||
                              'N/A'}
                            {machine.makeYear
                              ? ` (${machine.makeYear})`
                              : ''}
                          </strong>
                        </p>

                        <p>
                          Tolerance:{' '}
                          <strong className="font-mono text-emerald-700">
                            {machine.tolerance ||
                              'N/A'}
                          </strong>
                        </p>

                        <p>
                          Envelope:{' '}
                          <strong className="text-navy-900">
                            {machine.workingArea ||
                              'N/A'}
                          </strong>
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}

      {/* =========================================================
          QUOTE SUBMISSION MODAL
      ========================================================= */}

      {selectedRfqForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-navy-200">
            <h3 className="text-base font-extrabold text-navy-950">
              Submit Quotation for{' '}
              {selectedRfqForQuote.title ||
                'RFQ'}
            </h3>

            <p className="text-xs text-navy-600">
              Buyer:{' '}
              <strong>
                {selectedRfqForQuote.buyerCompany ||
                  'Buyer'}
              </strong>{' '}
              (Qty:{' '}
              {selectedRfqForQuote.quantity ??
                0}{' '}
              units)
            </p>

            <form
              onSubmit={
                handleSendQuote
              }
              className="space-y-3 text-xs"
            >
              {/* Unit Price */}
              <div>
                <label className="block text-navy-800 font-bold mb-1">
                  Unit Price (USD) *
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={unitPrice}
                  onChange={e =>
                    setUnitPrice(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tooling */}
                <div>
                  <label className="block text-navy-800 font-bold mb-1">
                    Tooling / NRE
                    Cost ($)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      toolingCost
                    }
                    onChange={e =>
                      setToolingCost(
                        Number(
                          e.target
                            .value
                        )
                      )
                    }
                    className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 text-xs font-medium"
                  />
                </div>

                {/* Lead time */}
                <div>
                  <label className="block text-navy-800 font-bold mb-1">
                    Promised Lead
                    Time (Days) *
                  </label>

                  <input
                    type="number"
                    min="1"
                    required
                    value={leadDays}
                    onChange={e =>
                      setLeadDays(
                        Number(
                          e.target
                            .value
                        )
                      )
                    }
                    className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-navy-800 font-bold mb-1">
                  Commercial &
                  Quality Notes
                </label>

                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={e =>
                    setQuoteNotes(
                      e.target.value
                    )
                  }
                  className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-900 text-xs"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-navy-100">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRfqForQuote(
                      null
                    )
                  }
                  className="px-4 py-2 text-navy-600 hover:text-navy-900 font-semibold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow text-xs flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />

                  <span>
                    Send Quote to
                    Buyer
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}