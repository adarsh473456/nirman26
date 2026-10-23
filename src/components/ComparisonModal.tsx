'use client';

import React from 'react';
import { Supplier } from '../types';
import { 
  X, 
  ArrowRightLeft, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  Box, 
  Award, 
  Wrench, 
  Send,
  AlertCircle
} from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedSuppliers: Supplier[];
  onRemoveSupplier: (id: string) => void;
  onRequestQuote: (supplier: Supplier) => void;
}

export function ComparisonModal({
  isOpen,
  onClose,
  comparedSuppliers,
  onRemoveSupplier,
  onRequestQuote,
}: ComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-5xl w-full flex flex-col shadow-2xl border border-navy-200 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="bg-navy-900 text-white p-5 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Side-by-Side Supplier Comparison ({comparedSuppliers.length}/4)
              </h2>
              <p className="text-xs text-navy-300">
                Compare verified capabilities, technical tolerances, certifications, and lead times.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {comparedSuppliers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-navy-600 font-medium">
              No suppliers selected for comparison yet.
            </p>
            <p className="text-xs text-navy-400">
              Click &quot;Compare&quot; on any supplier card on the discovery page to add them here.
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-3 bg-navy-50 text-navy-500 font-bold uppercase text-[10px] w-44 border-b border-r border-navy-200">
                    Feature / Attribute
                  </th>
                  {comparedSuppliers.map(sup => (
                    <th
                      key={sup.id}
                      className="p-4 bg-navy-50 text-navy-950 font-bold text-sm border-b border-r border-navy-200 min-w-[220px]"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-extrabold text-navy-950">{sup.name}</h4>
                          <div className="flex items-center space-x-1 mt-1">
                            {sup.verified ? (
                              <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                                <span>Pending</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveSupplier(sup.id)}
                          className="text-navy-400 hover:text-red-500 p-1"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-navy-200">
                {/* Category */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Category
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 font-medium text-navy-900 border-r border-navy-200">
                      {sup.category}
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Location
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 text-navy-700 border-r border-navy-200">
                      {sup.location.city}, {sup.location.state}
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Rating & Reviews
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 text-navy-700 border-r border-navy-200">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-navy-900">{sup.rating}</span>
                        <span className="text-navy-400">({sup.reviewCount})</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Min Order (MOQ) */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Minimum Order (MOQ)
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 font-bold text-navy-950 border-r border-navy-200">
                      {sup.moq} units
                    </td>
                  ))}
                </tr>

                {/* Lead Time */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Average Lead Time
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 font-bold text-brand-700 border-r border-navy-200">
                      {sup.avgLeadTimeDays} days
                    </td>
                  ))}
                </tr>

                {/* Response Rate */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Response Rate & Speed
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 text-navy-700 border-r border-navy-200">
                      <span className="font-bold text-emerald-700">{sup.responseRatePct}%</span> ({sup.avgResponseTimeHours}h avg)
                    </td>
                  ))}
                </tr>

                {/* Primary Machinery */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Key Machinery
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 text-navy-700 border-r border-navy-200">
                      <p className="font-bold text-navy-950">{sup.machinery[0]?.name}</p>
                      <p className="text-[10px] text-navy-500 mt-0.5">Tolerance: <span className="font-mono text-emerald-700 font-bold">{sup.machinery[0]?.tolerance}</span></p>
                    </td>
                  ))}
                </tr>

                {/* Certifications */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Certifications
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 text-navy-700 border-r border-navy-200">
                      <div className="flex flex-wrap gap-1">
                        {sup.certifications.map(c => (
                          <span key={c.code} className="px-1.5 py-0.5 bg-navy-100 text-navy-800 rounded text-[10px] font-bold">
                            {c.code}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Materials */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Materials Processed
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 text-navy-700 border-r border-navy-200">
                      <div className="flex flex-wrap gap-1">
                        {sup.materials.slice(0, 3).map(m => (
                          <span key={m} className="px-1.5 py-0.5 bg-navy-50 text-navy-700 rounded text-[10px]">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Direct RFQ Action */}
                <tr>
                  <td className="p-3 font-semibold bg-navy-50/60 text-navy-700 border-r border-navy-200">
                    Action
                  </td>
                  {comparedSuppliers.map(sup => (
                    <td key={sup.id} className="p-3 border-r border-navy-200">
                      <button
                        onClick={() => {
                          onClose();
                          onRequestQuote(sup);
                        }}
                        className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg transition flex items-center justify-center space-x-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Request RFQ</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
