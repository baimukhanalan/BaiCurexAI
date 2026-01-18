
export enum StudyType {
  EEG = 'EEG',
  ECG = 'ECG'
}

export enum TriageStatus {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED'
}

export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum ClinicStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  UNDER_COMPLIANCE_REVIEW = 'UNDER_COMPLIANCE_REVIEW',
  CONTRACT_PENDING = 'CONTRACT_PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED'
}

export enum PricingPlan {
  STANDARD = 'STANDARD',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export type AppView = 'landing' | 'auth' | 'onboarding_success' | 'portal';

export type ClinicSubView = 'dashboard' | 'upload' | 'archive' | 'economy' | 'docs' | 'support' | 'detail' | 'sla' | 'integrations';

export type AdminSubView = 
  | 'clinics'
  | 'pending_clinics'
  | 'audit'
  | 'billing'
  | 'accounts'
  | 'logs'
  | 'clinic_detail';

export type TaskStatus = 'IDLE' | 'GETTING_SIGNED_URL' | 'UPLOADING' | 'QUEUED' | 'ANALYZING' | 'GENERATING_REPORT' | 'COMPLETED' | 'FAILED';

export interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'CLINIC';
  clinic_id?: string;
  is_active: boolean;
}

export interface ClinicMetadata {
  id: string;
  legal_name: string;
  bin: string;
  license_number: string;
  contact_person: string;
  contact_email: string;
  status: ClinicStatus;
  plan_type: PricingPlan;
  monthly_report_limit: number;
  used_reports: number;
  overage_price: number;
  billing_balance: number;
  billing_status: 'ACTIVE' | 'INACTIVE';
  access_expiry_date?: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  entity_reference: string;
}

export interface QuantitativeData {
  quality_index: number;
  triage_reasons: string[];
  hr?: number;
  hrv?: number;
  alpha_percent?: number;
  theta_percent?: number;
  delta_percent?: number;
  beta_percent?: number;
  dominant_rhythm?: string;
  slowing_detected?: boolean;
  alpha_frequency_hz?: number;
  alpha_amplitude_uv?: string;
  alpha_reactivity?: string;
  sleep_detected?: boolean;
  sleep_stages?: string[];
  sleep_spindles?: boolean;
  k_complexes?: boolean;
  photic_stimulation_response?: string;
  hyperventilation_response?: string;
  epileptiform_activity?: boolean;
  paroxysm_type?: string;
  localization?: string;
  paroxysm_states?: string[];
  paroxysm_frequency?: string;
  secondary_generalization?: boolean;
  video_correlation?: string;
  rr_variance?: number;
  arrhythmia_pattern?: string | null;
}

export interface StudyRecord {
  id: string;
  clinic_id: string;
  patient_name: string;
  age: number;
  gender: Gender;
  study_type: StudyType;
  triage_status: TriageStatus;
  risk_level: RiskLevel;
  ai_report: string;
  quantitative_data: QuantitativeData;
  auditor_required: boolean;
  is_audited: boolean;
  timestamp: string;
  status: 'READY' | 'PROCESSING' | 'ISSUED';
}

export interface ProcessedResponse {
  study_type: StudyType;
  triage_status: TriageStatus;
  risk_level: RiskLevel;
  ai_report: string;
  quantitative_data: QuantitativeData;
  auditor_required: boolean;
  pdf_url?: string;
}
