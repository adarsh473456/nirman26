"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Separator } from "./separator";
import { 
  Eye, 
  EyeOff, 
  Github, 
  Chrome, 
  User, 
  Mail, 
  Lock, 
  ArrowRight,
  Building2,
  UserCircle2,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { UserRole, UserProfile } from "../../types";

export interface LoginCardSectionProps {
  onAuthenticate?: (role: UserRole, profile?: Partial<UserProfile>, supplierId?: string) => void;
  onOpenSupplierRegistration?: () => void;
}

export default function LoginCardSection({
  onAuthenticate,
  onOpenSupplierRegistration,
}: LoginCardSectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("buyer");
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("v.mehta@zenithaero.com");
  const [password, setPassword] = useState("••••••••••••");
  const [regName, setRegName] = useState("");
  const [regCompany, setRegCompany] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle monochrome ambient particles
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    type P = { x: number; y: number; v: number; o: number };
    let ps: P[] = [];
    let raf = 0;

    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250,250,250,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    if (newRole === "buyer") setEmail("v.mehta@zenithaero.com");
    else if (newRole === "supplier") setEmail("info@precisiontech-dyn.com");
    else setEmail("compliance@nirman.os");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAuthenticate) return;
    if (selectedRole === "buyer") {
      onAuthenticate("buyer", {
        name: "Vikram Mehta",
        email: email || "v.mehta@zenithaero.com",
        company: "Zenith Aero Robotics",
        role: "buyer",
      });
    } else if (selectedRole === "supplier") {
      onAuthenticate(
        "supplier",
        {
          name: "Rajesh Sharma",
          email: email || "info@precisiontech-dyn.com",
          company: "PrecisionTech Dynamics",
          role: "supplier",
        },
        "sup-001"
      );
    } else {
      onAuthenticate("admin", {
        name: "Platform Auditor",
        email: email || "compliance@nirman.os",
        company: "Nirman Verification Bureau",
        role: "admin",
      });
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAuthenticate) return;
    if (selectedRole === "supplier" && onOpenSupplierRegistration) {
      onOpenSupplierRegistration();
      return;
    }
    onAuthenticate("buyer", {
      name: regName || "New Sourcing Lead",
      email: email || "sourcing@company.com",
      company: regCompany || "AeroTech Industries",
      role: "buyer",
    });
  };

  return (
    <div className="relative w-full flex items-center justify-center p-1">
      <style>{`
        /* Card animation */
        .card-animate {
          opacity: 0;
          transform: translateY(12px);
          animation: fadeUp 0.5s cubic-bezier(.22,.61,.36,1) 0.15s forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Accent lines */
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.5}
        .hline,.vline{position:absolute;background:#27272a}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .5s ease forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .6s ease forwards}
        .hline:nth-child(1){top:18%;animation-delay:.06s}
        .hline:nth-child(2){top:50%;animation-delay:.12s}
        .hline:nth-child(3){top:82%;animation-delay:.18s}
        .vline:nth-child(4){left:22%;animation-delay:.15s}
        .vline:nth-child(5){left:50%;animation-delay:.22s}
        .vline:nth-child(6){left:78%;animation-delay:.30s}
        @keyframes drawX{to{transform:scaleX(1)}}
        @keyframes drawY{to{transform:scaleY(1)}}

        .fade-in-tab {
          animation: fadeInTab 0.24s cubic-bezier(.22,.61,.36,1) forwards;
        }
        @keyframes fadeInTab {
          from { opacity: 0; transform: translateY(4px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
      `}</style>

      {/* Subtle particle layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-35 mix-blend-screen pointer-events-none"
      />

      {/* Grid accent lines */}
      <div className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      {/* Standard-Ratio & Dynamic Auto-Height Adjusting Card */}
      <Card className="card-animate w-full max-w-[380px] border-zinc-800/90 bg-zinc-950/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-10 transition-all duration-300 overflow-hidden">
        
        {/* Role Pill Switcher */}
        <div className="p-2.5 bg-zinc-900/60 border-b border-zinc-800/80 rounded-t-2xl">
          <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-0.5 rounded-xl border border-zinc-800/80 text-[11px]">
            <button
              type="button"
              onClick={() => handleRoleChange("buyer")}
              className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                selectedRole === "buyer"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <UserCircle2 className="w-3.5 h-3.5" />
              <span>Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("supplier")}
              className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                selectedRole === "supplier"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Supplier</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                selectedRole === "admin"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Card Header */}
        <CardHeader className="space-y-0.5 pb-2 pt-4 px-5">
          <CardTitle className="text-xl font-extrabold tracking-tight text-white">
            {authTab === "signin" ? "Welcome back" : "Create account"}
          </CardTitle>
          <CardDescription className="text-zinc-400 text-xs">
            {authTab === "signin" 
              ? `Sign in to your ${selectedRole.toUpperCase()} console`
              : `Join NIRMAN as a ${selectedRole.toUpperCase()}`
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-3">
          {/* Tab Switcher Pills */}
          <div className="grid grid-cols-2 gap-1 bg-zinc-900/80 p-0.5 rounded-xl border border-zinc-800/80 text-xs mb-3.5">
            <button
              type="button"
              onClick={() => setAuthTab("signin")}
              className={`py-1.5 rounded-lg font-bold transition text-center ${
                authTab === "signin"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthTab("signup")}
              className={`py-1.5 rounded-lg font-bold transition text-center ${
                authTab === "signup"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Register
            </button>
          </div>

          {/* DYNAMIC AUTO-ADJUSTING BODY */}
          <div className="transition-all duration-300">
            {/* SIGN IN VIEW */}
            {authTab === "signin" && (
              <div className="fade-in-tab space-y-3">
                <form onSubmit={handleSignIn} className="space-y-3">
                  <div className="grid gap-1">
                    <Label htmlFor="signin-email" className="text-xs text-zinc-300 font-semibold">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input
                        id="signin-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 text-xs h-9.5"
                      />
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password" className="text-xs text-zinc-300 font-semibold">
                        Password
                      </Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 pr-9 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 text-xs h-9.5"
                      />
                      <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" defaultChecked />
                      <Label htmlFor="remember" className="text-[11px] text-zinc-400 font-normal">
                        Remember me
                      </Label>
                    </div>
                    <a
                      href="#forgot"
                      onClick={(e) => { e.preventDefault(); alert("Demo password reset instructions sent."); }}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <Button type="submit" className="w-full h-9.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs shadow-lg mt-1">
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </form>

                <div className="relative my-2">
                  <Separator className="bg-zinc-800" />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-zinc-950 px-2 text-[10px] uppercase tracking-widest text-zinc-500">
                    or
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onAuthenticate && onAuthenticate(selectedRole)}
                    className="h-8.5 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-200 hover:bg-zinc-900 text-[11px]"
                  >
                    <Github className="h-3.5 w-3.5 mr-1.5" />
                    GitHub
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onAuthenticate && onAuthenticate(selectedRole)}
                    className="h-8.5 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-200 hover:bg-zinc-900 text-[11px]"
                  >
                    <Chrome className="h-3.5 w-3.5 mr-1.5" />
                    Google
                  </Button>
                </div>
              </div>
            )}

            {/* REGISTER VIEW */}
            {authTab === "signup" && (
              <div className="fade-in-tab space-y-3">
                {selectedRole === "supplier" ? (
                  <div className="space-y-3 text-center py-2">
                    <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mx-auto border border-emerald-500/30">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Global Supplier Plant Registration</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Register your 5-axis machines, cleanroom, and ISO certificates via the 4-step wizard.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={onOpenSupplierRegistration}
                      className="w-full h-9.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg"
                    >
                      <span>Open 4-Step Registration</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-2.5">
                    <div className="grid gap-1">
                      <Label className="text-xs text-zinc-300 font-semibold">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                        <Input
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Your name"
                          className="pl-9 bg-zinc-950 border-zinc-800 text-xs h-8.5"
                        />
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-xs text-zinc-300 font-semibold">Corporate Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                        <Input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="pl-9 bg-zinc-950 border-zinc-800 text-xs h-8.5"
                        />
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-xs text-zinc-300 font-semibold">Company Name</Label>
                      <Input
                        required
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        placeholder="e.g. Zenith Aero"
                        className="bg-zinc-950 border-zinc-800 text-xs h-8.5"
                      />
                    </div>

                    <Button type="submit" className="w-full h-9.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs mt-1 shadow-lg">
                      <span>Create account</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </CardContent>

        {/* 1-Click Instant Persona Shortcuts */}
        <CardFooter className="flex flex-col gap-1.5 pt-0 pb-3 px-5 text-center border-t border-zinc-800/80 mt-1">
          <div className="flex items-center justify-center space-x-1 text-[10px] text-zinc-400 pt-2.5">
            <span className="text-zinc-500 font-bold uppercase tracking-wider">Quick:</span>
            <button
              type="button"
              onClick={() => onAuthenticate && onAuthenticate("buyer", { name: "Vikram Mehta", email: "v.mehta@zenithaero.com", company: "Zenith Aero Robotics", role: "buyer" })}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-brand-900/50 text-zinc-300 hover:text-brand-300 font-medium transition"
            >
              Zenith (Buyer)
            </button>
            <button
              type="button"
              onClick={() => onAuthenticate && onAuthenticate("supplier", { name: "Rajesh Sharma", email: "info@precisiontech-dyn.com", company: "PrecisionTech", role: "supplier" }, "sup-001")}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-emerald-900/50 text-zinc-300 hover:text-emerald-300 font-medium transition"
            >
              PrecisionTech
            </button>
            <button
              type="button"
              onClick={() => onAuthenticate && onAuthenticate("admin", { name: "Platform Auditor", email: "compliance@nirman.os", company: "Audit Bureau", role: "admin" })}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-amber-900/50 text-zinc-300 hover:text-amber-300 font-medium transition"
            >
              Admin
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
