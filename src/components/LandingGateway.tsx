'use client';

import React, { useState, useEffect } from 'react';
import { UserRole, AppTheme, UserProfile, Supplier } from '../types';
import { BlackHoleHeroSection } from './ui/blackhole-hero-section';
import { DotPattern } from './ui/dot-pattern';
import LoginOne from './ui/login-1';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Building2,
  UserCircle2,
  ShieldAlert,
  Cpu,
  Boxes,
  Microchip,
  CheckCircle2,
  FileText,
  Clock,
  Sun,
  Moon
} from 'lucide-react';

interface LandingGatewayProps {
  onAuthenticate: (role: UserRole, profile?: Partial<UserProfile>, supplierId?: string) => void;
  onOpenSupplierRegistration: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
  suppliers: Supplier[];
}

function useNarrow(query = "(max-width: 1024px)") {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const sync = () => setNarrow(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, [query]);
  return narrow;
}

export function LandingGateway({
  onAuthenticate,
  onOpenSupplierRegistration,
  theme,
  onToggleTheme,
  suppliers,
}: LandingGatewayProps) {
  const narrow = useNarrow();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAuthTrigger = (role: UserRole, profile?: Partial<UserProfile>, supplierId?: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      onAuthenticate(role, profile, supplierId);
    }, 400);
  };

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-brand-500 selection:text-white relative overflow-hidden flex flex-col transition-all duration-500 ${isTransitioning ? 'opacity-80 scale-[0.98]' : 'opacity-100 scale-100'}`}>

      {/* Dynamic Black Hole Curved-Spacetime Raytracer Canvas Hero Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BlackHoleHeroSection
          focus={narrow ? [0.5, 0.75] : [0.72, 0.45]}
          scrim={narrow ? "top" : "none"}
          scrimStrength={0.65}
          distance={22}
          elevation={narrow ? -7 : -5.0}
          fov={narrow ? 56 : 40}
          glow={narrow ? 0.95 : 1.3}
          steps={narrow ? 180 : 260}
          resolution={narrow ? 0.6 : 0.75}
          midColor="#38BDF8"
          coolColor="#0284C7"
          hotColor="#FFFBEB"
          starBrightness={0.8}
        />
        <DotPattern className="opacity-15" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur-md bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Nirman Logo + Brand Header */}
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <img
                src="/constellar-logo.png"
                alt="NIRMAN Logo"
                className={`w-11 h-11 object-contain transition-all duration-700 ${isTransitioning ? 'animate-constellar-roll' : 'animate-constellar-orbit'}`}
              />
            </div>
            <div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-wider text-white">NIRMAN</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-brand-950/80 text-brand-300 border border-brand-400/40 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                  OS Discovery
                </span>
              </div>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-white/50">
                Innovate. Connect. Build.
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-amber-400 transition backdrop-blur-md"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-300" />}
            </button>

            <button
              onClick={() => handleAuthTrigger('buyer', { name: 'Guest Sourcing Officer', email: 'guest@nirman.demo', company: 'Global Precision OEM', role: 'buyer' })}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(2,132,199,0.4)] transition flex items-center space-x-1.5 border border-brand-300/30"
            >
              <span>Explore as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area: Standard-Ratio Compact Login on Left + Features on Right */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center justify-center">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">

          {/* LEFT SIDE: Standard Ratio Compact Login/Register Card */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-start flex-shrink-0">
            <LoginOne
              onAuthenticate={handleAuthTrigger}
              onOpenSupplierRegistration={onOpenSupplierRegistration}
            />
          </div>

          {/* RIGHT SIDE: Nirman Brand, Tagline & Features with visible Black Hole Disc */}
          <div className="flex-1 space-y-6 text-left max-w-2xl">

            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-brand-400/30 text-brand-300 text-xs font-bold shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
              <span>Next-Gen Operating System for Precision Sourcing</span>
            </div>

            {/* Headline with Brand Tagline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Precision Supplier <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-amber-300 drop-shadow-[0_0_35px_rgba(56,189,248,0.5)]">
                  Discovery & Sourcing
                </span>
              </h1>
              <p className="text-sm sm:text-lg font-bold tracking-wide text-brand-300/95 pt-1 drop-shadow-md">
                Innovate. Connect. Build.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal drop-shadow-md">
              Find 5-axis CNC machine shops, sheet metal laser fabricators, cleanroom molders, and PCBA plants verified with 100% GST checks, on-site physical factory audits, and certified machine envelopes.
            </p>

            {/* 4 Nirman Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/15 hover:border-brand-400/50 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition flex items-start space-x-3 group">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-400/30 text-brand-300 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">AI Plain-English Search</h4>
                  <p className="text-[11px] text-white/60 mt-0.5">Understands materials, tolerances, and regional hubs instantly.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/15 hover:border-emerald-400/50 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition flex items-start space-x-3 group">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">Verified Badge with Teeth</h4>
                  <p className="text-[11px] text-white/60 mt-0.5">Backed by GST registration and on-site physical audits.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/15 hover:border-purple-400/50 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition flex items-start space-x-3 group">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">Machine-Level Metrology</h4>
                  <p className="text-[11px] text-white/60 mt-0.5">5-axis envelopes, Zeiss CMM inspection, and ±0.002mm limits.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/15 hover:border-amber-400/50 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition flex items-start space-x-3 group">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">RFQ to Order Tracking</h4>
                  <p className="text-[11px] text-white/60 mt-0.5">Direct quotes, tooling breakdown, and live dispatch logs.</p>
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="pt-2 border-t border-white/10 flex items-center space-x-6 text-xs text-white/70">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-white">{suppliers.length} Verified Plants Live</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>&lt; 2.4 Hrs Avg Response</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-md py-5 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex items-center space-x-2">
            <span className="font-black text-white">NIRMAN</span>
            <span>•</span>
            <span>Innovate. Connect. Build.</span>
            <span>•</span>
            <span>Verified Manufacturing Ecosystem</span>
          </div>

          <div className="flex items-center space-x-4 font-semibold">
            <span className="text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>GST & Audit Verified</span>
            </span>
            <span>•</span>
            <span>Bangalore · Pune · Chennai · Hyderabad Hubs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
