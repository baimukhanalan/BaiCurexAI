
import { StudyRecord, ClinicMetadata, User, AuditLog, ClinicStatus, PricingPlan, StudyType, TriageStatus, RiskLevel, Gender } from '../types';

const STUDIES_KEY = 'baicurex_studies';
const CLINICS_KEY = 'baicurex_clinics';
const USERS_KEY = 'baicurex_users';
const AUDIT_KEY = 'baicurex_audit';

export const databaseService = {
  async saveStudy(study: StudyRecord): Promise<void> {
    const current = await this.getAllStudies();
    // Prevent duplicates by checking ID
    const exists = current.find(s => s.id === study.id);
    if (exists) {
      const updated = current.map(s => s.id === study.id ? study : s);
      localStorage.setItem(STUDIES_KEY, JSON.stringify(updated));
    } else {
      localStorage.setItem(STUDIES_KEY, JSON.stringify([study, ...current]));
    }
  },
  async getAllStudies(): Promise<StudyRecord[]> {
    const data = localStorage.getItem(STUDIES_KEY);
    if (!data) {
      const initial: StudyRecord[] = [
        {
          id: 'S-7721-X',
          clinic_id: 'C-001',
          patient_name: 'Ахметов Серик',
          age: 42,
          gender: Gender.MALE,
          study_type: StudyType.EEG,
          triage_status: TriageStatus.RED,
          risk_level: RiskLevel.HIGH,
          ai_report: "Обнаружена эпилептиформная активность в левой височной области. Рекомендуется клиническая корреляция.",
          quantitative_data: { quality_index: 0.98, triage_reasons: ["Выраженная медленноволновая активность"], epileptiform_activity: true },
          auditor_required: true,
          is_audited: false,
          timestamp: new Date().toISOString(),
          status: 'READY'
        }
      ];
      localStorage.setItem(STUDIES_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  async getClinics(): Promise<ClinicMetadata[]> {
    const data = localStorage.getItem(CLINICS_KEY);
    if (!data) {
      const initial: ClinicMetadata[] = [
        {
          id: 'C-001',
          legal_name: 'Центр Диагностики "Алатау"',
          bin: '990101456789',
          license_number: 'MED-7712',
          contact_person: 'Д-р Алиби',
          contact_email: 'partner@clinic.kz',
          status: ClinicStatus.ACTIVE,
          plan_type: PricingPlan.PRO,
          monthly_report_limit: 300,
          used_reports: 124,
          overage_price: 3000,
          billing_balance: 450000,
          billing_status: 'ACTIVE'
        },
        {
          id: 'C-TEST-ALAN',
          legal_name: 'Test Alpha Jsc (Demo)',
          bin: '123456789012',
          license_number: 'DEMO-999',
          contact_person: 'Alan Test',
          contact_email: 'tahetjsc@gmail.com',
          status: ClinicStatus.ACTIVE,
          plan_type: PricingPlan.ENTERPRISE,
          monthly_report_limit: 9999,
          used_reports: 5,
          overage_price: 0,
          billing_balance: 1000000,
          billing_status: 'ACTIVE'
        }
      ];
      localStorage.setItem(CLINICS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  async updateClinic(clinic: ClinicMetadata): Promise<void> {
    const clinics = await this.getClinics();
    const index = clinics.findIndex(c => c.id === clinic.id);
    if (index !== -1) {
      clinics[index] = clinic;
      localStorage.setItem(CLINICS_KEY, JSON.stringify(clinics));
    }
  },

  async createClinic(clinic: ClinicMetadata): Promise<void> {
    const clinics = await this.getClinics();
    localStorage.setItem(CLINICS_KEY, JSON.stringify([...clinics, clinic]));
  },

  async getUsers(): Promise<User[]> {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      const initial: User[] = [
        { id: 'U-ADMIN', username: 'baicurexai@gmail.com', role: 'ADMIN', is_active: true },
        { id: 'U-ALAN', username: 'tahetjsc@gmail.com', role: 'CLINIC', clinic_id: 'C-TEST-ALAN', is_active: true }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  async createUser(user: User): Promise<void> {
    const users = await this.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  },

  async log(log: AuditLog): Promise<void> {
    const logs = await this.getAuditLogs();
    localStorage.setItem(AUDIT_KEY, JSON.stringify([log, ...logs]));
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const data = localStorage.getItem(AUDIT_KEY);
    if (!data) {
      const initialLogs: AuditLog[] = [
        {
          id: 'L-001',
          actor: 'SYSTEM',
          action: 'AI Model v2.5 Deployment Success',
          timestamp: new Date().toISOString(),
          entity_reference: 'SYS'
        },
        {
          id: 'L-002',
          actor: 'ADMIN',
          action: 'Clinic C-001 balance topped up by 450,000 KZT',
          timestamp: new Date().toISOString(),
          entity_reference: 'C-001'
        }
      ];
      localStorage.setItem(AUDIT_KEY, JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(data);
  }
};
