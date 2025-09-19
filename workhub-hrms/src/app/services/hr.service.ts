import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'hired';
  resumeUrl?: string;
  appliedDate: Date;
  notes?: string;
}

export interface PayrollRecord {
  id: number;
  employeeId: number;
  period: string; // e.g., "2025-09"
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  paymentDate?: Date;
  status: 'draft' | 'processed' | 'paid';
}

export interface Policy {
  id: number;
  title: string;
  category: string;
  content: string;
  effectiveDate: Date;
  lastUpdated: Date;
  status: 'draft' | 'active' | 'archived';
}

@Injectable({
  providedIn: 'root'
})
export class HrService {
  constructor(private apiService: ApiService) {}

  // Recruitment management
  getCandidates(filters?: any): Observable<Candidate[]> {
    return this.apiService.get<Candidate[]>('recruitment/candidates', { params: filters });
  }

  getCandidate(id: number): Observable<Candidate> {
    return this.apiService.get<Candidate>(`recruitment/candidates/${id}`);
  }

  createCandidate(candidate: Omit<Candidate, 'id'>): Observable<Candidate> {
    return this.apiService.post<Candidate, Omit<Candidate, 'id'>>('recruitment/candidates', candidate);
  }

  updateCandidate(id: number, updates: Partial<Candidate>): Observable<Candidate> {
    return this.apiService.patch<Candidate, Partial<Candidate>>(`recruitment/candidates/${id}`, updates);
  }

  deleteCandidate(id: number): Observable<void> {
    return this.apiService.delete<void>(`recruitment/candidates/${id}`);
  }

  // Payroll management
  getPayrollRecords(period?: string): Observable<PayrollRecord[]> {
    const params = period ? { period } : {};
    return this.apiService.get<PayrollRecord[]>('payroll/records', { params });
  }

  getEmployeePayroll(employeeId: number): Observable<PayrollRecord[]> {
    return this.apiService.get<PayrollRecord[]>(`payroll/employees/${employeeId}`);
  }

  createPayrollRecord(record: Omit<PayrollRecord, 'id'>): Observable<PayrollRecord> {
    return this.apiService.post<PayrollRecord, Omit<PayrollRecord, 'id'>>('payroll/records', record);
  }

  updatePayrollRecord(id: number, updates: Partial<PayrollRecord>): Observable<PayrollRecord> {
    return this.apiService.patch<PayrollRecord, Partial<PayrollRecord>>(`payroll/records/${id}`, updates);
  }

  processPayroll(period: string): Observable<any> {
    return this.apiService.post<any, { period: string }>('payroll/process', { period });
  }

  // Policy management
  getPolicies(category?: string): Observable<Policy[]> {
    const params = category ? { category } : {};
    return this.apiService.get<Policy[]>('policies', { params });
  }

  getPolicy(id: number): Observable<Policy> {
    return this.apiService.get<Policy>(`policies/${id}`);
  }

  createPolicy(policy: Omit<Policy, 'id' | 'lastUpdated'>): Observable<Policy> {
    return this.apiService.post<Policy, Omit<Policy, 'id' | 'lastUpdated'>>('policies', policy);
  }

  updatePolicy(id: number, updates: Partial<Policy>): Observable<Policy> {
    return this.apiService.patch<Policy, Partial<Policy>>(`policies/${id}`, updates);
  }

  deletePolicy(id: number): Observable<void> {
    return this.apiService.delete<void>(`policies/${id}`);
  }
}
