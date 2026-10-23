'use client';

import * as React from 'react';
import { useState } from 'react';
import { UserRole, UserProfile } from '../../types';
import {
  UserCircle2,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const AppInput = (props: InputProps) => {
  const {
    label,
    placeholder,
    icon,
    className = '',
    ...rest
  } = props;

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="w-full relative text-left">
      {label && (
        <label className="block mb-1.5 text-xs font-semibold text-zinc-300">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          className={`peer relative z-10 border-2 border-[var(--color-border)] h-11 w-full rounded-xl bg-[var(--color-surface)] px-4 text-xs font-normal text-white outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] focus:border-brand-400 placeholder:text-zinc-500 ${className}`}
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...rest}
        />

        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-xl overflow-hidden"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />

            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-xl overflow-hidden"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
          </>
        )}

        {icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 text-zinc-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export interface LoginOneProps {
  onAuthenticate?: (
    role: UserRole,
    profile?: Partial<UserProfile>,
    supplierId?: string
  ) => void;

  onOpenSupplierRegistration?: () => void;
}

export default function LoginOne({
  onAuthenticate,
  onOpenSupplierRegistration,
}: LoginOneProps) {
  const [selectedRole, setSelectedRole] =
    useState<UserRole>('buyer');

  const [email, setEmail] =
    useState('v.mehta@zenithaero.com');

  const [password, setPassword] =
    useState('••••••••••••');

  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const [isHovering, setIsHovering] =
    useState(false);

  /*
   * TEMPORARY LOCAL ADMIN LOGIN
   *
   * Do NOT use client-side hardcoded admin credentials
   * for the deployed production application.
   *
   * We will later move Admin authorization to Auth0/FastAPI.
   */
  const ADMIN_EMAIL = 'admin@nirman.local';
  const ADMIN_PASSWORD = 'NirmanAdmin@2026!';

  const handleMouseMove = (
    e: React.MouseEvent
  ) => {
    const leftSection =
      e.currentTarget.getBoundingClientRect();

    setMousePosition({
      x: e.clientX - leftSection.left,
      y: e.clientY - leftSection.top,
    });
  };

  const handleRoleChange = (
    role: UserRole
  ) => {
    setSelectedRole(role);

    if (role === 'buyer') {
      setEmail('v.mehta@zenithaero.com');
    } else if (role === 'supplier') {
      setEmail('info@precisiontech-dyn.com');
    }
  };

  /*
   * GOOGLE AUTH0 LOGIN
   */
  const handleGoogleLogin = () => {
    localStorage.setItem(
      'nirman_login_role',
      selectedRole
    );
    document.cookie =
      `nirman_login_role=${selectedRole}; path=/; SameSite=Lax`;

    window.location.href =
      `/auth/login?connection=google-oauth2&returnTo=/`;
  };

  /*
   * EMAIL / PASSWORD LOGIN
   */
  const handleSignIn = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!onAuthenticate) return;

    /*
     * ADMIN CHECK
     *
     * Admin does NOT appear as a selectable role.
     * Only this exact email + password opens Admin.
     */
    if (
      email.trim().toLowerCase() ===
      ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      onAuthenticate('admin', {
        name: 'Platform Auditor',
        email: ADMIN_EMAIL,
        company: 'Nirman Verification Bureau',
        role: 'admin',
      });

      return;
    }

    /*
     * BUYER LOGIN
     */
    if (selectedRole === 'buyer') {
      onAuthenticate('buyer', {
        name: 'Vikram Mehta',
        email:
          email ||
          'v.mehta@zenithaero.com',
        company:
          'Zenith Aero Robotics',
        role: 'buyer',
      });

      return;
    }

    /*
     * SUPPLIER LOGIN
     */
    if (selectedRole === 'supplier') {
      onAuthenticate(
        'supplier',
        {
          name: 'Rajesh Sharma',
          email:
            email ||
            'info@precisiontech-dyn.com',
          company:
            'PrecisionTech Dynamics',
          role: 'supplier',
        },
        'sup-001'
      );
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="card w-full max-w-[390px] bg-[var(--color-surface)]/90 border-2 border-[var(--color-border)] rounded-2xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden transition-all duration-300">

        {/* Role Pill Switcher */}
        <div className="p-2.5 bg-zinc-950/70 border-b border-[var(--color-border)]">
          <div className="grid grid-cols-2 gap-1 bg-zinc-900 p-0.5 rounded-xl border border-[var(--color-border)] text-[11px]">

            <button
              type="button"
              onClick={() =>
                handleRoleChange('buyer')
              }
              className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${selectedRole === 'buyer'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              <UserCircle2 className="w-3.5 h-3.5" />
              <span>Buyer</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleRoleChange('supplier')
              }
              className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${selectedRole === 'supplier'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
                }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Supplier</span>
            </button>

          </div>
        </div>

        {/* Form Container */}
        <div
          className="w-full px-5 py-5 relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() =>
            setIsHovering(true)
          }
          onMouseLeave={() =>
            setIsHovering(false)
          }
        >
          {/* Mouse follow radial glow */}
          <div
            className={`absolute pointer-events-none w-[350px] h-[350px] bg-gradient-to-r from-purple-400/20 via-sky-400/20 to-pink-400/20 rounded-full blur-3xl transition-opacity duration-200 ${isHovering
              ? 'opacity-100'
              : 'opacity-0'
              }`}
            style={{
              transform: `translate(${mousePosition.x - 175
                }px, ${mousePosition.y - 175
                }px)`,
              transition:
                'transform 0.08s ease-out',
            }}
          />

          <form
            className="text-center grid gap-3.5 relative z-10"
            onSubmit={handleSignIn}
          >
            <div className="grid gap-2">

              <h2 className="text-2xl font-black tracking-tight text-white">
                Sign In
              </h2>

              {/* Google Login */}
              <div className="flex items-center justify-center">
                <ul className="flex gap-2.5">
                  <li className="list-none">

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      title="Sign in with Google"
                      className="w-8 h-8 bg-zinc-900 rounded-full flex justify-center items-center relative z-[1] border border-[var(--color-border)] overflow-hidden group transition hover:border-brand-400"
                    >
                      <div className="absolute inset-0 w-full h-full bg-brand-600 scale-y-0 origin-bottom transition-transform duration-300 ease-in-out group-hover:scale-y-100" />

                      <span className="transition-all duration-300 z-[2]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#4285F4"
                            d="M21.35 12.2c0-.74-.07-1.45-.19-2.14H12v4.05h5.24a4.48 4.48 0 0 1-1.94 2.94v2.62h3.14c1.84-1.69 2.91-4.18 2.91-7.47Z"
                          />

                          <path
                            fill="#34A853"
                            d="M12 21.7c2.62 0 4.82-.87 6.43-2.35l-3.14-2.62c-.87.58-1.98.93-3.29.93-2.53 0-4.67-1.71-5.44-4.01H3.31v2.7A9.72 9.72 0 0 0 12 21.7Z"
                          />

                          <path
                            fill="#FBBC05"
                            d="M6.56 13.65A5.86 5.86 0 0 1 6.25 12c0-.57.1-1.12.31-1.65v-2.7H3.31A9.72 9.72 0 0 0 2.3 12c0 1.56.37 3.03 1.01 4.35l3.25-2.7Z"
                          />

                          <path
                            fill="#EA4335"
                            d="M12 6.34c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.82 3.43 14.62 2.3 12 2.3a9.72 9.72 0 0 0-8.69 5.35l3.25 2.7C7.33 8.05 9.47 6.34 12 6.34Z"
                          />
                        </svg>
                      </span>

                    </button>

                  </li>
                </ul>
              </div>

              <span className="text-[11px] text-zinc-400">
                or use your{' '}
                {selectedRole.toUpperCase()}{' '}
                account
              </span>
            </div>

            <div className="grid gap-2.5 items-center">

              <AppInput
                placeholder="Email address"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <AppInput
                placeholder="Password"
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            <div className="flex items-center justify-between text-xs">

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();

                  alert(
                    'Demo password reset instructions sent.'
                  );
                }}
                className="font-normal text-zinc-400 hover:text-zinc-200 text-[11px]"
              >
                Forgot your password?
              </a>

              {selectedRole ===
                'supplier' &&
                onOpenSupplierRegistration && (
                  <button
                    type="button"
                    onClick={
                      onOpenSupplierRegistration
                    }
                    className="text-emerald-400 hover:underline text-[11px] font-bold"
                  >
                    Register Plant
                  </button>
                )}

            </div>

            {/* Shimmer Submit Button */}
            <div className="flex justify-center items-center pt-1">

              <button
                type="submit"
                className="group/button relative w-full inline-flex justify-center items-center overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 px-5 py-2.5 text-xs font-bold text-white transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-500/30 cursor-pointer border border-brand-400/40"
              >
                <span className="text-xs font-bold px-2 py-0.5 flex items-center space-x-1.5">

                  <span>
                    Sign In as{' '}
                    {selectedRole.toUpperCase()}
                  </span>

                  <ArrowRight className="w-3.5 h-3.5" />

                </span>

                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">

                  <div className="relative h-full w-10 bg-white/25" />

                </div>
              </button>

            </div>

          </form>
        </div>

        {/* Quick Demo Personas Footer */}
        <div className="p-2.5 bg-zinc-950/70 border-t border-[var(--color-border)] text-center">

          <div className="flex items-center justify-center space-x-1 text-[10px] text-zinc-400">

            <span className="text-zinc-500 font-bold uppercase tracking-wider">
              Quick:
            </span>

            <button
              type="button"
              onClick={() =>
                onAuthenticate &&
                onAuthenticate(
                  'buyer',
                  {
                    name:
                      'Vikram Mehta',
                    email:
                      'v.mehta@zenithaero.com',
                    company:
                      'Zenith Aero Robotics',
                    role:
                      'buyer',
                  }
                )
              }
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-brand-900/50 text-zinc-300 hover:text-brand-300 font-medium transition"
            >
              Zenith (Buyer)
            </button>

            <button
              type="button"
              onClick={() =>
                onAuthenticate &&
                onAuthenticate(
                  'supplier',
                  {
                    name:
                      'Rajesh Sharma',
                    email:
                      'info@precisiontech-dyn.com',
                    company:
                      'PrecisionTech',
                    role:
                      'supplier',
                  },
                  'sup-001'
                )
              }
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-emerald-900/50 text-zinc-300 hover:text-emerald-300 font-medium transition"
            >
              PrecisionTech
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}