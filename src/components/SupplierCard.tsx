'use client';

import React from 'react';
import { Supplier } from '../types';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Box, 
  Star, 
  Bookmark, 
  ArrowRightLeft, 
  Wrench, 
  Award, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu
} from 'lucide-react';

interface SupplierCardProps {
  supplier: Supplier;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isCompared: boolean;
  onToggleCompare: () => void;
  onViewProfile: () => void;
  onRequestQuote: () => void;
}

export function SupplierCard({
  supplier,
  isBookmarked,
  onToggleBookmark,
  isCompared,
  onToggleCompare,
  onViewProfile,
  onRequestQuote,
}: SupplierCardProps) {
  const matchScore = supplier.matchScore ?? 92;

  return (
    <div className="bg-white rounded-2xl border border-navy-200/90 shadow-card hover:border-brand-500/80 card-3d-hover p-5 sm:p-6 flex flex-col justify-between relative group overflow-hidden">
      {/* Subtle background glow effect on card hover */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-brand-500/10 transition duration-300" />

      <div>
        {/* Top Header: Logo + Title + Verified Badge + Match Score */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-start space-x-4">
            {/* Logo / Thumbnail */}
            <div className="w-14 h-14 rounded-xl bg-navy-50 border border-navy-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner group-hover:scale-105 transition duration-300">
              <img
                src={supplier.images.logo}
                alt={supplier.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  onClick={onViewProfile}
                  className="text-base sm:text-lg font-black text-navy-950 hover:text-brand-600 cursor-pointer transition flex items-center space-x-1"
                >
                  <span>{supplier.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-600 transition" />
                </h2>

                {/* Prominent Verified Badge */}
                {supplier.verified ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300/80 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Supplier</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-300/80">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pending Verification</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-navy-600 mt-1 line-clamp-1 font-medium">
                {supplier.tagline}
              </p>

              {/* Sub-meta: Location, Category, Rating */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-navy-500">
                <span className="flex items-center space-x-1 font-semibold text-navy-800">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>{supplier.location.city}, {supplier.location.state}</span>
                </span>
                <span>•</span>
                <span className="font-bold text-brand-700 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-md">
                  {supplier.category}
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1 font-semibold text-navy-800">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{supplier.rating.toFixed(1)}</span>
                  <span className="text-navy-400 font-normal">({supplier.reviewCount})</span>
                </span>
              </div>
            </div>
          </div>

          {/* AI Match Score Badge with Glow */}
          <div className="flex flex-col items-end flex-shrink-0">
            <div className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-black text-xs shadow-md shadow-brand-500/25">
              <Sparkles className="w-3.5 h-3.5 text-brand-200 animate-spin-slow" />
              <span>{matchScore}% Match</span>
            </div>
            <span className="text-[10px] font-bold text-navy-400 mt-1 uppercase tracking-wider">Quality Score</span>
          </div>
        </div>

        {/* AI Match Reasons Tags */}
        {supplier.matchReasons && supplier.matchReasons.length > 0 && (
          <div className="mt-3.5 py-2 px-3 bg-navy-50/80 rounded-xl border border-navy-200/80 text-[11px] text-navy-700 flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-brand-700 flex items-center space-x-1 mr-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Match Signals:</span>
            </span>
            {supplier.matchReasons.map((reason, idx) => (
              <span key={idx} className="font-medium text-navy-800 bg-white px-2 py-0.5 rounded border border-navy-200 shadow-2xs">
                {reason}
              </span>
            ))}
          </div>
        )}

        {/* Highlights 4-Grid: MOQ, Lead Time, Response, Area */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-navy-50/70 rounded-xl border border-navy-100">
            <span className="text-[10px] text-navy-500 block uppercase font-bold tracking-wider">Min Order (MOQ)</span>
            <span className="font-black text-navy-950 text-sm mt-0.5 block">{supplier.moq} units</span>
          </div>

          <div className="p-2.5 bg-navy-50/70 rounded-xl border border-navy-100">
            <span className="text-[10px] text-navy-500 block uppercase font-bold tracking-wider">Avg Lead Time</span>
            <span className="font-black text-brand-700 text-sm mt-0.5 block">{supplier.avgLeadTimeDays} days</span>
          </div>

          <div className="p-2.5 bg-navy-50/70 rounded-xl border border-navy-100">
            <span className="text-[10px] text-navy-500 block uppercase font-bold tracking-wider">Response Rate</span>
            <span className="font-black text-emerald-700 text-sm mt-0.5 block">{supplier.responseRatePct}% <span className="text-xs font-normal text-navy-400">({supplier.avgResponseTimeHours}h)</span></span>
          </div>

          <div className="p-2.5 bg-navy-50/70 rounded-xl border border-navy-100">
            <span className="text-[10px] text-navy-500 block uppercase font-bold tracking-wider">Plant Area</span>
            <span className="font-black text-navy-950 text-sm mt-0.5 block">{supplier.facilitySizeSqFt.toLocaleString()} sq.ft</span>
          </div>
        </div>

        {/* Machinery Specs Highlight & Certifications */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-navy-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-navy-500 text-[11px] font-bold flex items-center space-x-1">
              <Award className="w-3 h-3 text-brand-600" />
              <span>Audited Certs:</span>
            </span>
            {supplier.certifications.map(c => (
              <span
                key={c.code}
                className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-navy-100 text-navy-800 border border-navy-200"
              >
                {c.code}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-1 text-[11px] text-navy-600">
            <Cpu className="w-3.5 h-3.5 text-brand-600" />
            <span>Key Metrology: <strong className="text-navy-900 font-bold">{supplier.machinery[0]?.name}</strong> (<span className="font-mono text-emerald-700 font-bold">{supplier.machinery[0]?.tolerance}</span>)</span>
          </div>
        </div>
      </div>

      {/* Actions Bottom Bar */}
      <div className="mt-5 pt-3.5 border-t border-navy-100 flex flex-wrap items-center justify-between gap-2 relative z-10">
        <div className="flex items-center space-x-2">
          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition ${
              isBookmarked
                ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm'
                : 'bg-white text-navy-700 border-navy-200 hover:bg-navy-50'
            }`}
            title={isBookmarked ? 'Remove from Shortlist' : 'Save / Bookmark Supplier'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600' : ''}`} />
            <span>{isBookmarked ? 'Shortlisted' : 'Save'}</span>
          </button>

          {/* Compare Button */}
          <button
            onClick={onToggleCompare}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition ${
              isCompared
                ? 'bg-brand-50 text-brand-700 border-brand-300 shadow-sm'
                : 'bg-white text-navy-700 border-navy-200 hover:bg-navy-50'
            }`}
            title="Toggle Side-by-side comparison"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Profile */}
          <button
            onClick={onViewProfile}
            className="px-3.5 py-2 text-xs font-bold text-navy-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition"
          >
            Full Profile & Machinery
          </button>

          {/* Primary Action: Request for Quote (RFQ) */}
          <button
            onClick={onRequestQuote}
            className="px-5 py-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2"
          >
            <span>Request Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
