'use client';

import React, { useState } from 'react';
import { Supplier, Certification, Machinery } from '../types';
import { api } from '../lib/api';
import {
  Building2,
  ShieldCheck,
  X,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  Wrench,
  Award,
  Layers,
  MapPin,
  Lock,
  Mail,
  Plus,
  Trash2,
  Sparkles,
  UserCircle2
} from 'lucide-react';
import { CATEGORIES, CERTIFICATIONS_LIST, POPULAR_MATERIALS } from '../data/defaultCategories';

interface SupplierAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  onLoginSupplier: (supplierId: string) => void;
  onRegisterSupplier: (newSupplier: Supplier) => void;
}

export function SupplierAuthModal({
  isOpen,
  onClose,
  suppliers,
  onLoginSupplier,
  onRegisterSupplier,
}: SupplierAuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [selectedPresetSupplierId, setSelectedPresetSupplierId] = useState(suppliers[0]?.id || 'sup-001');

  // Registration wizard step (1 to 4)
  const [regStep, setRegStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Step 1: Legal Identity & Company
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [legalName, setLegalName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [country, setCountry] = useState('India');
  const [establishedYear, setEstablishedYear] = useState(2018);
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');

  // Step 2: Capabilities
  const [category, setCategory] = useState<Supplier['category']>('CNC Machining');
  const [subcategories, setSubcategories] = useState<string>('5-Axis CNC Milling, Precision Turning');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Aluminum 6061-T6', 'Stainless Steel 316L']);
  const [moq, setMoq] = useState(10);
  const [avgLeadTimeDays, setAvgLeadTimeDays] = useState(14);
  const [facilitySizeSqFt, setFacilitySizeSqFt] = useState(25000);
  const [employeeCount, setEmployeeCount] = useState('50-80');
  const [overview, setOverview] = useState('');

  // Step 3: Machinery
  const [machineryList, setMachineryList] = useState<Machinery[]>([
    {
      id: 'm-new-1',
      name: 'High-Precision 5-Axis Machining Center',
      category: '5-Axis CNC Milling',
      model: 'DMG Mori DMU 50',
      makeYear: 2023,
      tolerance: '±0.005 mm',
      workingArea: '650 x 520 x 475 mm',
    },
  ]);
  const [newMachineName, setNewMachineName] = useState('');
  const [newMachineModel, setNewMachineModel] = useState('');
  const [newMachineTolerance, setNewMachineTolerance] = useState('±0.005 mm');

  // Step 4: Certifications
  const [selectedCertCodes, setSelectedCertCodes] = useState<string[]>(['ISO 9001:2015']);
  const [factoryHeroUrl, setFactoryHeroUrl] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const handleAddMachine = () => {
    if (!newMachineName.trim()) return;
    setMachineryList(prev => [
      ...prev,
      {
        id: `m-new-${prev.length + 1}`,
        name: newMachineName,
        category: category,
        model: newMachineModel || 'Industrial CNC',
        makeYear: 2023,
        tolerance: newMachineTolerance || '±0.01 mm',
        workingArea: '800 x 500 x 400 mm',
      },
    ]);
    setNewMachineName('');
    setNewMachineModel('');
  };

  const handleRemoveMachine = (id: string) => {
    setMachineryList(prev => prev.filter(m => m.id !== id));
  };

  const handleToggleMaterial = (mat: string) => {
    setSelectedMaterials(prev =>
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const handleToggleCert = (code: string) => {
    setSelectedCertCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSupplier(selectedPresetSupplierId);
    onClose();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !gstNumber.trim()) return;

    const certs: Certification[] = selectedCertCodes.map((code, idx) => ({
      id: `c-new-${idx}`,
      name: CERTIFICATIONS_LIST.find(cl => cl.code === code)?.name || 'Quality Management System',
      code,
      issuer: 'TÜV / BSI Group',
      validUntil: '2028-06-30',
      verified: false,
    }));

    try {
      const createdSupplier = await api.createSupplier({
        company_name: name,
        tagline: tagline || `${category} Specialist with Precision Manufacturing Capabilities`,
        overview: overview || `${name} is an advanced manufacturing facility providing ${category} services with strict quality control.`,
        category,
        subcategories: subcategories.split(',').map(s => s.trim()).filter(Boolean),
        capabilities: subcategories.split(',').map(s => s.trim()).filter(Boolean),
        materials: selectedMaterials.length > 0 ? selectedMaterials : ['Aluminum 6061-T6'],
        certifications: certs,
        machinery: machineryList,
        images: {
          logo: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=120&h=120&fit=crop&crop=faces',
          hero: factoryHeroUrl,
          facility: [
            factoryHeroUrl,
            'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
          ],
          samples: [
            'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&auto=format&fit=crop&q=80',
          ],
        },
        contact: {
          contactPerson: contactPerson || 'Plant Operations Head',
          title: 'Managing Director',
          email: contactEmail || 'sourcing@' + name.toLowerCase().replace(/\s+/g, '') + '.com',
          phone: contactPhone || '+91 80 4123 9900',
          website: website || 'https://' + name.toLowerCase().replace(/\s+/g, '') + '.example.com',
          address: address || `${city}, ${state}, ${country}`,
        },
        city,
        state,
        country,
        gst_number: gstNumber,
        registered_legal_name: legalName || name,
        employee_count: employeeCount,
        established_year: Number(establishedYear),
        moq: Math.max(1, Number(moq)),
        avg_lead_time_days: Math.max(1, Number(avgLeadTimeDays)),
      });

      onRegisterSupplier(createdSupplier as Supplier);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onLoginSupplier(createdSupplier.id);
        onClose();
      }, 1800);
    } catch (error) {
      console.error('Failed to register supplier:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-navy-200 overflow-hidden max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white p-6 relative border-b border-navy-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-navy-800/80 hover:bg-navy-700 text-navy-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">Supplier Enterprise Portal</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-700/60">
                  Global Access
                </span>
              </div>
              <p className="text-xs text-navy-300 mt-0.5">
                Join our verified supplier directory or manage your plant profile and incoming RFQs.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs (Login vs New Supplier Registration) */}
          <div className="mt-5 flex p-1 bg-navy-950 rounded-xl border border-navy-800 text-xs font-semibold">
            <button
              onClick={() => { setAuthMode('login'); setRegStep(1); }}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${authMode === 'login'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-navy-300 hover:text-white'
                }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Supplier Login</span>
            </button>

            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${authMode === 'register'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-navy-300 hover:text-white'
                }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Supplier Facility</span>
            </button>
          </div>
        </div>

        {/* Success Splash */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-navy-950">Facility Registered Successfully!</h3>
            <p className="text-xs text-navy-600 max-w-md mx-auto">
              Your company profile and machinery setup have been added to the Supplier Discovery OS. Your profile is queued for Admin GST Verification. Logging you in now...
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1 text-xs">
            {/* LOGIN VIEW */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto py-4">
                <div>
                  <label className="block text-navy-800 font-bold mb-1">
                    Select Registered Supplier Account (Demo Switcher)
                  </label>
                  <select
                    value={selectedPresetSupplierId}
                    onChange={(e) => setSelectedPresetSupplierId(e.target.value)}
                    className="w-full p-3 bg-navy-50 border border-navy-300 rounded-xl text-navy-950 font-bold text-xs focus:ring-2 focus:ring-brand-500"
                  >
                    {suppliers.map(sup => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name} ({sup.category} • {sup.location.city}) {sup.verified ? '✓ Verified' : '⏳ Pending'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-navy-800 font-bold mb-1">
                    Supplier Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-navy-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      defaultValue="sourcing@precisiontech-dyn.com"
                      placeholder="corporate.email@company.com"
                      className="w-full pl-9 p-3 bg-navy-50 border border-navy-300 rounded-xl text-navy-950 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-navy-800 font-bold mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-navy-400 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      defaultValue="••••••••••••"
                      placeholder="Enter portal password"
                      className="w-full pl-9 p-3 bg-navy-50 border border-navy-300 rounded-xl text-navy-950 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-navy-500 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                    <span>Keep me logged in</span>
                  </label>
                  <button type="button" className="text-brand-600 hover:underline">Forgot password?</button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm mt-4"
                >
                  <span>Sign In to Supplier Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* NEW SUPPLIER MULTI-STEP REGISTRATION WIZARD */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                {/* Step Indicators */}
                <div className="flex items-center justify-between px-2 pb-4 border-b border-navy-200">
                  {[
                    { num: 1, label: 'Company & GST' },
                    { num: 2, label: 'Capabilities' },
                    { num: 3, label: 'Machinery' },
                    { num: 4, label: 'Quality Certs' },
                  ].map((s) => (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setRegStep(s.num)}
                      className={`flex items-center space-x-2 text-xs font-bold transition ${regStep === s.num
                        ? 'text-brand-600'
                        : regStep > s.num
                          ? 'text-emerald-600'
                          : 'text-navy-400'
                        }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${regStep === s.num
                        ? 'bg-brand-600 text-white'
                        : regStep > s.num
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-navy-100 text-navy-500'
                        }`}>
                        {regStep > s.num ? '✓' : s.num}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                  ))}
                </div>

                {/* STEP 1: Legal Identity & Company Info */}
                {regStep === 1 && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-navy-800 font-bold mb-1">Company Trade Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. TitanForge Precision Aero"
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-navy-800 font-bold mb-1">Registered Legal Entity Name *</label>
                        <input
                          type="text"
                          required
                          value={legalName}
                          onChange={(e) => setLegalName(e.target.value)}
                          placeholder="e.g. TitanForge Aero Technologies Pvt Ltd"
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-navy-800 font-bold mb-1">GSTIN / Business Registration ID *</label>
                        <input
                          type="text"
                          required
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          placeholder="e.g. 29ABCDE9988F1Z9"
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg font-mono text-navy-950 font-bold focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-navy-800 font-bold mb-1">Tagline / Core Value Proposition</label>
                        <input
                          type="text"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          placeholder="e.g. AS9100 Certified Multi-Axis Machining"
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-navy-800 font-bold mb-1">Manufacturing Hub (City)</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Bangalore"
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-navy-800 font-bold mb-1">State / Province</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Karnataka"
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-navy-800 font-bold mb-1">Est. Year</label>
                        <input
                          type="number"
                          value={establishedYear}
                          onChange={(e) => setEstablishedYear(Number(e.target.value))}
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => { if (name && gstNumber) setRegStep(2); }}
                        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5"
                      >
                        <span>Next: Capabilities</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Manufacturing Capabilities & Process */}
                {regStep === 2 && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div>
                      <label className="block text-navy-800 font-bold mb-1">Primary Manufacturing Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 font-bold text-xs"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-navy-800 font-bold mb-1">Subcategories / Core Processes (Comma-separated)</label>
                      <input
                        type="text"
                        value={subcategories}
                        onChange={(e) => setSubcategories(e.target.value)}
                        placeholder="5-Axis Milling, Wire EDM, Precision Grinding"
                        className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-navy-800 font-bold mb-1">Materials Processed in Plant</label>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_MATERIALS.map(mat => (
                          <button
                            type="button"
                            key={mat}
                            onClick={() => handleToggleMaterial(mat)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${selectedMaterials.includes(mat)
                              ? 'bg-brand-50 text-brand-700 border-brand-300'
                              : 'bg-white text-navy-600 border-navy-200'
                              }`}
                          >
                            {mat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-navy-800 font-bold mb-1">Min Order (MOQ)</label>
                        <input
                          type="number"
                          value={moq}
                          onChange={(e) => setMoq(Number(e.target.value))}
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-navy-800 font-bold mb-1">Avg Lead Time (Days)</label>
                        <input
                          type="number"
                          value={avgLeadTimeDays}
                          onChange={(e) => setAvgLeadTimeDays(Number(e.target.value))}
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-navy-800 font-bold mb-1">Plant Area (sq.ft)</label>
                        <input
                          type="number"
                          value={facilitySizeSqFt}
                          onChange={(e) => setFacilitySizeSqFt(Number(e.target.value))}
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-navy-800 font-bold mb-1">Workforce Count</label>
                        <input
                          type="text"
                          value={employeeCount}
                          onChange={(e) => setEmployeeCount(e.target.value)}
                          placeholder="50-80"
                          className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setRegStep(1)}
                        className="px-4 py-2 text-navy-600 font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegStep(3)}
                        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5"
                      >
                        <span>Next: Machinery</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Machinery & Equipment Setup */}
                {regStep === 3 && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="p-3 bg-navy-50 rounded-xl border border-navy-200 space-y-2">
                      <h4 className="font-bold text-navy-900 text-xs">Add Core Machine / Metrology Tool</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={newMachineName}
                          onChange={(e) => setNewMachineName(e.target.value)}
                          placeholder="Machine Name (e.g. Mazak CNC)"
                          className="p-2 bg-white border border-navy-300 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={newMachineModel}
                          onChange={(e) => setNewMachineModel(e.target.value)}
                          placeholder="Model (e.g. Integrex i-200)"
                          className="p-2 bg-white border border-navy-300 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={newMachineTolerance}
                          onChange={(e) => setNewMachineTolerance(e.target.value)}
                          placeholder="Tolerance (e.g. ±0.003 mm)"
                          className="p-2 bg-white border border-navy-300 rounded-lg text-xs font-mono font-bold text-emerald-700"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddMachine}
                        className="px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-md text-xs flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Machine to List</span>
                      </button>
                    </div>

                    {/* Machine List */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-navy-800 text-xs">Registered Equipment ({machineryList.length})</h4>
                      {machineryList.map(m => (
                        <div key={m.id} className="p-2.5 bg-white border border-navy-200 rounded-lg flex items-center justify-between shadow-2xs">
                          <div>
                            <span className="font-bold text-navy-950">{m.name}</span>
                            <span className="text-navy-500 ml-2">({m.model}) • Tolerance: <strong className="font-mono text-emerald-700">{m.tolerance}</strong></span>
                          </div>
                          {machineryList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMachine(m.id)}
                              className="text-navy-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setRegStep(2)}
                        className="px-4 py-2 text-navy-600 font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegStep(4)}
                        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5"
                      >
                        <span>Next: Quality Certifications</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Quality Certifications & Final Submit */}
                {regStep === 4 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-navy-800 font-bold mb-1.5">
                        Active Quality & Industry Certifications
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CERTIFICATIONS_LIST.map(cert => (
                          <label
                            key={cert.code}
                            className={`p-2.5 rounded-lg border flex items-center space-x-2.5 cursor-pointer transition ${selectedCertCodes.includes(cert.code)
                              ? 'bg-brand-50 border-brand-400 text-brand-950 font-bold'
                              : 'bg-navy-50/50 border-navy-200 text-navy-700'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCertCodes.includes(cert.code)}
                              onChange={() => handleToggleCert(cert.code)}
                              className="h-4 w-4 rounded text-brand-600"
                            />
                            <div>
                              <div className="font-extrabold text-xs">{cert.code}</div>
                              <div className="text-[10px] text-navy-500">{cert.name}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-navy-800 font-bold mb-1">Factory Facility Photo URL</label>
                      <input
                        type="text"
                        value={factoryHeroUrl}
                        onChange={(e) => setFactoryHeroUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-2.5 bg-navy-50 border border-navy-300 rounded-lg text-navy-950 text-xs"
                      />
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>
                        Upon registration, your GST will be verified and your profile will be queued for the <strong>Verified Supplier Badge</strong> audit.
                      </span>
                    </div>

                    <div className="pt-2 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setRegStep(3)}
                        className="px-4 py-2 text-navy-600 font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs shadow-lg transition flex items-center space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete Registration & Open Portal</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
