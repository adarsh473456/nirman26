'use client';

import { useState } from 'react';
import {
  Supplier,
  RFQ,
  UserRole,
  SearchFilterState,
  RfqQuote,
  AppTheme,
  SourcingOrder,
  UserProfile,
} from '../types';
import {
  rankSuppliers,
} from './rankingAlgorithm';
import { api } from './api';

const INITIAL_FILTERS: SearchFilterState = {
  query: '',
  isAiQuery: false,
  categories: [],
  certifications: [],
  location: 'All Locations',
  verifiedOnly: false,
  materials: [],
};

export function useAppStore() {
  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState<boolean>(false);

  const [
    currentUser,
    setCurrentUser,
  ] = useState<UserProfile | null>(null);

  const [
    role,
    setRoleState,
  ] = useState<UserRole>('buyer');

  const [
    theme,
    setThemeState,
  ] = useState<AppTheme>('light');

  /*
   * Local supplier state starts empty.
   *
   * Real Supplier Discovery data is loaded
   * from FastAPI/PostgreSQL in page.tsx.
   */
  const [
    suppliers,
    setSuppliers,
  ] = useState<Supplier[]>([]);

  const [
    activeSupplierId,
    setActiveSupplierId,
  ] = useState<string>('');

  const [
    filters,
    setFilters,
  ] = useState<SearchFilterState>(
    INITIAL_FILTERS
  );

  /*
   * Bookmarks now start empty.
   *
   * Real Buyer bookmarks are loaded
   * from PostgreSQL in page.tsx.
   */
  const [
    bookmarkedIds,
    setBookmarkedIds,
  ] = useState<string[]>([]);

  /*
   * Comparison remains client-side UI state,
   * but no demo suppliers are preselected.
   */
  const [
    comparedIds,
    setComparedIds,
  ] = useState<string[]>([]);

  /*
   * RFQs start empty.
   *
   * Buyer/Supplier/Admin RFQs are loaded
   * from PostgreSQL through their respective
   * backend endpoints.
   */
  const [
    rfqs,
    setRfqs,
  ] = useState<RFQ[]>([]);

  /*
   * Orders start empty.
   *
   * Real Buyer/Supplier orders are loaded
   * from PostgreSQL in page.tsx.
   */
  const [
    orders,
    setOrders,
  ] = useState<SourcingOrder[]>([]);

  // Modals state
  const [
    selectedSupplierForProfile,
    setSelectedSupplierForProfile,
  ] = useState<Supplier | null>(null);

  const [
    selectedSupplierForRfq,
    setSelectedSupplierForRfq,
  ] = useState<Supplier | null>(null);

  const [
    isComparisonOpen,
    setIsComparisonOpen,
  ] = useState(false);

  const [
    isSupplierAuthOpen,
    setIsSupplierAuthOpen,
  ] = useState(false);

  const [
    isSettingsOpen,
    setIsSettingsOpen,
  ] = useState(false);

  const [
    activeTab,
    setActiveTab,
  ] = useState<string>('discover');

  /*
   * Keep the selected Buyer/Supplier role
   * synchronized with the browser session
   * used by the Next.js backend proxy.
   */
  const syncLoginRole = (
    newRole: UserRole
  ) => {
    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return;
    }

    if (
      newRole === 'buyer' ||
      newRole === 'supplier'
    ) {
      window.localStorage.setItem(
        'nirman_login_role',
        newRole
      );

      document.cookie =
        `nirman_login_role=${newRole}; path=/; SameSite=Lax`;
    }
  };

  /*
   * Public role setter.
   *
   * Admin remains DB-controlled.
   */
  const setRole = (
    newRole: UserRole
  ) => {
    setRoleState(newRole);
    syncLoginRole(newRole);
  };

  // Theme
  const setTheme = (
    newTheme: AppTheme
  ) => {
    setThemeState(newTheme);

    if (
      typeof document !==
      'undefined'
    ) {
      if (
        newTheme === 'dark'
      ) {
        document.documentElement.classList.add(
          'dark'
        );
      } else {
        document.documentElement.classList.remove(
          'dark'
        );
      }
    }
  };

  /*
   * Local ranking remains available for
   * compatibility with existing components.
   *
   * page.tsx performs the primary ranking
   * using the real backend supplier directory.
   */
  const rankedResults =
    rankSuppliers(
      suppliers,
      filters
    );

  /*
   * Authenticate user.
   *
   * User identity now comes from the
   * authenticated profile passed into this
   * function. Demo identities are removed.
   */
  const signInUser = (
    newRole: UserRole,
    profile?: Partial<UserProfile>,
    supplierId?: string
  ) => {
    setRole(newRole);

    if (supplierId) {
      setActiveSupplierId(
        supplierId
      );
    }

    setCurrentUser({
      name:
        profile?.name ||
        '',

      email:
        profile?.email ||
        '',

      company:
        profile?.company ||
        '',

      role:
        newRole,

      industry:
        profile?.industry,

      categoryNeed:
        profile?.categoryNeed,
    });

    setIsAuthenticated(true);

    if (
      newRole === 'admin'
    ) {
      setActiveTab(
        'admin-dashboard'
      );
    } else if (
      newRole === 'supplier'
    ) {
      setActiveTab(
        'supplier-dashboard'
      );
    } else {
      setActiveTab(
        'discover'
      );
    }
  };

  /*
   * Local bookmark action retained only for
   * compatibility with non-Buyer/local state.
   *
   * Authenticated Buyer bookmarks are handled
   * through PostgreSQL in page.tsx.
   */
  const toggleBookmark = (
    supplierId: string
  ) => {
    setBookmarkedIds(
      prev =>
        prev.includes(
          supplierId
        )
          ? prev.filter(
            id =>
              id !==
              supplierId
          )
          : [
            ...prev,
            supplierId,
          ]
    );
  };

  /*
   * Supplier comparison remains session-local.
   */
  const toggleCompare = (
    supplierId: string
  ) => {
    setComparedIds(
      prev => {
        if (
          prev.includes(
            supplierId
          )
        ) {
          return prev.filter(
            id =>
              id !==
              supplierId
          );
        }

        if (
          prev.length >= 4
        ) {
          return prev;
        }

        return [
          ...prev,
          supplierId,
        ];
      }
    );
  };

  /*
   * REAL RFQ SUBMISSION
   *
   * All Supplier IDs are now expected to be
   * PostgreSQL UUIDs.
   *
   * The old "sup-xxx" mock branch has been
   * completely removed.
   */
  const submitRfq = async (
    newRfqData: Omit<
      RFQ,
      | 'id'
      | 'createdAt'
      | 'status'
    >
  ) => {
    try {
      const createdRfq =
        await api.createRfq({
          supplier_id:
            newRfqData.supplierId,

          title:
            newRfqData.title,

          category:
            newRfqData.category ||
            '',

          material:
            newRfqData.material ||
            '',

          quantity:
            Number(
              newRfqData.quantity
            ),

          target_unit_budget:
            newRfqData.targetUnitBudget ??
            null,

          target_delivery_days:
            Number(
              newRfqData.targetDeliveryDays
            ),

          specifications:
            newRfqData.specifications ||
            '',

          certifications_required:
            newRfqData.certificationsRequired ||
            [],

          attachments:
            newRfqData.attachments ||
            [],
        });

      setRfqs(
        prev => [
          createdRfq as RFQ,
          ...prev,
        ]
      );

      return createdRfq;
    } catch (error) {
      console.error(
        'Failed to create RFQ:',
        error
      );

      throw error;
    }
  };

  /*
   * REAL SUPPLIER QUOTATION
   *
   * All RFQ quotation responses now go
   * directly to FastAPI/PostgreSQL.
   */
  const respondToRfq = async (
    rfqId: string,
    quote: RfqQuote
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
              quote.estimatedLeadDays,

            notes:
              quote.notes ||
              '',

            valid_until:
              quote.validUntil ||
              '',
          }
        );

      setRfqs(
        prev => {
          const exists =
            prev.some(
              item =>
                item.id ===
                rfqId
            );

          if (!exists) {
            return [
              updatedRfq as RFQ,
              ...prev,
            ];
          }

          return prev.map(
            item =>
              item.id ===
                rfqId
                ? {
                  ...item,
                  ...updatedRfq,

                  status:
                    updatedRfq.status ||
                    'quoted',

                  quote:
                    updatedRfq.quote ||
                    quote,
                }
                : item
          );
        }
      );

      return updatedRfq;
    } catch (error) {
      console.error(
        'Failed to submit supplier quote:',
        error
      );

      throw error;
    }
  };

  /*
   * REAL BUYER QUOTE ACCEPTANCE
   *
   * Calls FastAPI. The backend updates the
   * RFQ and creates the persistent Order.
   */
  const acceptQuote = async (
    rfqId: string
  ) => {
    try {
      const updatedRfq =
        await api.acceptRfqQuote(
          rfqId
        );

      setRfqs(
        prev =>
          prev.map(
            item =>
              item.id ===
                rfqId
                ? {
                  ...item,
                  ...updatedRfq,
                }
                : item
          )
      );

      return updatedRfq;
    } catch (error) {
      console.error(
        'Failed to accept RFQ quote:',
        error
      );

      throw error;
    }
  };

  /*
   * Legacy local verification setter retained
   * for compatibility only.
   *
   * Real Admin verification is performed by
   * page.tsx through api.reviewVerification().
   */
  const toggleSupplierVerification = (
    supplierId: string
  ) => {
    setSuppliers(
      prev =>
        prev.map(
          sup => {
            if (
              sup.id ===
              supplierId
            ) {
              const nextVerified =
                !sup.verified;

              return {
                ...sup,

                verified:
                  nextVerified,

                verificationDetails: {
                  ...sup.verificationDetails,

                  auditStatus:
                    nextVerified
                      ? 'verified'
                      : 'pending',

                  verifiedDate:
                    nextVerified
                      ? new Date()
                        .toISOString()
                        .split(
                          'T'
                        )[0]
                      : undefined,
                },
              };
            }

            return sup;
          }
        )
    );
  };

  /*
   * Supplier registration result.
   *
   * SupplierAuthModal already creates the real
   * backend supplier before calling this.
   *
   * This function only synchronizes the returned
   * supplier into current client state.
   */
  const registerNewSupplier = (
    newSupplier: Supplier
  ) => {
    setSuppliers(
      prev => {
        const exists =
          prev.some(
            supplier =>
              supplier.id ===
              newSupplier.id
          );

        if (exists) {
          return prev.map(
            supplier =>
              supplier.id ===
                newSupplier.id
                ? newSupplier
                : supplier
          );
        }

        return [
          newSupplier,
          ...prev,
        ];
      }
    );

    setActiveSupplierId(
      newSupplier.id
    );

    setIsAuthenticated(
      true
    );

    setRole(
      'supplier'
    );

    setCurrentUser({
      name:
        newSupplier.contact
          ?.contactPerson ||
        '',

      email:
        newSupplier.contact
          ?.email ||
        '',

      company:
        newSupplier.name ||
        '',

      role:
        'supplier',
    });

    setActiveTab(
      'supplier-dashboard'
    );
  };

  /*
   * Supplier session synchronization.
   *
   * No fabricated supplier identity is used.
   */
  const loginSupplier = (
    supplierId: string
  ) => {
    setActiveSupplierId(
      supplierId
    );

    setRole(
      'supplier'
    );

    const sup =
      suppliers.find(
        s =>
          s.id ===
          supplierId
      );

    setCurrentUser({
      name:
        sup?.contact
          ?.contactPerson ||
        '',

      email:
        sup?.contact
          ?.email ||
        '',

      company:
        sup?.name ||
        '',

      role:
        'supplier',
    });

    setIsAuthenticated(
      true
    );

    setActiveTab(
      'supplier-dashboard'
    );
  };

  /*
   * Local Supplier synchronization.
   *
   * Real persistence is handled by
   * api.updateSupplier() in page.tsx.
   */
  const updateSupplierProfile = (
    updated: Supplier
  ) => {
    setSuppliers(
      prev => {
        const exists =
          prev.some(
            supplier =>
              supplier.id ===
              updated.id
          );

        if (!exists) {
          return [
            updated,
            ...prev,
          ];
        }

        return prev.map(
          supplier =>
            supplier.id ===
              updated.id
              ? updated
              : supplier
        );
      }
    );
  };

  /*
   * Logout.
   */
  const logOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setRoleState('buyer');
    setActiveSupplierId('');
    setActiveTab('discover');
    setFilters(
      INITIAL_FILTERS
    );

    setBookmarkedIds([]);
    setComparedIds([]);
    setRfqs([]);
    setOrders([]);
    setSuppliers([]);

    if (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    ) {
      window.localStorage.removeItem(
        'nirman_login_role'
      );

      document.cookie =
        'nirman_login_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  };

  return {
    isAuthenticated,
    setIsAuthenticated,

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

    rankedResults,

    bookmarkedIds,
    toggleBookmark,

    comparedIds,
    toggleCompare,

    rfqs,
    orders,

    submitRfq,
    respondToRfq,
    acceptQuote,

    toggleSupplierVerification,
    updateSupplierProfile,

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
  };
}