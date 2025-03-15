
export interface ContractParty {
  name: string;
  email: string;
  organization?: string;
  address?: string;
}

export interface ContractDetails {
  placeOfService: string;
  startDate: string;
  endDate: string;
  rate: string;
  mealsIncluded: boolean;
  additionalDetails?: string;
}

export interface ContractAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ContractHistoryItem {
  id: string;
  date: string;
  action: string;
  user: string;
  notes?: string;
}

export interface Contract {
  id: string;
  subject: string;
  type: string;
  facilitatedBy: string;
  status: 'draft' | 'pending_review' | 'active' | 'in_progress' | 'pending_completion' | 'completed' | 'cancelled';
  progress: number;
  from: ContractParty;
  to: ContractParty;
  details: ContractDetails;
  attachments?: ContractAttachment[];
  history?: ContractHistoryItem[];
  createdAt: string;
  updatedAt: string;
}
