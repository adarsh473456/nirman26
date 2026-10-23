'use client';

import React, { useState } from 'react';
import { AppTheme, SourcingOrder, UserRole } from '../types';
import { 
  X, 
  Sun, 
  Moon, 
  Monitor, 
  ShoppingBag, 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Truck, 
  FileCheck2, 
  Building2, 
  Mail, 
  Phone, 
  Sliders,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  orders: SourcingOrder[];
  role: UserRole;
  onLogOut: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  theme,
  setTheme,
  orders,
  role,
  onLogOut,
}: SettingsModalProps) {
  const [activeSettingsTab, setActiveSettingsTab] = useState<'appearance' | 'orders' | 'profile' | 'notifications'>('appearance');
  const [isLoggedOutSplash, setIsLoggedOutSplash] = useState(false);

  if (!isOpen) return null;

  const handleLogOutClick = () => {
    setIsLoggedOutSplash(true);
    setTimeout(() => {
      setIsLoggedOutSplash(false);
      onLogOut();
      onClose();
    }, 1500);
  };

  const getOrderStatusBadge = (status: SourcingOrder['status']) => {
    switch (status) {
      case 'in_production':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>In Production</span>
          </span>
        );
      case 'quality_inspection':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700/60">
            <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
            <span>CMM Metrology Audit</span>
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/70 text-brand-800 dark:text-brand-300 border border-brand-300 dark:border-brand-700/60">
            <Truck className="w-3.5 h-3.5 text-brand-600" />
            <span>Dispatched in Transit</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered & Verified</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-navy-900 rounded-2xl max-w-3xl w-full flex flex-col shadow-2xl border border-navy-200 dark:border-navy-800 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white p-6 relative border-b border-navy-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Platform Settings & Control Center</h2>
              <p className="text-xs text-navy-300">
                Theme preferences, active purchase orders, and account security.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-navy-800/80 hover:bg-navy-700 text-navy-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedOutSplash ? (
          <div className="p-14 text-center space-y-3">
            <div className="w-14 h-14 bg-brand-100 dark:bg-brand-950 text-brand-600 rounded-full flex items-center justify-center mx-auto animate-spin">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-navy-950 dark:text-white">Signing out...</h3>
            <p className="text-xs text-navy-500 dark:text-navy-400">
              Clearing session security tokens and resetting to visitor preview.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
            {/* Left Nav Tabs */}
            <div className="w-full sm:w-56 bg-navy-50 dark:bg-navy-950 p-4 border-r border-navy-200 dark:border-navy-800 space-y-1 text-xs font-semibold">
              <button
                onClick={() => setActiveSettingsTab('appearance')}
                className={`w-full p-2.5 rounded-xl text-left flex items-center space-x-2.5 transition ${
                  activeSettingsTab === 'appearance'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-850'
                }`}
              >
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span>Theme & Appearance</span>
              </button>

              <button
                onClick={() => setActiveSettingsTab('orders')}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition ${
                  activeSettingsTab === 'orders'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-850'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>My Orders</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeSettingsTab === 'orders' ? 'bg-white text-brand-700' : 'bg-navy-200 dark:bg-navy-800 text-navy-800 dark:text-navy-200'
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveSettingsTab('profile')}
                className={`w-full p-2.5 rounded-xl text-left flex items-center space-x-2.5 transition ${
                  activeSettingsTab === 'profile'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-850'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Company Profile</span>
              </button>

              <button
                onClick={() => setActiveSettingsTab('notifications')}
                className={`w-full p-2.5 rounded-xl text-left flex items-center space-x-2.5 transition ${
                  activeSettingsTab === 'notifications'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-850'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Alerts & Webhooks</span>
              </button>

              <div className="pt-6 border-t border-navy-200 dark:border-navy-800 mt-4">
                <button
                  onClick={handleLogOutClick}
                  className="w-full p-2.5 rounded-xl text-left flex items-center space-x-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>

            {/* Right Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto text-xs text-navy-900 dark:text-navy-100">
              {/* APPEARANCE TAB */}
              {activeSettingsTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-navy-950 dark:text-white">
                      Interface Theme Mode
                    </h3>
                    <p className="text-navy-500 dark:text-navy-400 text-xs mt-0.5">
                      Select your preferred display theme. All colors strictly follow the UI/UX Pro Max accessible design tokens.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Light Mode Card */}
                    <div
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                        theme === 'light'
                          ? 'border-brand-600 bg-brand-50/50 shadow-md'
                          : 'border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-850 hover:border-brand-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Sun className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-extrabold text-sm text-navy-950 dark:text-white block">Light Mode</span>
                            <span className="text-[10px] text-navy-500">Enterprise High-Contrast</span>
                          </div>
                        </div>
                        {theme === 'light' && (
                          <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">✓</span>
                        )}
                      </div>

                      {/* Mini preview bar */}
                      <div className="bg-slate-100 rounded-lg p-2.5 space-y-1.5 border border-slate-200">
                        <div className="h-3 bg-slate-900 rounded w-2/3" />
                        <div className="h-2 bg-slate-300 rounded w-1/2" />
                      </div>
                    </div>

                    {/* Dark Mode Card */}
                    <div
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                        theme === 'dark'
                          ? 'border-brand-400 bg-navy-800 shadow-md shadow-brand-500/10'
                          : 'border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-850 hover:border-brand-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-900/60 text-brand-300 flex items-center justify-center border border-indigo-700/50">
                            <Moon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-extrabold text-sm text-navy-950 dark:text-white block">Dark Mode</span>
                            <span className="text-[10px] text-navy-400">OLED Midnight Glow</span>
                          </div>
                        </div>
                        {theme === 'dark' && (
                          <span className="w-5 h-5 rounded-full bg-brand-500 text-navy-950 font-bold flex items-center justify-center text-xs">✓</span>
                        )}
                      </div>

                      {/* Mini preview bar */}
                      <div className="bg-navy-950 rounded-lg p-2.5 space-y-1.5 border border-navy-800">
                        <div className="h-3 bg-brand-400 rounded w-2/3" />
                        <div className="h-2 bg-navy-700 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeSettingsTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-navy-950 dark:text-white">
                        My Sourcing Orders & Purchase Orders (POs)
                      </h3>
                      <p className="text-navy-500 dark:text-navy-400 text-xs">
                        Direct manufacturing tracking with verified metrology reports.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{orders.length} Active POs</span>
                  </div>

                  <div className="space-y-3">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="p-4 bg-white dark:bg-navy-850 rounded-xl border border-navy-200 dark:border-navy-800 shadow-sm space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-extrabold text-brand-600 dark:text-brand-400">{order.id}</span>
                              <h4 className="font-extrabold text-sm text-navy-950 dark:text-white">{order.partName}</h4>
                            </div>
                            <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">
                              Supplier: <strong className="text-navy-800 dark:text-navy-200">{order.supplierName}</strong> • Qty: <strong>{order.quantity} pcs</strong>
                            </p>
                          </div>
                          <div>
                            {getOrderStatusBadge(order.status)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-navy-100 dark:border-navy-800 text-xs">
                          <div>
                            <span className="text-[10px] text-navy-400 uppercase font-bold block">Total Amount</span>
                            <span className="font-extrabold text-navy-950 dark:text-white">${order.totalAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-navy-400 uppercase font-bold block">Est. Delivery</span>
                            <span className="font-bold text-navy-800 dark:text-navy-200">{order.estDeliveryDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-navy-400 uppercase font-bold block">Waybill / Tracking</span>
                            <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{order.trackingNumber}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-navy-400 uppercase font-bold block">Inspection Report</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span>FAIR Attached</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeSettingsTab === 'profile' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-navy-950 dark:text-white">
                      Organization Sourcing Profile
                    </h3>
                    <p className="text-navy-500 dark:text-navy-400 text-xs">
                      Your identity when requesting quotes from verified manufacturers.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-navy-800 dark:text-navy-200 mb-1">Buyer / Company Name</label>
                      <input
                        type="text"
                        defaultValue="Zenith Aero Robotics Private Limited"
                        className="w-full p-2.5 bg-navy-50 dark:bg-navy-950 border border-navy-300 dark:border-navy-800 rounded-xl text-xs font-semibold text-navy-950 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-navy-800 dark:text-navy-200 mb-1">Sourcing Officer</label>
                        <input
                          type="text"
                          defaultValue="Vikram Mehta"
                          className="w-full p-2.5 bg-navy-50 dark:bg-navy-950 border border-navy-300 dark:border-navy-800 rounded-xl text-xs font-semibold text-navy-950 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-navy-800 dark:text-navy-200 mb-1">Corporate Email</label>
                        <input
                          type="email"
                          defaultValue="v.mehta@zenithaero.com"
                          className="w-full p-2.5 bg-navy-50 dark:bg-navy-950 border border-navy-300 dark:border-navy-800 rounded-xl text-xs font-semibold text-navy-950 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeSettingsTab === 'notifications' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-navy-950 dark:text-white">
                      Alert & Notification Channels
                    </h3>
                    <p className="text-navy-500 dark:text-navy-400 text-xs">
                      Control how you are alerted when suppliers submit quote responses.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { title: 'Instant Quote Arrival Alerts', desc: 'Receive real-time notifications when a manufacturer submits RFQ pricing.' },
                      { title: 'Supplier GST Audit Status Updates', desc: 'Get alerted when suppliers on your shortlist receive official Verified Badges.' },
                      { title: 'Weekly Sourcing Intelligence Digest', desc: 'Curated report of newly added 5-axis machines, laser cutters, and cleanrooms.' },
                    ].map((item, idx) => (
                      <label
                        key={idx}
                        className="p-3 bg-navy-50 dark:bg-navy-850 rounded-xl border border-navy-200 dark:border-navy-800 flex items-start space-x-3 cursor-pointer"
                      >
                        <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded text-brand-600" />
                        <div>
                          <span className="font-bold text-xs text-navy-950 dark:text-white block">{item.title}</span>
                          <span className="text-[11px] text-navy-500 dark:text-navy-400">{item.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
