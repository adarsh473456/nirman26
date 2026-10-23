export type UserRole = 'buyer' | 'supplier' | 'admin';

export type AppTheme = 'light' | 'dark' | 'system';

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  role: UserRole;
  industry?: string;
  categoryNeed?: string;
}

export interface Certification {
  id: string;
  name: string;
  code: string; // e.g. "ISO 9001:2015", "AS9100D", "IATF 16949"
  issuer: string;
  validUntil: string;
  verified: boolean;
}

export interface Machinery {
  id: string;
  name: string;
  category: string; // e.g. "5-Axis CNC Milling", "Fiber Laser Cutter", "SMT Placement"
  model: string;
  makeYear: number;
  tolerance: string; // e.g. "±0.005 mm"
  workingArea: string; // e.g. "1000 x 600 x 500 mm"
}

export interface Supplier {
  id: string;
  name: string;
  tagline: string;
  category: 'CNC Machining' | 'Sheet Metal & Fabrication' | 'Injection Molding' | 'Electronics & PCBA' | 'Casting & Forging';
  subcategories: string[];
  location: {
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
  };
  verified: boolean;
  verificationDetails: {
    gstNumber: string;
    registeredLegalName: string;
    auditStatus: 'verified' | 'pending' | 'rejected';
    verifiedDate?: string;
    auditNotes?: string;
  };
  rating: number;
  reviewCount: number;
  establishedYear: number;
  employeeCount: string;
  facilitySizeSqFt: number;
  moq: number;
  avgLeadTimeDays: number;
  responseRatePct: number;
  avgResponseTimeHours: number;
  materials: string[];
  certifications: Certification[];
  machinery: Machinery[];
  images: {
    logo: string;
    hero: string;
    facility: string[];
    samples: string[];
  };
  overview: string;
  contact: {
    contactPerson: string;
    title: string;
    email: string;
    phone: string;
    website: string;
    address: string;
  };
  matchScore?: number; // Dynamically computed AI ranking score (0-100)
  matchReasons?: string[];
}

export type RfqStatus = 'submitted' | 'under_review' | 'quoted' | 'accepted' | 'declined';

export interface RfqQuote {
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  currency: string;
  toolingCost: number;
  estimatedLeadDays: number;
  notes: string;
  quotedAt: string;
  validUntil: string;
}

export interface RFQ {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  supplierId: string;
  supplierName: string;
  title: string;
  category: string;
  material: string;
  quantity: number;
  targetUnitBudget?: number;
  targetDeliveryDays: number;
  specifications: string;
  certificationsRequired: string[];
  attachments: {
    name: string;
    sizeKb: number;
    type: string;
  }[];
  status: RfqStatus;
  createdAt: string;
  quote?: RfqQuote;
}

export type OrderStatus = 'in_production' | 'quality_inspection' | 'dispatched' | 'delivered';

export interface SourcingOrder {
  id: string;
  rfqId: string;
  partName: string;
  supplierName: string;
  buyerCompany: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  estDeliveryDate: string;
  trackingNumber: string;
  inspectionCertAttached: boolean;
}

export interface SearchFilterState {
  query: string;
  isAiQuery: boolean;
  categories: string[];
  certifications: string[];
  location: string;
  minMoq?: number;
  maxMoq?: number;
  maxLeadTimeDays?: number;
  verifiedOnly: boolean;
  materials: string[];
}
