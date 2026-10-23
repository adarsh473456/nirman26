'use client';

import React, { FormEvent, useState } from 'react';
import { Activity, ArrowRight, ArrowUpRight, Boxes, CheckCircle2, ChevronRight, Cpu, FileText, Globe2, Layers, LockKeyhole, LucideIcon, MapPin, Orbit, PhoneCall, Rocket, Search, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { UserRole, UserProfile, Supplier } from '../types';
import LoginOne from './ui/login-1';

interface MarketplaceLandingProps {
  onAuthenticate: (role: UserRole, profile?: Partial<UserProfile>, supplierId?: string) => void;
  onOpenSupplierRegistration: () => void;
  onExplore: (query: string) => void;
  onPostRequirement: () => void;
  suppliers: Supplier[];
}

const categories = [
  { name: 'Space-grade materials', detail: 'Alloys, composites & thermal materials', query: 'Titanium', icon: Layers, tone: 'bg-sky-50 text-sky-700' },
  { name: 'Satellite subsystems', detail: 'Avionics, power & communications', query: 'Electronics', icon: Cpu, tone: 'bg-indigo-50 text-indigo-700' },
  { name: 'Precision manufacturing', detail: 'CNC, additive & fabrication', query: 'CNC Machining', icon: Wrench, tone: 'bg-sky-100 text-sky-800' },
  { name: 'Test & qualification', detail: 'Environmental, vibration & EMC', query: 'Testing', icon: Activity, tone: 'bg-emerald-50 text-emerald-700' },
  { name: 'Propulsion & launch', detail: 'Thrusters, tanks & launch systems', query: 'Casting', icon: Rocket, tone: 'bg-rose-50 text-rose-700' },
  { name: 'Mission & ground systems', detail: 'Ground support, software & services', query: 'Electronics', icon: Globe2, tone: 'bg-violet-50 text-violet-700' },
];

type MarketplaceIcon = LucideIcon;
type CatalogItem = { name: string; spec: string; icon: MarketplaceIcon };
type CatalogRow = { title: string; eyebrow: string; query: string; detail: string; items: CatalogItem[] };

const rows: CatalogRow[] = [
  {
    title: 'Materials for spacecraft structures', eyebrow: 'MATERIALS & STRUCTURES', query: 'Titanium',
    detail: 'Source alloys, composites and structural stock for flight and ground hardware.',
    items: [
      { name: 'Aluminium alloy plate & billet', spec: '6061-T6 · 7075 · custom cut', icon: Layers },
      { name: 'Titanium stock & fasteners', spec: 'Ti-6Al-4V · bar · plate · hardware', icon: Boxes },
      { name: 'Carbon-fibre composite panels', spec: 'CFRP · laminate · sandwich core', icon: Orbit },
      { name: 'Thermal and insulation materials', spec: 'MLI · blankets · coatings', icon: Activity },
      { name: 'Precision machined structures', spec: 'Brackets · housings · frames', icon: Wrench },
    ],
  },
  {
    title: 'Satellite electronics & subsystems', eyebrow: 'SPACECRAFT SYSTEMS', query: 'Electronics',
    detail: 'Discover suppliers for onboard electronics, power, sensing and communications.',
    items: [
      { name: 'Flight electronics & avionics', spec: 'OBC · power boards · harnesses', icon: Cpu },
      { name: 'Solar arrays & power systems', spec: 'Cells · panels · battery modules', icon: Activity },
      { name: 'RF, antenna & communication', spec: 'Antennas · RF chains · transceivers', icon: Globe2 },
      { name: 'Attitude control components', spec: 'Reaction wheels · sensors · actuators', icon: Orbit },
      { name: 'Payload and optical assemblies', spec: 'Optics · instruments · enclosures', icon: Boxes },
    ],
  },
  {
    title: 'Engineering, test & manufacturing', eyebrow: 'CAPABILITIES & SERVICES', query: 'CNC Machining',
    detail: 'Match technical requirements to manufacturing and qualification capabilities.',
    items: [
      { name: '5-axis precision machining', spec: 'CNC milling · turning · CMM', icon: Wrench },
      { name: 'PCB and high-reliability assembly', spec: 'SMT · rigid-flex · inspection', icon: Cpu },
      { name: 'Thermal-vacuum test services', spec: 'Chambers · cycling · outgassing', icon: Activity },
      { name: 'Vibration and shock testing', spec: 'Sine · random · pyroshock', icon: Boxes },
      { name: 'Cleanroom integration & AIT', spec: 'Assembly · integration · test', icon: ShieldCheck },
    ],
  },
];

export function MarketplaceLanding({ onAuthenticate, onOpenSupplierRegistration, onExplore, onPostRequirement, suppliers }: MarketplaceLandingProps) {
  const [query, setQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onExplore(query.trim());
  };

  return (
    <div className="min-h-screen text-slate-900" style={{ background: 'linear-gradient(135deg, #093566 0%, #001D3C 100%)' }}>
      <div className="border-b border-white/10 bg-[#030712] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-[10px] sm:px-6 sm:text-[11px] lg:px-8">
          <p className="flex items-center gap-2 text-slate-300"><Globe2 className="h-3.5 w-3.5 text-[#0EA5FF]" /><span className="font-bold uppercase tracking-[0.16em]">CENALPH Orbital Supply Network</span></p>
          <p className="hidden text-slate-400 sm:block">COMPONENTS · MATERIALS · QUALIFICATION</p>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#030712]/95 text-white shadow-xl shadow-[#020817]/20 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex min-w-0 shrink-0 items-center" aria-label="CENALPH home">
            <img src="/cenalph-orbit-logo.png" alt="CENALPH space supply" className="h-12 w-[170px] object-contain object-left sm:h-14 sm:w-[190px]" />
          </a>
          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-slate-300 lg:flex">
            <a href="#categories" className="transition hover:text-[#0EA5FF]">Explore supply</a>
            <a href="#suppliers" className="transition hover:text-[#0EA5FF]">Supplier directory</a>
            <a href="#how-it-works" className="transition hover:text-[#0EA5FF]">How sourcing works</a>
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <button onClick={onOpenSupplierRegistration} className="hidden rounded-xl border border-sky-300/30 px-3.5 py-2.5 text-xs font-bold text-sky-100 transition hover:border-sky-200 hover:bg-white/5 sm:inline-flex">List capabilities</button>
            <button onClick={() => setShowLogin(true)} className="rounded-xl bg-[#0EA5FF] px-4 py-2.5 text-xs font-black text-[#061122] shadow-[0_5px_25px_rgba(14,165,255,0.24)] transition hover:bg-[#0066FF] sm:px-5 sm:text-sm">Sign in <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#030712] text-white">
          <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #85a9ca 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="absolute -right-32 -top-48 h-[570px] w-[570px] rounded-full border border-sky-200/15" />
          <div className="absolute -right-16 -top-32 h-[430px] w-[430px] rounded-full border border-sky-200/15" />
          <div className="absolute right-[9%] top-1/2 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-[#0EA5FF] shadow-[0_0_35px_12px_rgba(14,165,255,0.55)] lg:block" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-[76px]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sky-200"><Sparkles className="h-3.5 w-3.5" />CENALPH · SPACE INDUSTRY NETWORK</div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-[58px]">Build for orbit. <span className="text-[#0EA5FF]">Source on Earth.</span></h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">Find specialist manufacturers, materials and test services for satellites, launch systems and ground infrastructure. Share one requirement and manage every response in one place.</p>
              <form onSubmit={submitSearch} className="mt-8 flex max-w-3xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-3 px-3"><Search className="h-5 w-5 shrink-0 text-sky-700" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search materials, components or capabilities" className="h-12 w-full min-w-0 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                </label>
                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0EA5FF] px-6 text-sm font-black text-[#061122] transition hover:bg-[#0066FF]">Find suppliers <ArrowRight className="h-4 w-4" /></button>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300"><span className="mr-1 font-semibold text-slate-400">Popular:</span>
                {['Satellite structures', 'Carbon-fibre panels', 'Thermal vacuum test', 'Flight electronics'].map((term) => <button key={term} onClick={() => { setQuery(term); onExplore(term); }} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 transition hover:border-sky-300/60 hover:bg-white/10">{term}</button>)}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" />Supplier verification signals</span>
                <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-sky-300" />Contact details stay private</span>
                <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-sky-300" />RFQs and quotes in one workflow</span>
              </div>
            </div>
            <div className="relative hidden min-h-[340px] items-center justify-center lg:flex">
              <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full border border-sky-200/20 bg-sky-100/[0.04]">
                <div className="absolute h-[250px] w-[250px] rounded-full border border-dashed border-sky-200/30" />
                <div className="absolute h-[166px] w-[166px] rounded-full border border-sky-200/30" />
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-sky-400/10 text-sky-200 shadow-[0_0_55px_rgba(56,189,248,0.18)]"><Orbit className="h-16 w-16" strokeWidth={1.1} /></div>
                <div className="absolute left-2 top-14 rounded-2xl border border-white/10 bg-[#18345b]/95 px-3.5 py-3 shadow-xl"><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Mission ready</span><span className="mt-1 block text-xs font-extrabold">Components & materials</span></div>
                <div className="absolute bottom-8 right-0 rounded-2xl border border-white/10 bg-[#18345b]/95 px-3.5 py-3 shadow-xl"><span className="flex items-center gap-2 text-xs font-extrabold"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Technical fit first</span><span className="mt-1 block text-[10px] text-slate-400">Compare compliance and lead time</span></div>
                <div className="absolute right-2 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-100/20 bg-sky-200/10 text-sky-200"><Rocket className="h-5 w-5" /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#061122] text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-slate-100 px-4 py-5 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
            {[
              { value: suppliers.length.toString(), label: 'sample supplier profiles' },
              { value: '6', label: 'space supply categories' },
              { value: 'RFQ', label: 'to quote workflow' },
              { value: 'Private', label: 'buyer & supplier contact' },
            ].map((item) => <div key={item.label} className="px-3 py-3 text-center sm:px-6"><div className="text-lg font-black text-white">{item.value}</div><div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{item.label}</div></div>)}
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0EA5FF]">Explore the supply chain</p><h2 className="mt-2 text-2xl font-black tracking-tight text-[#F5F7EB] sm:text-3xl">Find the right capability for your mission</h2></div>
            <button onClick={() => onExplore('')} className="inline-flex items-center gap-1 text-sm font-bold text-[#0EA5FF] transition hover:text-sky-200">Browse all suppliers <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => { const Icon = category.icon; return (
              <button key={category.name} onClick={() => onExplore(category.query)} className="group flex min-h-[112px] items-center gap-4 rounded-xl border border-slate-700 bg-[#0B1E3A] p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md">
                <span className={'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ' + category.tone}><Icon className="h-6 w-6" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-white">{category.name}</span><span className="mt-1 block text-xs leading-5 text-slate-300">{category.detail}</span></span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-[#0EA5FF]" />
              </button>
            ); })}
          </div>
        </section>

        <section className="py-12" style={{ background: 'linear-gradient(135deg, #093566 0%, #001D3C 100%)' }}>
          <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
            {rows.map((row, rowIndex) => <div key={row.title}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0EA5FF]">{row.eyebrow}</p><h2 className="mt-1.5 text-xl font-black text-[#F5F7EB] sm:text-2xl">{row.title}</h2><p className="mt-1 text-xs text-slate-300 sm:text-sm">{row.detail}</p></div>
                <button onClick={() => onExplore(row.query)} className="inline-flex items-center gap-1 text-xs font-extrabold text-sky-800 transition hover:text-sky-600">Explore this category <ArrowRight className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {row.items.map((item, itemIndex) => {
                  const imageIndex = (rowIndex * 3 + itemIndex) % Math.max(suppliers.length, 1);
                  const supplier = suppliers[imageIndex];
                  const photo = supplier?.images.samples[0] || supplier?.images.hero;
                  const Icon = item.icon;
                  return <button key={item.name} onClick={() => onExplore(row.query)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg">
                    <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#dcecf5] via-[#e8eef7] to-[#f4e8d9] sm:h-32">
                      {photo && <img src={photo} alt="" className="h-full w-full object-cover opacity-80 mix-blend-multiply transition duration-500 group-hover:scale-105" />}
                      <span className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-xl border border-white/70 bg-white/90 text-sky-800 shadow-sm"><Icon className="h-4 w-4" /></span>
                      <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-600">Capability</span>
                    </div>
                    <span className="block p-3"><span className="block min-h-9 text-xs font-extrabold leading-4 text-slate-900">{item.name}</span><span className="mt-1 block min-h-8 text-[10px] leading-4 text-slate-500">{item.spec}</span><span className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-bold text-sky-800">View suppliers <ArrowRight className="h-3.5 w-3.5" /></span></span>
                  </button>;
                })}
              </div>
            </div>)}
          </div>
        </section>

        <section id="suppliers" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0EA5FF]">Supplier directory</p><h2 className="mt-1.5 text-2xl font-black text-[#F5F7EB]">Explore sample supplier capabilities</h2></div><span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-500">Demo profiles · verify before procurement</span></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {suppliers.slice(0, 3).map((supplier) => <article key={supplier.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex h-36 items-center gap-4 bg-slate-100 p-4"><img src={supplier.images.hero} alt="" className="h-full w-32 rounded-xl object-cover" /><div className="min-w-0"><span className={'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-extrabold ' + (supplier.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800')}><ShieldCheck className="h-3 w-3" />{supplier.verified ? 'Profile checks recorded' : 'Review pending'}</span><h3 className="mt-2 line-clamp-2 text-sm font-extrabold text-slate-900">{supplier.name}</h3><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500"><MapPin className="h-3 w-3" />{supplier.location.city}, {supplier.location.state}</p></div></div>
              <div className="p-4"><p className="text-xs font-bold text-slate-800">{supplier.category}</p><p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">{supplier.tagline}</p><div className="mt-3 flex flex-wrap gap-1.5">{supplier.certifications.slice(0, 3).map((cert) => <span key={cert.code} className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600">{cert.code}</span>)}</div><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-[10px] font-semibold text-slate-500">Typical reply: {supplier.avgResponseTimeHours}h</span><button onClick={() => onExplore(supplier.category)} className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-800 hover:text-sky-600">See capabilities <ArrowRight className="h-3.5 w-3.5" /></button></div></div>
            </article>)}
          </div>
        </section>

        <section id="how-it-works" className="bg-[#0B1E3A] py-12 text-white sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:px-8">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-sky-300">A better way to source</p><h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">From requirement to a decision-ready quote.</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-300">Keep technical fit, supplier responses and commercial terms together while your sourcing team stays in control.</p><button onClick={onPostRequirement} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0EA5FF] px-5 py-3 text-sm font-extrabold text-[#F5F7EB] transition hover:bg-[#0066FF]">Start a sourcing request <ArrowRight className="h-4 w-4" /></button></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { step: '01', title: 'Describe the need', body: 'Add material, grade, quantity, qualification and delivery details.', icon: FileText },
                { step: '02', title: 'Route privately', body: 'The platform coordinates enquiries and keeps direct contact details protected.', icon: PhoneCall },
                { step: '03', title: 'Compare responses', body: 'Review technical compliance, documentation, lead time and price together.', icon: CheckCircle2 },
              ].map((item) => { const Icon = item.icon; return <div key={item.step} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-black tracking-widest text-sky-300">{item.step}</span><Icon className="h-5 w-5 text-sky-200" /></div><h3 className="mt-4 text-sm font-extrabold">{item.title}</h3><p className="mt-2 text-xs leading-5 text-slate-300">{item.body}</p></div>; })}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#061122] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="sm:col-span-2"><div className="flex items-center gap-3"><img src="/constellar-logo.png" alt="" className="h-9 w-9 object-contain" /><span className="text-sm font-black tracking-[0.15em]">CONSTELLAR</span></div><p className="mt-3 max-w-md text-xs leading-5 text-slate-400">A supplier discovery and sourcing workspace for the space industry. Search, qualify, request quotes and track progress in one place.</p></div>
          <div><h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">For buyers</h3><button onClick={() => onExplore('')} className="mt-3 block text-left text-xs text-slate-400 hover:text-white">Find suppliers</button><button onClick={onPostRequirement} className="mt-2 block text-left text-xs text-slate-400 hover:text-white">Post a requirement</button></div>
          <div><h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">For suppliers</h3><button onClick={onOpenSupplierRegistration} className="mt-3 block text-left text-xs text-slate-400 hover:text-white">List capabilities</button><button onClick={() => setShowLogin(true)} className="mt-2 block text-left text-xs text-slate-400 hover:text-white">Supplier sign in</button></div>
        </div>
        <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 py-4 text-[10px] text-slate-500 sm:flex-row sm:px-6 lg:px-8"><span>© Constellar · Space industry sourcing</span><span>Supplier examples are demo data. Verification is not a substitute for buyer due diligence.</span></div></div>
      </footer>

      {showLogin && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Sign in">
        <div className="relative w-full max-w-md"><button onClick={() => setShowLogin(false)} aria-label="Close sign in" className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl text-slate-600 shadow-lg transition hover:text-slate-950">×</button><LoginOne onAuthenticate={onAuthenticate} onOpenSupplierRegistration={() => { setShowLogin(false); onOpenSupplierRegistration(); }} /></div>
      </div>}
    </div>
  );
}
