import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  departmentId: number;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  dateApplied: Date;
  resumeUrl?: string;
  notes?: string;
}

export interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  period: string; // E.g. "January 2023"
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  paymentDate?: Date;
}

export interface Policy {
  id: number;
  title: string;
  description: string;
  category: string;
  effectiveDate: Date;
  documentUrl?: string;
  status: 'active' | 'draft' | 'archived';
  departmentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HrService {
  private basePath = 'hr';
  private mockCandidates: Candidate[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '5551234567',
      position: 'Frontend Developer',
      departmentId: 6, // Frontend Development
      status: 'interview',
      dateApplied: new Date(2025, 8, 10),
      notes: 'Strong JavaScript skills, 5 years of experience'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '5559876543',
      position: 'Backend Developer',
      departmentId: 7, // Backend Development
      status: 'screening',
      dateApplied: new Date(2025, 8, 15),
      notes: 'Good Java knowledge, needs technical assessment'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.j@example.com',
      phone: '5552223333',
      position: 'HR Specialist',
      departmentId: 2, // HR
      status: 'offer',
      dateApplied: new Date(2025, 8, 5),
      resumeUrl: 'https://example.com/resume/michael.pdf',
      notes: 'Great cultural fit, ready for offer'
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Williams',
      email: 'emily.w@example.com',
      phone: '5554445555',
      position: 'UX Designer',
      departmentId: 6, // Frontend Development
      status: 'new',
      dateApplied: new Date(2025, 8, 18),
      notes: 'Portfolio looks promising'
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.b@example.com',
      phone: '5556667777',
      position: 'DevOps Engineer',
      departmentId: 9, // DevOps
      status: 'rejected',
      dateApplied: new Date(2025, 8, 8),
      notes: 'Not enough experience with Kubernetes'
    }
  ];
  
  constructor(private apiService: ApiService) {}

  // Recruitment endpoints
  getCandidates(): Observable<Candidate[]> {
    // For development, use mock data
    return of(this.mockCandidates).pipe(delay(500));
    // In production, use the API service
    // return this.apiService.get<Candidate[]>(`${this.basePath}/candidates`);
  }

  getCandidate(id: number): Observable<Candidate> {
    // For development, use mock data
    return of(this.mockCandidates.find(c => c.id === id)!).pipe(delay(300));
    // In production, use the API service
    // return this.apiService.get<Candidate>(`${this.basePath}/candidates/${id}`);
  }

  addCandidate(candidate: Omit<Candidate, 'id'>): Observable<Candidate> {
    // For development, create a new candidate with a generated ID
    const newCandidate = {
      ...candidate,
      id: this.mockCandidates.length > 0 ? 
          Math.max(...this.mockCandidates.map(c => c.id)) + 1 : 1,
      dateApplied: new Date(candidate.dateApplied)
    } as Candidate;

    this.mockCandidates.push(newCandidate);
    return of(newCandidate).pipe(delay(500));

    // In production, use the API service
    // return this.apiService.post<Candidate, Omit<Candidate, 'id'>>(`${this.basePath}/candidates`, candidate);
  }

  updateCandidate(candidate: Candidate): Observable<Candidate> {
    // For development, update an existing candidate
    const index = this.mockCandidates.findIndex(c => c.id === candidate.id);
    if (index !== -1) {
      this.mockCandidates[index] = {
        ...candidate,
        dateApplied: new Date(candidate.dateApplied)
      };
      return of(this.mockCandidates[index]).pipe(delay(500));
    }
    return of(null!).pipe(map(() => { throw new Error('Candidate not found'); }));

    // In production, use the API service
    // return this.apiService.put<Candidate>(`${this.basePath}/candidates/${candidate.id}`, candidate);
  }

  updateCandidateStatus(id: number, newStatus: Candidate['status']): Observable<Candidate> {
    // For development, update just the status of a candidate
    const index = this.mockCandidates.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCandidates[index] = {
        ...this.mockCandidates[index],
        status: newStatus
      };
      return of(this.mockCandidates[index]).pipe(delay(300));
    }
    return of(null!).pipe(map(() => { throw new Error('Candidate not found'); }));
  }

  deleteCandidate(id: number): Observable<void> {
    // For development, remove a candidate from the mock array
    const initialLength = this.mockCandidates.length;
    this.mockCandidates = this.mockCandidates.filter(c => c.id !== id);
    
    if (this.mockCandidates.length === initialLength) {
      return of(null!).pipe(map(() => { throw new Error('Candidate not found'); }));
    }
    
    return of(undefined).pipe(delay(500));

    // In production, use the API service
    // return this.apiService.delete<void>(`${this.basePath}/candidates/${id}`);
  }

  // Payroll management
  getPayrollRecords(period?: string): Observable<PayrollRecord[]> {
    // For development, use mock data
    return of([
      {
        id: 1,
        employeeId: 1,
        employeeName: 'Admin User',
        period: 'September 2025',
        baseSalary: 5000,
        bonuses: 500,
        deductions: 1000,
        netSalary: 4500,
        status: 'paid' as 'draft' | 'approved' | 'paid',
        paymentDate: new Date('2025-09-15')
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'HR Manager',
        period: 'September 2025',
        baseSalary: 4500,
        bonuses: 200,
        deductions: 900,
        netSalary: 3800,
        status: 'paid' as 'draft' | 'approved' | 'paid',
        paymentDate: new Date('2025-09-15')
      }
    ].filter(record => !period || record.period === period))
      .pipe(delay(500));
    
    // For production, use this code with HttpParams
    // let httpParams = new HttpParams();
    // if (period) {
    //   httpParams = httpParams.set('period', period);
    // }
    // return this.apiService.get<PayrollRecord[]>('payroll/records', httpParams);
  }

  getEmployeePayroll(employeeId: number): Observable<PayrollRecord[]> {
    // For development, use mock data
    return of([
      {
        id: 1,
        employeeId: employeeId,
        employeeName: 'Employee Name',
        period: 'September 2025',
        baseSalary: 3500,
        bonuses: 200,
        deductions: 700,
        netSalary: 3000,
        status: 'paid' as 'draft' | 'approved' | 'paid',
        paymentDate: new Date('2025-09-15')
      },
      {
        id: 2,
        employeeId: employeeId,
        employeeName: 'Employee Name',
        period: 'August 2025',
        baseSalary: 3500,
        bonuses: 0,
        deductions: 700,
        netSalary: 2800,
        status: 'paid' as 'draft' | 'approved' | 'paid',
        paymentDate: new Date('2025-08-15')
      }
    ]).pipe(delay(500));
    
    // For production, use the API service
    // return this.apiService.get<PayrollRecord[]>(`payroll/employees/${employeeId}`);
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
    // For development, use mock data
    return of([
      {
        id: 1,
        title: 'Employee Code of Conduct',
        description: 'Guidelines for professional behavior in the workplace',
        category: 'HR',
        effectiveDate: new Date('2025-01-01'),
        status: 'active' as 'draft' | 'active' | 'archived'
      },
      {
        id: 2,
        title: 'Remote Work Policy',
        description: 'Rules and procedures for working remotely',
        category: 'Operations',
        effectiveDate: new Date('2025-03-15'),
        status: 'active' as 'draft' | 'active' | 'archived'
      },
      {
        id: 3,
        title: 'IT Security Policy',
        description: 'Guidelines for protecting company data and systems',
        category: 'IT',
        effectiveDate: new Date('2025-02-10'),
        status: 'active' as 'draft' | 'active' | 'archived'
      }
    ].filter(policy => !category || policy.category === category))
      .pipe(delay(500));
    
    // For production, use this code with HttpParams
    // let httpParams = new HttpParams();
    // if (category) {
    //   httpParams = httpParams.set('category', category);
    // }
    // return this.apiService.get<Policy[]>('policies', httpParams);
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
