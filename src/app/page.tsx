'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../lib/store';
import {
  api,
  AdminAnalytics,
} from '../lib/api';
import { MarketplaceLanding } from '../components/MarketplaceLanding';
import { Navbar } from '../components/Navbar';
import { SearchSection } from '../components/SearchSection';
import { FilterSidebar } from '../components/FilterSidebar';
import { SupplierCard } from '../components/SupplierCard';
import { SupplierProfileModal } from '../components/SupplierProfileModal';
import { RfqModal } from '../components/RfqModal';
import { ComparisonModal } from '../components/ComparisonModal';
import { SupplierAuthModal } from '../components/SupplierAuthModal';
import { SettingsModal } from '../components/SettingsModal';
import { BuyerDashboard } from '../components/BuyerDashboard';
import { SupplierDashboard } from '../components/SupplierDashboard';
import { AdminDashboard } from '../components/AdminDashboard';
import {
  Layers,
  ShieldCheck,
  ArrowRight,
  Building2,
} from 'lucide-react';

import {
  UserRole,
  UserProfile,
} from '../types';

export default function Home() {
  /*
   * Used only to wait for Auth0 session verification.
   * No UI/CSS changes.
   */
  const [authChecked, setAuthChecked] =
    useState(false);

  const [backendSupplier, setBackendSupplier] =
    useState<any | null>(null);

  const [backendSupplierRfqs, setBackendSupplierRfqs] =
    useState<any[]>([]);

  const [backendBuyerRfqs, setBackendBuyerRfqs] =
    useState<any[]>([]);

  /*
   * REAL ADMIN GLOBAL RFQS
   */
  const [backendAdminRfqs, setBackendAdminRfqs] =
    useState<any[]>([]);

  /*
   * REAL ADMIN ANALYTICS
   *
   * Loaded from PostgreSQL through
   * GET /users/admin/analytics.
   */
  const [
    backendAdminAnalytics,
    setBackendAdminAnalytics,
  ] = useState<AdminAnalytics | null>(
    null
  );

  const [backendOrders, setBackendOrders] =
    useState<any[]>([]);

  const [backendBookmarkedIds, setBackendBookmarkedIds] =
    useState<string[]>([]);

  const [backendSuppliers, setBackendSuppliers] =
    useState<any[]>([]);

  /*
   * REAL BACKEND SEARCH RESULTS
   */
  const [backendSearchSuppliers, setBackendSearchSuppliers] =
    useState<any[]>([]);

  const {
    isAuthenticated,
    currentUser,
    signInUser,
    role,
    setRole,
    theme,
    setTheme,
    suppliers,
    activeSupplierId,
    setActiveSupplierId,
    loginSupplier,
    registerNewSupplier,
    filters,
    setFilters,
    bookmarkedIds,
    toggleBookmark,
    comparedIds,
    toggleCompare,
    rfqs,
    orders,
    submitRfq,
    logOut,
    selectedSupplierForProfile,
    setSelectedSupplierForProfile,
    selectedSupplierForRfq,
    setSelectedSupplierForRfq,
    isComparisonOpen,
    setIsComparisonOpen,
    isSupplierAuthOpen,
    setIsSupplierAuthOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    activeTab,
    setActiveTab,
  } = useAppStore();

  /*
   * REAL BUYER BOOKMARK SYNC
   */
  useEffect(() => {
    if (
      !isAuthenticated ||
      role !== 'buyer'
    ) {
      setBackendBookmarkedIds([]);
      return;
    }

    let cancelled = false;

    const loadBookmarks =
      async () => {
        try {
          const rows =
            await api.bookmarks();

          if (!cancelled) {
            setBackendBookmarkedIds(
              Array.isArray(rows)
                ? rows
                  .map(
                    (supplier: any) =>
                      supplier.id
                  )
                  .filter(Boolean)
                : []
            );
          }
        } catch (error) {
          console.error(
            'Failed to load buyer bookmarks:',
            error
          );

          if (!cancelled) {
            setBackendBookmarkedIds([]);
          }
        }
      };

    loadBookmarks();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    role,
  ]);

  const handleToggleBookmark =
    async (
      supplierId: string
    ) => {
      if (role !== 'buyer') {
        toggleBookmark(
          supplierId
        );
        return;
      }

      const isCurrentlyBookmarked =
        backendBookmarkedIds.includes(
          supplierId
        );

      try {
        if (isCurrentlyBookmarked) {
          await api.removeBookmark(
            supplierId
          );

          setBackendBookmarkedIds(
            prev =>
              prev.filter(
                id =>
                  id !==
                  supplierId
              )
          );
        } else {
          await api.addBookmark(
            supplierId
          );

          setBackendBookmarkedIds(
            prev =>
              prev.includes(
                supplierId
              )
                ? prev
                : [
                  ...prev,
                  supplierId,
                ]
          );
        }
      } catch (error) {
        console.error(
          'Failed to update bookmark:',
          error
        );
      }
    };

  /*
   * REAL SUPPLIER DIRECTORY SYNC
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setBackendSuppliers([]);
      return;
    }

    let cancelled = false;

    const loadSuppliers =
      async () => {
        try {
          const rows =
            await api.suppliers();

          if (!cancelled) {
            setBackendSuppliers(
              Array.isArray(rows)
                ? rows
                : []
            );
          }
        } catch (error) {
          console.error(
            'Failed to load supplier directory:',
            error
          );

          if (!cancelled) {
            setBackendSuppliers([]);
          }
        }
      };

    loadSuppliers();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
  ]);

  /*
   * REAL BACKEND SUPPLIER SEARCH
   *
   * The backend currently accepts one category per request,
   * while the existing UI supports multiple categories.
   * Search once per selected category and merge unique results.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setBackendSearchSuppliers([]);
      return;
    }

    let cancelled = false;

    const loadSearchResults =
      async () => {
        try {
          const categories =
            filters.categories.length > 0
              ? filters.categories
              : [null];

          const resultGroups =
            await Promise.all(
              categories.map(
                category =>
                  api.search({
                    query:
                      filters.query,
                    category,
                    location:
                      filters.location ===
                        'All Locations'
                        ? null
                        : filters.location,
                    materials:
                      filters.materials,
                    certifications:
                      filters.certifications,
                    verified_only:
                      filters.verifiedOnly,
                    use_ai:
                      filters.isAiQuery,
                  })
              )
            );

          const byId =
            new Map<string, any>();

          resultGroups
            .flat()
            .forEach(
              supplier => {
                if (
                  !supplier ||
                  !supplier.id
                ) {
                  return;
                }

                const existing =
                  byId.get(
                    supplier.id
                  );

                if (
                  !existing ||
                  Number(
                    supplier.matchScore ||
                    0
                  ) >
                  Number(
                    existing.matchScore ||
                    0
                  )
                ) {
                  byId.set(
                    supplier.id,
                    supplier
                  );
                }
              }
            );

          const rows =
            Array.from(
              byId.values()
            ).sort(
              (a, b) =>
                Number(
                  b.matchScore ||
                  0
                ) -
                Number(
                  a.matchScore ||
                  0
                )
            );

          if (!cancelled) {
            setBackendSearchSuppliers(
              rows
            );
          }
        } catch (error) {
          console.error(
            'Failed to search suppliers:',
            error
          );

          if (!cancelled) {
            setBackendSearchSuppliers(
              []
            );
          }
        }
      };

    const timer =
      window.setTimeout(
        loadSearchResults,
        250
      );

    return () => {
      cancelled = true;
      window.clearTimeout(
        timer
      );
    };
  }, [
    isAuthenticated,
    filters.query,
    filters.isAiQuery,
    filters.categories,
    filters.certifications,
    filters.location,
    filters.verifiedOnly,
    filters.materials,
  ]);

  /*
   * REAL SUPPLIER PROFILE SYNC
   */
  useEffect(() => {
    if (
      !isAuthenticated ||
      role !== 'supplier'
    ) {
      setBackendSupplier(null);
      return;
    }

    let cancelled = false;

    const loadMySupplier =
      async () => {
        try {
          const supplier =
            await api.mySupplier();

          if (!cancelled) {
            setBackendSupplier(
              supplier
            );
          }
        } catch (error) {
          console.error(
            'Failed to load supplier profile:',
            error
          );

          if (!cancelled) {
            setBackendSupplier(
              null
            );
          }
        }
      };

    loadMySupplier();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    role,
  ]);

  /*
   * REAL BUYER RFQ SYNC
   */
  useEffect(() => {
    if (
      !isAuthenticated ||
      role !== 'buyer'
    ) {
      setBackendBuyerRfqs([]);
      return;
    }

    let cancelled = false;

    const loadBuyerRfqs =
      async () => {
        try {
          const buyerRfqs =
            await api.buyerRfqs();

          if (!cancelled) {
            setBackendBuyerRfqs(
              Array.isArray(buyerRfqs)
                ? buyerRfqs
                : []
            );
          }
        } catch (error) {
          console.error(
            'Failed to load buyer RFQs:',
            error
          );

          if (!cancelled) {
            setBackendBuyerRfqs([]);
          }
        }
      };

    loadBuyerRfqs();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    role,
  ]);

  /*
   * REAL SUPPLIER RFQ SYNC
   */
  useEffect(() => {
    if (
      !isAuthenticated ||
      role !== 'supplier'
    ) {
      setBackendSupplierRfqs([]);
      return;
    }

    let cancelled = false;

    const loadSupplierRfqs =
      async () => {
        try {
          const supplierRfqs =
            await api.supplierRfqs();

          if (!cancelled) {
            setBackendSupplierRfqs(
              Array.isArray(
                supplierRfqs
              )
                ? supplierRfqs
                : []
            );
          }
        } catch (error) {
          console.error(
            'Failed to load supplier RFQs:',
            error
          );

          if (!cancelled) {
            setBackendSupplierRfqs([]);
          }
        }
      };

    loadSupplierRfqs();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    role,
  ]);

  /*
   * REAL ADMIN GLOBAL RFQ SYNC
   */
  useEffect(() => {
    if (
      !isAuthenticated ||
      role !== 'admin'
    ) {
      setBackendAdminRfqs([]);
      return;
    }

    let cancelled = false;

    const loadAdminRfqs =
      async () => {
        try {
          const adminRfqs =
            await api.adminRfqs();

          if (!cancelled) {
            setBackendAdminRfqs(
              Array.isArray(
                adminRfqs
              )
                ? adminRfqs
                : []
            );
          }
        } catch (error) {
          console.error(
            'Failed to load Admin global RFQs:',
            error
          );

          if (!cancelled) {
            setBackendAdminRfqs([]);
          }
        }
      };

    loadAdminRfqs();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    role,
  ]);

  /*
   * REAL ADMIN ANALYTICS SYNC
   *
   * Loads real platform analytics for Admin.
   *
   * No mock analytics are created here.
   * No UI/CSS changes.
   */
  useEffect(() => {
    if (
      !isAuthenticated ||
      role !== 'admin'
    ) {
      setBackendAdminAnalytics(
        null
      );
      return;
    }

    let cancelled = false;

    const loadAdminAnalytics =
      async () => {
        try {
          const analytics =
            await api.adminAnalytics();

          if (!cancelled) {
            setBackendAdminAnalytics(
              analytics
            );
          }
        } catch (error) {
          console.error(
            'Failed to load Admin analytics:',
            error
          );

          if (!cancelled) {
            setBackendAdminAnalytics(
              null
            );
          }
        }
      };

    loadAdminAnalytics();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    role,
  ]);

  /*
   * REAL ORDER SYNC
   */
  const normalizeBackendOrder = (
    order: any
  ) => {
    const orderDate =
      order.orderDate || '';

    let estDeliveryDate = '';

    if (orderDate) {
      const date =
        new Date(orderDate);

      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {
        date.setDate(
          date.getDate() +
          Number(
            order.estimatedLeadDays ||
            0
          )
        );

        estDeliveryDate =
          date.toISOString();
      }
    }

    const statusMap: Record<
      string,
      string
    > = {
      confirmed:
        'in_production',

      in_production:
        'in_production',

      quality_inspection:
        'quality_inspection',

      dispatched:
        'dispatched',

      delivered:
        'delivered',
    };

    return {
      id:
        order.id,

      rfqId:
        order.rfqId,

      partName:
        order.partName || '',

      supplierName:
        order.supplierName || '',

      buyerCompany:
        order.buyerCompany || '',

      quantity:
        Number(
          order.quantity || 0
        ),

      unitPrice:
        Number(
          order.unitPrice || 0
        ),

      totalAmount:
        Number(
          order.totalAmount || 0
        ),

      status:
        statusMap[
        order.status
        ] ||
        'in_production',

      orderDate,

      estDeliveryDate,

      trackingNumber:
        order.trackingNumber ||
        '',

      inspectionCertAttached:
        Boolean(
          order
            .inspectionCertAttached
        ),
    };
  };

  const loadBackendOrders =
    async () => {
      if (
        !isAuthenticated ||
        (
          role !== 'buyer' &&
          role !== 'supplier'
        )
      ) {
        setBackendOrders([]);
        return;
      }

      try {
        const rows =
          role === 'buyer'
            ? await api.buyerOrders()
            : await api.supplierOrders();

        setBackendOrders(
          Array.isArray(rows)
            ? rows.map(
              normalizeBackendOrder
            )
            : []
        );
      } catch (error) {
        console.error(
          'Failed to load real orders:',
          error
        );

        setBackendOrders([]);
      }
    };

  useEffect(() => {
    let cancelled = false;

    const loadOrders =
      async () => {
        if (
          !isAuthenticated ||
          (
            role !== 'buyer' &&
            role !== 'supplier'
          )
        ) {
          if (!cancelled) {
            setBackendOrders([]);
          }

          return;
        }

        try {
          const rows =
            role === 'buyer'
              ? await api.buyerOrders()
              : await api.supplierOrders();

          if (!cancelled) {
            setBackendOrders(
              Array.isArray(rows)
                ? rows.map(
                  normalizeBackendOrder
                )
                : []
            );
          }
        } catch (error) {
          console.error(
            'Failed to load real orders:',
            error
          );

          if (!cancelled) {
            setBackendOrders([]);
          }
        }
      };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    role,
  ]);

  /*
   * Buyer discovery still includes
   * existing local suppliers plus
   * real backend suppliers.
   */
  const discoverySuppliers =
    React.useMemo(() => {
      const byId =
        new Map<string, any>();

      suppliers.forEach(
        supplier => {
          byId.set(
            supplier.id,
            supplier
          );
        }
      );

      backendSuppliers.forEach(
        supplier => {
          byId.set(
            supplier.id,
            supplier
          );
        }
      );

      return Array.from(
        byId.values()
      );
    }, [
      suppliers,
      backendSuppliers,
    ]);

  /*
   * Backend search already performs filtering and scoring.
   * Convert backend supplier rows directly into the result
   * shape expected by the existing SupplierCard rendering.
   */
  const rankedResults =
    React.useMemo(
      () =>
        backendSearchSuppliers.map(
          supplier => ({
            supplier: {
              ...supplier,
              matchScore:
                Number(
                  supplier.matchScore ||
                  0
                ),
              matchReasons:
                Array.isArray(
                  supplier.matchReasons
                )
                  ? supplier.matchReasons
                  : [],
            },

            matchScore:
              Number(
                supplier.matchScore ||
                0
              ),

            matchReasons:
              Array.isArray(
                supplier.matchReasons
              )
                ? supplier.matchReasons
                : [],

            breakdown: {
              relevance:
                Number(
                  supplier.matchScore ||
                  0
                ),
              verification: 0,
              profileCompleteness: 0,
              responsiveness: 0,
            },
          })
        ),
      [
        backendSearchSuppliers,
      ]
    );

  const activeBookmarkedIds =
    role === 'buyer'
      ? backendBookmarkedIds
      : bookmarkedIds;

  const bookmarkedSuppliers =
    discoverySuppliers.filter(
      s =>
        activeBookmarkedIds.includes(
          s.id
        )
    );

  const comparedSuppliers =
    discoverySuppliers.filter(
      s =>
        comparedIds.includes(
          s.id
        )
    );

  const currentSupplier =
    role === 'supplier' &&
      backendSupplier
      ? backendSupplier
      : discoverySuppliers.find(
        s =>
          s.id ===
          activeSupplierId
      ) ||
      discoverySuppliers[0];

  /*
   * REAL SUPPLIER PROFILE UPDATE
   */
  const handleUpdateSupplierProfile =
    async (
      supplierId: string,
      payload: any
    ) => {
      try {
        const updatedSupplier =
          await api.updateSupplier(
            supplierId,
            payload
          );

        setBackendSupplier(
          updatedSupplier
        );

        setBackendSuppliers(
          prev => {
            const exists =
              prev.some(
                supplier =>
                  supplier.id ===
                  updatedSupplier.id
              );

            if (exists) {
              return prev.map(
                supplier =>
                  supplier.id ===
                    updatedSupplier.id
                    ? updatedSupplier
                    : supplier
              );
            }

            return [
              ...prev,
              updatedSupplier,
            ];
          }
        );

        return updatedSupplier;
      } catch (error) {
        console.error(
          'Failed to update supplier profile:',
          error
        );

        throw error;
      }
    };

  /*
   * REAL ADMIN SUPPLIER EDIT
   */
  const handleAdminSupplierUpdate =
    async (
      supplierId: string,
      payload: any
    ) => {
      try {
        const updatedSupplier =
          await api.updateSupplier(
            supplierId,
            payload
          );

        setBackendSuppliers(
          prev =>
            prev.map(
              supplier =>
                supplier.id ===
                  supplierId
                  ? updatedSupplier
                  : supplier
            )
        );

        return updatedSupplier;
      } catch (error) {
        console.error(
          'Failed to update supplier from Admin dashboard:',
          error
        );

        throw error;
      }
    };

  /*
   * REAL ADMIN SUPPLIER VERIFICATION
   */
  const handleVerificationDecision =
    async (
      supplierId: string,
      approved: boolean
    ) => {
      try {
        const updatedSupplier =
          await api.reviewVerification(
            supplierId,
            approved,
            approved
              ? 'Approved by Nirman admin verification review.'
              : 'Verification revoked by Nirman admin verification review.'
          );

        setBackendSuppliers(
          prev =>
            prev.map(
              supplier =>
                supplier.id ===
                  supplierId
                  ? updatedSupplier
                  : supplier
            )
        );

        /*
         * Refresh real analytics because
         * verified/pending supplier counts
         * may have changed.
         */
        if (role === 'admin') {
          try {
            const analytics =
              await api.adminAnalytics();

            setBackendAdminAnalytics(
              analytics
            );
          } catch (analyticsError) {
            console.error(
              'Failed to refresh Admin analytics:',
              analyticsError
            );
          }
        }

        return updatedSupplier;
      } catch (error) {
        console.error(
          'Failed to update supplier verification:',
          error
        );

        throw error;
      }
    };

  /*
   * REAL SUPPLIER RFQ QUOTE RESPONSE
   */
  const handleSupplierRfqResponse =
    async (
      rfqId: string,
      quote: any
    ) => {
      try {
        const updatedRfq =
          await api.submitRfqQuote(
            rfqId,
            {
              unit_price:
                quote.unitPrice,

              currency:
                quote.currency ||
                'INR',

              tooling_cost:
                quote.toolingCost ||
                0,

              estimated_lead_days:
                quote
                  .estimatedLeadDays,

              notes:
                quote.notes ||
                '',

              valid_until:
                quote.validUntil ||
                '',
            }
          );

        setBackendSupplierRfqs(
          prev =>
            prev.map(
              item =>
                item.id ===
                  rfqId
                  ? updatedRfq
                  : item
            )
        );

        return updatedRfq;
      } catch (error) {
        console.error(
          'Failed to submit supplier quotation:',
          error
        );

        throw error;
      }
    };

  /*
   * REAL BUYER QUOTE ACCEPTANCE
   */
  const handleAcceptQuote =
    async (
      rfqId: string
    ) => {
      try {
        const updatedRfq =
          await api.acceptRfqQuote(
            rfqId
          );

        setBackendBuyerRfqs(
          prev =>
            prev.map(
              item =>
                item.id ===
                  rfqId
                  ? updatedRfq
                  : item
            )
        );

        await loadBackendOrders();

        return updatedRfq;
      } catch (error) {
        console.error(
          'Failed to accept RFQ quotation:',
          error
        );

        throw error;
      }
    };

  const handleToggleTheme =
    () => {
      setTheme(
        theme === 'dark'
          ? 'light'
          : 'dark'
      );
    };

  const handleAuthenticate = (
    newRole: UserRole,
    profile?: Partial<UserProfile>,
    supplierId?: string
  ) => {
    signInUser(
      newRole,
      profile,
      supplierId
    );

    if (
      newRole === 'admin'
    ) {
      setActiveTab(
        'admin-dashboard'
      );
    }
  };

  /*
   * AUTH0 SESSION SYNC
   *
   * Always verify the Auth0 session on page load.
   * The selected Buyer/Supplier/Admin login role is restored
   * from localStorage so a stale persisted app role cannot
   * force the user back to the Admin dashboard after refresh.
   */
  useEffect(() => {
    let cancelled = false;

    const syncAuthUser = async () => {
      try {
        const response = await fetch(
          '/api/backend/users/me',
          {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          console.log(
            'No active Auth0 session:',
            response.status
          );

          return;
        }

        const user =
          await response.json();

        if (cancelled) {
          return;
        }

        const selectedLoginRole =
          localStorage.getItem(
            'nirman_login_role'
          );

        let userRole: UserRole;

        if (
          selectedLoginRole ===
          'buyer'
        ) {
          userRole = 'buyer';
        } else if (
          selectedLoginRole ===
          'supplier'
        ) {
          userRole = 'supplier';
        } else if (
          selectedLoginRole ===
          'admin'
        ) {
          userRole = 'admin';
        } else if (
          user.role === 'admin'
        ) {
          userRole = 'admin';
        } else if (
          user.role === 'supplier'
        ) {
          userRole = 'supplier';
        } else {
          userRole = 'buyer';
        }

        localStorage.setItem(
          'nirman_login_role',
          userRole
        );

        signInUser(
          userRole,
          {
            name:
              user.name ||
              '',
            email:
              user.email ||
              '',
            company:
              user.company ||
              '',
            role:
              userRole,
          }
        );

        /*
         * Give each resolved role a valid dashboard tab after
         * a full page refresh. This prevents a stale Admin tab
         * from surviving when the resolved role is Supplier or Buyer.
         */
        if (
          userRole === 'admin'
        ) {
          setActiveTab(
            'admin-dashboard'
          );
        } else if (
          userRole ===
          'supplier'
        ) {
          setActiveTab(
            'profile-management'
          );
        } else {
          setActiveTab(
            'discover'
          );
        }
      } catch (error) {
        console.error(
          'Failed to synchronize Auth0 user:',
          error
        );
      } finally {
        if (!cancelled) {
          setAuthChecked(
            true
          );
        }
      }
    };

    syncAuthUser();

    return () => {
      cancelled = true;
    };

    // Run once when the application loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    !authChecked &&
    !isAuthenticated
  ) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <MarketplaceLanding
        onAuthenticate={handleAuthenticate}
        onOpenSupplierRegistration={() => {
          handleAuthenticate('supplier', {
            name: 'Supplier Administrator',
            email: 'supplier@constellar.example',
            company: 'Space Industry Supplier',
            role: 'supplier',
          });
          setIsSupplierAuthOpen(true);
        }}
        onExplore={(query) => {
          setFilters({
            ...filters,
            query,
            isAiQuery: false,
            categories: [],
            certifications: [],
            location: 'All Locations',
            verifiedOnly: false,
            materials: [],
          });
          handleAuthenticate('buyer', {
            name: 'Guest Sourcing Officer',
            email: 'guest@constellar.example',
            company: 'Space Systems Buyer',
            role: 'buyer',
          });
          setActiveTab('discover');
        }}
        onPostRequirement={() => {
          handleAuthenticate('buyer', {
            name: 'Guest Sourcing Officer',
            email: 'guest@constellar.example',
            company: 'Space Systems Buyer',
            role: 'buyer',
          });
          setActiveTab('discover');
        }}
        suppliers={discoverySuppliers}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-[#F5F7EB] selection:bg-brand-500 selection:text-white transition-colors duration-200" style={{ background: 'linear-gradient(135deg, #093566 0%, #001D3C 100%)' }}>

      {/* Left Sidebar */}
      <Navbar
        role={role}
        setRole={setRole}
        activeTab={
          activeTab
        }
        setActiveTab={
          setActiveTab
        }
        savedCount={
          role === 'buyer'
            ? backendBookmarkedIds.length
            : bookmarkedIds.length
        }
        rfqCount={
          role === 'buyer'
            ? backendBuyerRfqs.length
            : role === 'supplier'
              ? backendSupplierRfqs.length
              : role === 'admin'
                ? backendAdminRfqs.length
                : rfqs.length
        }
        compareCount={
          comparedIds.length
        }
        ordersCount={
          role === 'buyer' ||
            role === 'supplier'
            ? backendOrders.length
            : orders.length
        }
        theme={theme}
        onToggleTheme={
          handleToggleTheme
        }
        onOpenComparison={() =>
          setIsComparisonOpen(
            true
          )
        }
        onOpenSupplierAuth={() =>
          setIsSupplierAuthOpen(
            true
          )
        }
        onOpenSettings={() =>
          setIsSettingsOpen(
            true
          )
        }
        onExitToLanding={
          logOut
        }
        currentUser={
          currentUser
        }
        activeSupplierName={
          currentSupplier?.name
        }
        query={filters.query}
        onQueryChange={(query) =>
          setFilters((prev) => ({
            ...prev,
            query,
            isAiQuery: false,
          }))
        }
        onSearch={() =>
          setFilters((prev) => ({
            ...prev,
            isAiQuery: prev.query.trim().length > 0,
          }))
        }
        location={filters.location}
      />

      {/* Main Content Area Based on Role & Tab */}
      <div className="flex-1 min-w-0">

        <main className="flex-1">

          {/* GLOBAL SEARCH ENGINE VIEW */}
          {activeTab ===
            'discover' && (
              <div>

                {/* 3D AI Natural Language Search Header */}
                <SearchSection
                  query={
                    filters.query
                  }
                  setQuery={(q) =>
                    setFilters(
                      (prev) => ({
                        ...prev,
                        query: q,
                        isAiQuery:
                          false,
                      })
                    )
                  }
                  onClear={() =>
                    setFilters(
                      (prev) => ({
                        ...prev,
                        query: '',
                        isAiQuery:
                          false,
                      })
                    )
                  }
                  onSearch={() =>
                    setFilters(
                      (prev) => ({
                        ...prev,
                        isAiQuery:
                          prev.query.trim()
                            .length > 0,
                      })
                    )
                  }
                  resultCount={
                    rankedResults.length
                  }
                  onOpenSupplierAuth={() =>
                    setIsSupplierAuthOpen(
                      true
                    )
                  }
                />

                {/* Discovery Grid & Faceted Filters */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Sidebar Filter Column */}
                    <div className="lg:col-span-1">

                      <div className="sticky top-24 space-y-4">

                        <FilterSidebar
                          filters={
                            filters
                          }
                          setFilters={
                            setFilters
                          }
                          totalResults={
                            rankedResults.length
                          }
                        />

                        {/* Global Supplier Registration Promo Card */}
                        <div className="p-4 bg-gradient-to-br from-navy-900 to-navy-950 rounded-2xl text-white border border-navy-800 shadow-card space-y-2.5">

                          <div className="flex items-center space-x-2 text-brand-400">

                            <Building2 className="w-4 h-4" />

                            <span className="font-bold text-xs uppercase tracking-wider">
                              Manufacturer
                              Onboarding
                            </span>

                          </div>

                          <h4 className="font-extrabold text-sm text-white">
                            Expand Your
                            Global Sourcing
                            Demand
                          </h4>

                          <p className="text-[11px] text-navy-300 leading-relaxed">
                            List your 5-axis
                            machines,
                            cleanroom
                            facilities, and
                            ISO
                            certificates.
                          </p>

                          <button
                            onClick={() =>
                              setIsSupplierAuthOpen(
                                true
                              )
                            }
                            className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                          >
                            <span>
                              Supplier Login /
                              Register
                            </span>

                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                        </div>

                      </div>

                    </div>

                    {/* Right Results Column */}
                    <div className="lg:col-span-3 space-y-5">

                      {/* Results Header Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-navy-900 p-4 sm:p-5 rounded-2xl border border-navy-200/90 dark:border-navy-800 shadow-card">

                        <div className="flex items-center space-x-2.5">

                          <h2 className="text-base font-black text-navy-950 dark:text-white">
                            Verified
                            Suppliers
                            Ranked by AI
                            Match Score
                          </h2>

                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                            {
                              rankedResults.length
                            }{' '}
                            Available
                          </span>

                        </div>

                        <div className="flex items-center space-x-2 text-xs text-navy-500 dark:text-navy-400">

                          <span className="font-semibold">
                            Algorithm:
                          </span>

                          <span className="font-bold text-brand-800 dark:text-brand-300 bg-navy-50 dark:bg-navy-800 px-2.5 py-1 rounded-lg border border-navy-200 dark:border-navy-700">
                            Cold-Start
                            Formula (40%
                            Relevance + 25%
                            GST Audit + 20%
                            Metrology + 15%
                            SLA)
                          </span>

                        </div>

                      </div>

                      {/* Supplier Cards List */}
                      {rankedResults.length ===
                        0 ? (
                        <div className="bg-white dark:bg-navy-900 rounded-2xl p-14 text-center border border-navy-200 dark:border-navy-800 shadow-card space-y-4">

                          <div className="w-14 h-14 rounded-2xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center mx-auto text-navy-400">

                            <Layers className="w-7 h-7" />

                          </div>

                          <h3 className="text-lg font-bold text-navy-900 dark:text-white">
                            No matching
                            suppliers found
                          </h3>

                          <p className="text-xs text-navy-500 dark:text-navy-400 max-w-md mx-auto">
                            Try expanding
                            your search
                            query or
                            unchecking
                            filters to
                            browse all
                            verified
                            manufacturers.
                          </p>

                          <button
                            onClick={() =>
                              setFilters({
                                query:
                                  '',
                                isAiQuery:
                                  false,
                                categories:
                                  [],
                                certifications:
                                  [],
                                location:
                                  'All Locations',
                                verifiedOnly:
                                  false,
                                materials:
                                  [],
                              })
                            }
                            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition"
                          >
                            Reset All
                            Filters
                          </button>

                        </div>
                      ) : (
                        <div className="space-y-4">

                          {rankedResults.map(
                            ({
                              supplier,
                            }) => (
                              <SupplierCard
                                key={
                                  supplier.id
                                }
                                supplier={
                                  supplier
                                }
                                isBookmarked={
                                  activeBookmarkedIds.includes(
                                    supplier.id
                                  )
                                }
                                onToggleBookmark={() =>
                                  handleToggleBookmark(
                                    supplier.id
                                  )
                                }
                                isCompared={
                                  comparedIds.includes(
                                    supplier.id
                                  )
                                }
                                onToggleCompare={() =>
                                  toggleCompare(
                                    supplier.id
                                  )
                                }
                                onViewProfile={() =>
                                  setSelectedSupplierForProfile(
                                    supplier
                                  )
                                }
                                onRequestQuote={() =>
                                  setSelectedSupplierForRfq(
                                    supplier
                                  )
                                }
                              />
                            )
                          )}

                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            )}

          {/* BUYER DASHBOARD */}
          {role === 'buyer' &&
            activeTab !==
            'discover' && (
              <BuyerDashboard
                activeTab={
                  activeTab
                }
                rfqs={
                  backendBuyerRfqs
                }
                bookmarkedSuppliers={
                  bookmarkedSuppliers
                }
                onAcceptQuote={
                  handleAcceptQuote
                }
                onViewSupplierProfile={(
                  s
                ) =>
                  setSelectedSupplierForProfile(
                    s
                  )
                }
                onRequestQuoteAgain={(
                  s
                ) =>
                  setSelectedSupplierForRfq(
                    s
                  )
                }
              />
            )}

          {/* SUPPLIER DASHBOARD */}
          {role ===
            'supplier' &&
            activeTab !==
            'discover' && (
              <SupplierDashboard
                activeTab={
                  activeTab
                }
                supplier={
                  currentSupplier
                }
                rfqs={
                  backendSupplierRfqs
                }
                onRespondToRfq={
                  handleSupplierRfqResponse
                }
                onUpdateProfile={
                  handleUpdateSupplierProfile
                }
              />
            )}

          {/* ADMIN DASHBOARD */}
          {role === 'admin' &&
            activeTab !==
            'discover' && (
              <AdminDashboard
                activeTab={
                  activeTab
                }
                suppliers={
                  backendSuppliers
                }
                rfqs={
                  backendAdminRfqs
                }
                analytics={
                  backendAdminAnalytics
                }
                onSupplierUpdate={
                  handleAdminSupplierUpdate
                }
                onVerificationDecision={
                  handleVerificationDecision
                }
              />
            )}

        </main>

        {/* Modals */}
        <SupplierProfileModal
          supplier={
            selectedSupplierForProfile
          }
          onClose={() =>
            setSelectedSupplierForProfile(
              null
            )
          }
          onRequestQuote={(
            sup
          ) =>
            setSelectedSupplierForRfq(
              sup
            )
          }
        />

        <RfqModal
          supplier={
            selectedSupplierForRfq
          }
          onClose={() =>
            setSelectedSupplierForRfq(
              null
            )
          }
          onSubmit={
            submitRfq
          }
        />

        <ComparisonModal
          isOpen={
            isComparisonOpen
          }
          onClose={() =>
            setIsComparisonOpen(
              false
            )
          }
          comparedSuppliers={
            comparedSuppliers
          }
          onRemoveSupplier={(
            id
          ) =>
            toggleCompare(
              id
            )
          }
          onRequestQuote={(
            sup
          ) =>
            setSelectedSupplierForRfq(
              sup
            )
          }
        />

        {/* Supplier Login & New Registration Wizard Modal */}
        <SupplierAuthModal
          isOpen={
            isSupplierAuthOpen
          }
          onClose={() =>
            setIsSupplierAuthOpen(
              false
            )
          }
          suppliers={
            discoverySuppliers
          }
          onLoginSupplier={
            loginSupplier
          }
          onRegisterSupplier={
            registerNewSupplier
          }
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={
            isSettingsOpen
          }
          onClose={() =>
            setIsSettingsOpen(
              false
            )
          }
          theme={
            theme
          }
          setTheme={
            setTheme
          }
          orders={
            role === 'buyer' ||
              role === 'supplier'
              ? backendOrders
              : orders
          }
          role={
            role
          }
          onLogOut={
            logOut
          }
        />

        {/* Global Enterprise Footer */}
        <footer className="bg-navy-950 text-white border-t border-navy-800/80 py-10 px-4 sm:px-6 lg:px-8 mt-16">

          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-navy-400">

            <div className="flex items-center space-x-3.5">

              <div className="relative w-8 h-8 flex items-center justify-center">

                <img
                  src="/constellar-logo.png"
                  alt="Nirman"
                  className="w-8 h-8 object-contain"
                />

              </div>

              <div>

                <span className="font-extrabold text-white text-sm">
                  NIRMAN
                  Discovery OS
                </span>

                <span className="mx-2 text-navy-600">
                  •
                </span>

                <span className="text-navy-300">
                  Innovate.
                  Connect.
                  Build.
                </span>

              </div>

            </div>

            <div className="flex items-center space-x-4">

              <span className="flex items-center space-x-1 font-semibold text-emerald-400">

                <ShieldCheck className="w-4 h-4" />

                <span>
                  GST & Audit
                  Verified
                  Registry
                </span>

              </span>

              <span className="text-navy-700">
                •
              </span>

              <span>
                Pilot Build v1.1
                Active
              </span>

            </div>

          </div>

        </footer>

      </div>

    </div>
  );
}