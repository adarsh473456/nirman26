'use client';

import React from 'react';
import { RFQ, Supplier } from '../types';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  Building2, 
  Bookmark, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface BuyerDashboardProps {
  activeTab: string;
  rfqs: RFQ[];
  bookmarkedSuppliers: Supplier[];
  onAcceptQuote: (rfqId: string) => void;
  onViewSupplierProfile: (supplier: Supplier) => void;
  onRequestQuoteAgain: (supplier: Supplier) => void;
}

export function BuyerDashboard({
  activeTab,
  rfqs,
  bookmarkedSuppliers,
  onAcceptQuote,
  onViewSupplierProfile,
  onRequestQuoteAgain,
}: BuyerDashboardProps) {
  const getStatusBadge = (status: RFQ['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>RFQ Dispatched (Awaiting Supplier)</span>
          </span>
        );
      case 'quoted':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-300">
            <DollarSign className="w-3.5 h-3.5 text-brand-600" />
            <span>Quote Received & Ready</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quote Accepted</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner (Always Visible) */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-6 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-brand-900/80 text-brand-300 text-xs font-semibold mb-2">
            <span>Sourcing Manager Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold">Buyer Sourcing & RFQ Tracker</h1>
          <p className="text-xs sm:text-sm text-navy-300 mt-1">
            Track active requests for quotation, compare incoming pricing, and manage your shortlisted suppliers.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-navy-950/80 border border-navy-700 px-4 py-2.5 rounded-xl text-center">
            <span className="text-navy-400 block text-[10px] uppercase font-bold">Active RFQs</span>
            <span className="text-lg font-extrabold text-white">{rfqs.length}</span>
          </div>

          <div className="bg-navy-950/80 border border-navy-700 px-4 py-2.5 rounded-xl text-center">
            <span className="text-navy-400 block text-[10px] uppercase font-bold">Shortlisted</span>
            <span className="text-lg font-extrabold text-brand-400">{bookmarkedSuppliers.length}</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD ANALYTICS TAB */}
      {activeTab === 'dashboard-analytics' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-extrabold text-navy-950">Analytics Overview</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-navy-200 shadow-card">
              <span className="text-xs text-navy-500 font-medium block">Total Spend Initiated</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-extrabold text-brand-600">$45,200</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-navy-200 shadow-card">
              <span className="text-xs text-navy-500 font-medium block">Avg. Quote Turnaround</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-extrabold text-emerald-600">2.1 Days</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-navy-200 shadow-card">
              <span className="text-xs text-navy-500 font-medium block">Quotes Accepted</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-extrabold text-navy-900">{rfqs.filter(r => r.status === 'accepted').length}</span>
                <span className="text-xs text-navy-400 block mt-1">Out of {rfqs.length} requests</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MY RFQS TAB */}
      {activeTab === 'my-rfqs' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-extrabold text-navy-950">Active Requests for Quotation (RFQs)</h2>
            </div>
            <span className="text-xs text-navy-500">{rfqs.length} Total Requests</span>
          </div>

          {rfqs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-navy-200 text-center space-y-2">
              <p className="text-sm font-semibold text-navy-700">No active RFQs yet.</p>
              <p className="text-xs text-navy-500">Search for verified suppliers and click &quot;Request Quote&quot; to begin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rfqs.map(rfq => (
                <div
                  key={rfq.id}
                  className="bg-white rounded-xl border border-navy-200 shadow-card p-5 space-y-4 transition hover:border-brand-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-navy-400">{rfq.id}</span>
                        <h3 className="text-base font-extrabold text-navy-950">{rfq.title}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-navy-600">
                        <span>Supplier: <strong className="text-navy-900">{rfq.supplierName}</strong></span>
                        <span>•</span>
                        <span>Material: <strong>{rfq.material}</strong></span>
                        <span>•</span>
                        <span>Quantity: <strong>{rfq.quantity} units</strong></span>
                        <span>•</span>
                        <span>Date: {new Date(rfq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      {getStatusBadge(rfq.status)}
                    </div>
                  </div>

                  {/* RFQ Specifications Summary */}
                  <div className="text-xs text-navy-700 bg-navy-50/70 p-3 rounded-lg border border-navy-200">
                    <p className="line-clamp-2"><strong>Specs:</strong> {rfq.specifications || 'Standard tolerance drawing specified in attachment.'}</p>
                    {rfq.attachments.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-navy-200 text-[11px] text-navy-600">
                        <span>Attached:</span>
                        {rfq.attachments.map((att, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-navy-200 rounded font-medium">
                            {att.name} ({(att.sizeKb / 1024).toFixed(1)}MB)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* If Supplier has Submitted a Quote */}
                  {rfq.quote && (
                    <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                            Official Quotation Received from {rfq.supplierName}
                          </h4>
                        </div>
                        <span className="text-[11px] text-emerald-700">
                          Quoted on {new Date(rfq.quote.quotedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-2.5 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                          <span className="text-[10px] text-navy-500 block uppercase font-medium">Unit Price</span>
                          <span className="text-base font-extrabold text-emerald-800">
                            ${rfq.quote.unitPrice.toFixed(2)} / unit
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                          <span className="text-[10px] text-navy-500 block uppercase font-medium">Total Lot Cost</span>
                          <span className="text-base font-extrabold text-navy-950">
                            ${(rfq.quote.unitPrice * rfq.quantity + rfq.quote.toolingCost).toLocaleString()}
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                          <span className="text-[10px] text-navy-500 block uppercase font-medium">Tooling / NRE</span>
                          <span className="text-base font-bold text-navy-900">
                            ${rfq.quote.toolingCost}
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                          <span className="text-[10px] text-navy-500 block uppercase font-medium">Promised Lead Time</span>
                          <span className="text-base font-bold text-navy-900">
                            {rfq.quote.estimatedLeadDays} Days
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-navy-700 italic bg-white p-2.5 rounded-lg border border-emerald-200">
                        &quot;{rfq.quote.notes}&quot;
                      </p>

                      {rfq.status !== 'accepted' && (
                        <div className="flex items-center justify-end pt-1">
                          <button
                            onClick={() => onAcceptQuote(rfq.id)}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition flex items-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept & Issue Sourcing Order Intent</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* BOOKMARKS TAB */}
      {activeTab === 'bookmarks' && (
        <section className="space-y-4 pt-4 border-t border-navy-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg font-extrabold text-navy-950">Shortlisted / Saved Suppliers</h2>
            </div>
            <span className="text-xs text-navy-500">{bookmarkedSuppliers.length} Saved</span>
          </div>

          {bookmarkedSuppliers.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-navy-200 text-center space-y-2">
              <p className="text-sm font-semibold text-navy-700">No suppliers bookmarked yet.</p>
              <p className="text-xs text-navy-500">Bookmark verified suppliers to review or quote them later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedSuppliers.map(sup => (
                <div
                  key={sup.id}
                  className="bg-white rounded-xl border border-navy-200 p-4 shadow-card hover:shadow-elevated transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-navy-950 text-sm">{sup.name}</h3>
                      <p className="text-xs text-navy-500">{sup.category} • {sup.location.city}</p>
                    </div>
                    {sup.verified && (
                      <span className="p-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-navy-100 text-xs">
                    <button
                      onClick={() => onViewSupplierProfile(sup)}
                      className="text-brand-600 hover:underline font-semibold"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => onRequestQuoteAgain(sup)}
                      className="px-3 py-1.5 bg-brand-600 text-white font-bold rounded-md hover:bg-brand-700 transition flex items-center space-x-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send RFQ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
