'use client';

import React, { useState } from 'react';
import { Supplier } from '../types';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Award, 
  Wrench, 
  Building2, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  FileCheck2, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  Maximize2,
  AlertCircle
} from 'lucide-react';

interface SupplierProfileModalProps {
  supplier: Supplier | null;
  onClose: () => void;
  onRequestQuote: (supplier: Supplier) => void;
}

export function SupplierProfileModal({
  supplier,
  onClose,
  onRequestQuote,
}: SupplierProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'machinery' | 'certifications' | 'contact'>('overview');
  const [showFullContact, setShowFullContact] = useState(false);

  if (!supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-navy-200 overflow-hidden">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 text-white p-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-navy-800/80 hover:bg-navy-700 text-navy-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-12">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-white p-1 border border-navy-700 shadow-md flex-shrink-0">
                <img
                  src={supplier.images.logo}
                  alt={supplier.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {supplier.name}
                  </h2>

                  {supplier.verified ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified Supplier</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white">
                      <AlertCircle className="w-4 h-4" />
                      <span>Pending Verification</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-navy-200 mt-1 max-w-xl">
                  {supplier.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-navy-300">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    <span>{supplier.location.city}, {supplier.location.state}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white">{supplier.rating}</span>
                    <span>({supplier.reviewCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span>Est. {supplier.establishedYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Audit Callout */}
          {supplier.verified && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>GST & Registration Verified:</strong> {supplier.verificationDetails.gstNumber} ({supplier.verificationDetails.registeredLegalName})
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 hidden sm:inline">
                Audited {supplier.verificationDetails.verifiedDate}
              </span>
            </div>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-navy-200 px-6 bg-navy-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-brand-600 text-brand-700 bg-white'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            Overview & Facilities
          </button>

          <button
            onClick={() => setActiveTab('machinery')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'machinery'
                ? 'border-brand-600 text-brand-700 bg-white'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            Machinery & Specs ({supplier.machinery.length})
          </button>

          <button
            onClick={() => setActiveTab('certifications')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'certifications'
                ? 'border-brand-600 text-brand-700 bg-white'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            Certifications ({supplier.certifications.length})
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'contact'
                ? 'border-brand-600 text-brand-700 bg-white'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            Direct Sourcing Contact
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-navy-900 text-sm">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-2">
                  Company Overview
                </h3>
                <p className="text-navy-700 leading-relaxed">
                  {supplier.overview}
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-navy-50 rounded-xl border border-navy-200">
                  <span className="text-[11px] text-navy-500 block uppercase font-medium flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-navy-400" />
                    <span>Avg Lead Time</span>
                  </span>
                  <span className="text-base font-bold text-navy-950 mt-1 block">
                    {supplier.avgLeadTimeDays} Days
                  </span>
                </div>

                <div className="p-3 bg-navy-50 rounded-xl border border-navy-200">
                  <span className="text-[11px] text-navy-500 block uppercase font-medium flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-navy-400" />
                    <span>Workforce</span>
                  </span>
                  <span className="text-base font-bold text-navy-950 mt-1 block">
                    {supplier.employeeCount} Staff
                  </span>
                </div>

                <div className="p-3 bg-navy-50 rounded-xl border border-navy-200">
                  <span className="text-[11px] text-navy-500 block uppercase font-medium flex items-center space-x-1">
                    <Maximize2 className="w-3.5 h-3.5 text-navy-400" />
                    <span>Plant Size</span>
                  </span>
                  <span className="text-base font-bold text-navy-950 mt-1 block">
                    {supplier.facilitySizeSqFt.toLocaleString()} sq.ft
                  </span>
                </div>

                <div className="p-3 bg-navy-50 rounded-xl border border-navy-200">
                  <span className="text-[11px] text-navy-500 block uppercase font-medium flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Response Rate</span>
                  </span>
                  <span className="text-base font-bold text-emerald-700 mt-1 block">
                    {supplier.responseRatePct}%
                  </span>
                </div>
              </div>

              {/* Supported Materials */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-2">
                  Materials Processed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {supplier.materials.map(mat => (
                    <span
                      key={mat}
                      className="px-3 py-1 bg-white border border-navy-300 rounded-lg text-xs font-semibold text-navy-800 shadow-2xs"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Facility Gallery */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-2">
                  Plant & Inspection Facilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {supplier.images.facility.map((img, idx) => (
                    <div key={idx} className="h-44 rounded-xl overflow-hidden border border-navy-200 shadow-sm">
                      <img src={img} alt="Facility" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Machinery */}
          {activeTab === 'machinery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-500">
                  Equipment List & Technical Tolerances
                </h3>
                <span className="text-xs text-brand-600 font-medium">All equipment audited</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-navy-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy-900 text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Equipment Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Model & Year</th>
                      <th className="p-3">Tolerance</th>
                      <th className="p-3">Working Envelope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-200">
                    {supplier.machinery.map((m, idx) => (
                      <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-navy-50/50'}>
                        <td className="p-3 font-bold text-navy-950">{m.name}</td>
                        <td className="p-3 text-brand-700 font-semibold">{m.category}</td>
                        <td className="p-3 text-navy-600">{m.model} ({m.makeYear})</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">{m.tolerance}</td>
                        <td className="p-3 text-navy-700">{m.workingArea}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Certifications */}
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-500">
                Active Industry Certifications & Quality Standards
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {supplier.certifications.map(cert => (
                  <div key={cert.id} className="p-4 rounded-xl border border-navy-200 bg-white shadow-card space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-brand-600" />
                        <span className="font-extrabold text-sm text-navy-950">{cert.code}</span>
                      </div>
                      {cert.verified && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Verified Audit
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-navy-700">{cert.name}</p>
                    <div className="text-[11px] text-navy-500 pt-2 border-t border-navy-100 flex justify-between">
                      <span>Issuer: <strong>{cert.issuer}</strong></span>
                      <span>Valid until: <strong>{cert.validUntil}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Contact (Progressive Disclosure) */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-4 bg-navy-50 rounded-xl border border-navy-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                    Progressive Sourcing Contact
                  </h3>
                  <span className="text-[11px] text-navy-500">Anti-Scraping Protection</span>
                </div>
                <p className="text-xs text-navy-600 mt-1">
                  Full direct phone and direct plant addresses are unlocked for registered sourcing teams to avoid unsolicited marketing.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-navy-200 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {supplier.contact.contactPerson.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-950">{supplier.contact.contactPerson}</h4>
                    <p className="text-xs text-navy-500">{supplier.contact.title}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-navy-100 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-navy-400" />
                    <span className="font-medium text-navy-800">{supplier.contact.email}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-navy-400" />
                    <a href={supplier.contact.website} target="_blank" rel="noreferrer" className="font-medium text-brand-600 hover:underline">
                      {supplier.contact.website}
                    </a>
                  </div>

                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-navy-400 mt-0.5" />
                    <span className="text-navy-700">{supplier.contact.address}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-navy-50 border-t border-navy-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-navy-700 hover:text-navy-900 transition"
          >
            Close Window
          </button>

          <button
            onClick={() => {
              onClose();
              onRequestQuote(supplier);
            }}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition flex items-center space-x-2"
          >
            <span>Request Formal Quote (RFQ)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
