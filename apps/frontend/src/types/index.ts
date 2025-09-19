export interface Company {
  id: string;
  userId: string;
  name: string;
  sector: string;
  targetRaise: number;
  revenue: number;
  kycVerified: boolean;
  financialsLinked: boolean;
  createdAt: string;
  documents: Document[];
}

export interface Document {
  id: string;
  companyId: string;
  name: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  createdAt: string;
  readAt: string | null;
}

export interface InvestabilityScore {
  score: number;
  reasons: string[];
  recommendation: string;
  breakdown: {
    kyc: number;
    financials: number;
    documents: number;
    revenue: number;
  };
}

export interface CreateCompanyData {
  name: string;
  sector: string;
  targetRaise: number;
  revenue: number;
}

export interface KycData {
  email: string;
}

export interface FinancialsData {
  token: string;
}