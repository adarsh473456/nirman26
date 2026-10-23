'use client';

import React from 'react';
import { SearchFilterState } from '../types';
import { CATEGORIES, CERTIFICATIONS_LIST } from '../data/defaultCategories';
import { ShieldCheck, Filter, RotateCcw, MapPin, Award, Layers } from 'lucide-react';

interface FilterSidebarProps {
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  totalResults: number;
}

export function FilterSidebar({ filters, setFilters, totalResults }: FilterSidebarProps) {
  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleCertToggle = (certCode: string) => {
    setFilters(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certCode)
        ? prev.certifications.filter(c => c !== certCode)
        : [...prev.certifications, certCode],
    }));
  };

  const handleReset = () => {
    setFilters({
      query: '',
      isAiQuery: false,
      categories: [],
      certifications: [],
      location: 'All Locations',
      verifiedOnly: false,
      materials: [],
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.certifications.length > 0 ||
    filters.location !== 'All Locations' ||
    filters.verifiedOnly ||
    filters.query.length > 0;

  return (
    <aside className="bg-white rounded-xl border border-navy-200 shadow-card p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-navy-100">
        <div className="flex items-center space-x-2 text-navy-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Refine Suppliers</span>
          <span className="text-xs font-normal text-navy-500">({totalResults} match)</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs font-medium text-brand-600 hover:text-brand-800 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Trust & Verification Wedge */}
      <div className="bg-verified-50/70 border border-emerald-200 rounded-lg p-3">
        <label className="flex items-start space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded text-emerald-600 border-emerald-300 focus:ring-emerald-500"
          />
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Badges Only</span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-tight">
              Backed by verified GST & physical factory audit report.
            </p>
          </div>
        </label>
      </div>

      {/* Manufacturing Categories */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-600 flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-navy-400" />
          <span>Manufacturing Process</span>
        </h3>
        <div className="space-y-1.5">
          {CATEGORIES.map(category => (
            <label
              key={category}
              className="flex items-center space-x-2 text-xs text-navy-800 hover:text-navy-950 cursor-pointer py-1"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="h-4 w-4 rounded text-brand-600 border-navy-300 focus:ring-brand-500"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-600 flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-navy-400" />
          <span>Manufacturing Hub</span>
        </h3>
        <select
          value={filters.location}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          className="w-full text-xs bg-navy-50 border border-navy-300 rounded-lg p-2 text-navy-900 focus:ring-2 focus:ring-brand-500 focus:bg-white"
        >
          <option value="All Locations">All Hubs (India)</option>
          <option value="Bangalore">Bangalore (Karnataka)</option>
          <option value="Pune">Pune (Maharashtra)</option>
          <option value="Chennai">Chennai (Tamil Nadu)</option>
          <option value="Hyderabad">Hyderabad (Telangana)</option>
          <option value="Coimbatore">Coimbatore (Tamil Nadu)</option>
        </select>
      </div>

      {/* Certifications Filter */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-600 flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-navy-400" />
          <span>Standards & Certifications</span>
        </h3>
        <div className="space-y-1.5">
          {CERTIFICATIONS_LIST.map(cert => (
            <label
              key={cert.code}
              className="flex items-center space-x-2 text-xs text-navy-800 hover:text-navy-950 cursor-pointer py-0.5"
            >
              <input
                type="checkbox"
                checked={filters.certifications.includes(cert.code)}
                onChange={() => handleCertToggle(cert.code)}
                className="h-4 w-4 rounded text-brand-600 border-navy-300 focus:ring-brand-500"
              />
              <span className="font-medium">{cert.code}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
