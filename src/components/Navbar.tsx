'use client';

import React, { FormEvent } from 'react';
import { UserRole, AppTheme, UserProfile } from '../types';
import {
  ShieldCheck,
  Search,
  FileText,
  Bookmark,
  Layers,
  UserCircle2,
  Building2,
  ArrowRightLeft,
  Settings,
  Sun,
  Moon,
  LogOut,
  MapPin,
  ChevronDown,
  Globe2,
} from 'lucide-react';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  rfqCount: number;
  compareCount: number;
  ordersCount: number;
  theme: AppTheme;
  onToggleTheme: () => void;
  onOpenComparison: () => void;
  onOpenSupplierAuth: () => void;
  onOpenSettings: () => void;
  onExitToLanding?: () => void;
  currentUser?: UserProfile | null;
  activeSupplierName?: string;
  query?: string;
  onQueryChange?: (query: string) => void;
  onSearch?: () => void;
  location?: string;
}

export function Navbar({
  role,
  activeTab,
  setActiveTab,
  savedCount,
  rfqCount,
  compareCount,
  ordersCount,
  theme,
  onToggleTheme,
  onOpenComparison,
  onOpenSupplierAuth,
  onOpenSettings,
  onExitToLanding,
  currentUser,
  activeSupplierName,
  query = '',
  onQueryChange,
  onSearch,
  location = 'All Locations',
}: NavbarProps) {
  const navItems = role === 'buyer'
    ? [
        { label: 'Discover suppliers', tab: 'discover', icon: Search },
        { label: 'My RFQs', tab: 'my-rfqs', icon: FileText, badge: rfqCount },
        { label: 'Saved suppliers', tab: 'bookmarks', icon: Bookmark, badge: savedCount },
        { label: 'Sourcing overview', tab: 'dashboard-analytics', icon: Layers },
      ]
    : role === 'supplier'
      ? [
          { label: 'Company profile', tab: 'profile-management', icon: Building2 },
          { label: 'RFQ inbox', tab: 'incoming-rfqs', icon: FileText, badge: rfqCount },
          { label: 'Quotes', tab: 'quotation-bidding', icon: Layers },
          { label: 'Facility', tab: 'facility-showcase', icon: ShieldCheck },
        ]
      : [
          { label: 'Overview', tab: 'platform-analytics', icon: Layers },
          { label: 'Supplier directory', tab: 'supplier-directory', icon: Building2 },
          { label: 'Verification', tab: 'verification-auditing', icon: ShieldCheck },
          { label: 'Global RFQs', tab: 'global-rfqs', icon: FileText, badge: rfqCount },
          { label: 'Marketplace', tab: 'discover', icon: Search },
        ];

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveTab('discover');
    onSearch?.();
  };

  const displayName = activeSupplierName || currentUser?.company || currentUser?.name || 'My account';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#030712] text-[#F5F7EB] shadow-xl">
      <div className="bg-[#061122] text-[10px] text-slate-200 sm:text-[11px]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2"><Globe2 className="h-3.5 w-3.5 text-sky-300" />Space industry sourcing network</span>
          <button onClick={onOpenSupplierAuth} className="font-bold text-sky-300 transition hover:text-white">List your capabilities <span aria-hidden="true">→</span></button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:flex-nowrap lg:px-8" style={{ background: 'linear-gradient(135deg, #093566 0%, #001D3C 100%)' }}>
        <button onClick={() => setActiveTab('discover')} className="flex shrink-0 items-center" aria-label="CENALPH marketplace home">
          <img src="/cenalph-orbit-logo.png" alt="CENALPH" className="h-10 w-[124px] object-contain object-left sm:h-11 sm:w-[145px]" />
        </button>

        <button onClick={() => setActiveTab('discover')} className="hidden shrink-0 items-center gap-2 rounded-lg border-r border-white/15 px-3 py-2 text-left text-xs text-slate-300 lg:flex">
          <MapPin className="h-4 w-4 text-[#0EA5FF]" />
          <span><span className="block text-[9px] font-bold uppercase tracking-wide text-slate-400">Sourcing region</span><span className="font-bold text-white">{location === 'All Locations' ? 'Global' : location}</span></span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        <form onSubmit={submitSearch} className="order-3 flex h-11 min-w-[230px] flex-1 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-inner focus-within:border-sky-700 focus-within:ring-2 focus-within:ring-sky-100 lg:order-none">
          <label className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <Search className="h-4 w-4 shrink-0 text-sky-800" />
            <input value={query} onChange={(event) => onQueryChange?.(event.target.value)} placeholder="Search components, materials, suppliers..." className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
          </label>
          {query && <button type="button" onClick={() => onQueryChange?.('')} aria-label="Clear search" className="px-2 text-lg leading-none text-slate-400 hover:text-slate-700">×</button>}
          <button type="submit" aria-label="Search marketplace" className="flex w-12 shrink-0 items-center justify-center bg-[#0EA5FF] text-white transition hover:bg-[#0066FF]"><Search className="h-5 w-5" /></button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          {role === 'buyer' && compareCount > 0 && <button onClick={onOpenComparison} className="hidden items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 sm:inline-flex"><ArrowRightLeft className="h-4 w-4 text-[#0EA5FF]" /><span>Compare</span><span className="rounded-full bg-sky-100 px-1.5 text-[10px] text-sky-800">{compareCount}</span></button>}
          <button onClick={() => setActiveTab(role === 'supplier' ? 'incoming-rfqs' : 'my-rfqs')} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10" aria-label="RFQ inbox"><FileText className="h-5 w-5" />{rfqCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white">{rfqCount}</span>}</button>
          <button onClick={onToggleTheme} className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 sm:flex" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{theme === 'dark' ? <Sun className="h-4 w-4 text-[#0EA5FF]" /> : <Moon className="h-4 w-4" />}</button>
          <button onClick={onOpenSettings} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10" aria-label="Settings"><Settings className="h-4 w-4" />{ordersCount > 0 && <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-sky-600" />}</button>
          <div className="hidden max-w-[140px] border-l border-white/15 pl-3 xl:block"><span className="block truncate text-xs font-extrabold text-white">{displayName}</span><span className="block text-[10px] capitalize text-slate-400">{role} account</span></div>
          {onExitToLanding && <button onClick={onExitToLanding} className="flex h-9 items-center gap-1.5 rounded-lg border border-white/20 px-2.5 text-xs font-bold text-slate-200 transition hover:border-rose-300/40 hover:bg-rose-500/10 hover:text-rose-200"><UserCircle2 className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></button>}
        </div>
      </div>

      <nav aria-label="Marketplace navigation" className="border-t border-white/10 bg-[#061122]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto px-3 py-1.5 sm:px-6 lg:px-8">
          {navItems.map(({ label, tab, icon: Icon, badge }) => <button key={tab} onClick={() => setActiveTab(tab)} className={'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ' + (activeTab === tab ? 'bg-[#0B1E3A] text-[#F5F7EB] shadow-sm ring-1 ring-white/15' : 'text-slate-300 hover:bg-white/10 hover:text-white')}><Icon className="h-4 w-4" />{label}{badge ? <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[9px] font-black text-sky-800">{badge}</span> : null}</button>)}
          {role === 'buyer' && savedCount > 0 && <span className="ml-auto hidden shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-400 md:inline-flex"><Bookmark className="h-3.5 w-3.5" />{savedCount} saved</span>}
        </div>
      </nav>
    </header>
  );
}