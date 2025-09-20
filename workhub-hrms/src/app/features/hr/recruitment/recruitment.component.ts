import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HrService } from '../../../services/hr.service';
import { TenantService } from '../../../core/services/tenant.service';
import { Department } from '../../../core/models/department.model';

interface Candidate {
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

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss']
})
export class RecruitmentComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  departments: Department[] = [];
  selectedCandidate: Candidate | null = null;
  showCandidateForm = false;
  candidateForm: FormGroup;
  searchForm: FormGroup;
  loading = false;
  submitting = false;
  formMode: 'add' | 'edit' = 'add';

  constructor(
    private fb: FormBuilder,
    private hrService: HrService,
    private tenantService: TenantService
  ) {
    // Initialize search form
    this.searchForm = this.fb.group({
      searchTerm: [''],
      statusFilter: ['all'],
      departmentFilter: ['all']
    });

    // Initialize candidate form
    this.candidateForm = this.createCandidateForm();
  }

  ngOnInit(): void {
    this.loadCandidates();
    this.loadDepartments();
    
    // Listen to search form changes
    this.searchForm.valueChanges.subscribe(() => {
      this.filterCandidates();
    });
  }

  createCandidateForm(): FormGroup {
    return this.fb.group({
      id: [null],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('^[0-9]{10}$')],
      position: ['', Validators.required],
      departmentId: ['', Validators.required],
      status: ['new', Validators.required],
      dateApplied: [new Date(), Validators.required],
      resumeUrl: [''],
      notes: ['']
    });
  }

  loadCandidates(): void {
    this.loading = true;
    this.hrService.getCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
        this.filterCandidates();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading candidates', err);
        this.loading = false;
      }
    });
  }

  loadDepartments(): void {
    this.tenantService.getAllDepartments().subscribe(departments => {
      this.departments = departments;
    });
  }

  filterCandidates(): void {
    const { searchTerm, statusFilter, departmentFilter } = this.searchForm.value;
    
    let filtered = [...this.candidates];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(candidate => 
        candidate.firstName.toLowerCase().includes(term) || 
        candidate.lastName.toLowerCase().includes(term) || 
        candidate.email.toLowerCase().includes(term) || 
        candidate.position.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === statusFilter);
    }
    
    // Apply department filter
    if (departmentFilter !== 'all') {
      const deptId = parseInt(departmentFilter, 10);
      filtered = filtered.filter(candidate => candidate.departmentId === deptId);
    }
    
    this.filteredCandidates = filtered;
  }

  openAddCandidateForm(): void {
    this.formMode = 'add';
    this.candidateForm.reset();
    this.candidateForm.patchValue({
      status: 'new',
      dateApplied: new Date()
    });
    this.showCandidateForm = true;
  }

  openEditCandidateForm(candidate: Candidate): void {
    this.formMode = 'edit';
    this.candidateForm.patchValue(candidate);
    this.showCandidateForm = true;
    this.selectedCandidate = candidate;
  }

  closeForm(): void {
    this.showCandidateForm = false;
    this.candidateForm.reset();
    this.selectedCandidate = null;
  }

  viewCandidateDetails(candidate: Candidate): void {
    this.selectedCandidate = candidate;
  }

  updateCandidateStatus(candidate: Candidate, newStatus: Candidate['status']): void {
    this.hrService.updateCandidateStatus(candidate.id, newStatus).subscribe({
      next: (updatedCandidate) => {
        const index = this.candidates.findIndex(c => c.id === candidate.id);
        if (index !== -1) {
          this.candidates[index] = updatedCandidate;
          this.filterCandidates();
        }
      },
      error: (err) => {
        console.error('Error updating candidate status', err);
      }
    });
  }

  submitCandidateForm(): void {
    if (this.candidateForm.invalid) {
      // Mark fields as touched to trigger validation messages
      Object.keys(this.candidateForm.controls).forEach(key => {
        this.candidateForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const candidateData = this.candidateForm.value;

    if (this.formMode === 'add') {
      this.hrService.addCandidate(candidateData).subscribe({
        next: (newCandidate) => {
          this.candidates.push(newCandidate);
          this.filterCandidates();
          this.closeForm();
          this.submitting = false;
        },
        error: (err) => {
          console.error('Error adding candidate', err);
          this.submitting = false;
        }
      });
    } else {
      this.hrService.updateCandidate(candidateData).subscribe({
        next: (updatedCandidate) => {
          const index = this.candidates.findIndex(c => c.id === updatedCandidate.id);
          if (index !== -1) {
            this.candidates[index] = updatedCandidate;
            this.filterCandidates();
          }
          this.closeForm();
          this.submitting = false;
        },
        error: (err) => {
          console.error('Error updating candidate', err);
          this.submitting = false;
        }
      });
    }
  }

  deleteCandidate(candidate: Candidate): void {
    if (confirm(`Are you sure you want to delete ${candidate.firstName} ${candidate.lastName}?`)) {
      this.hrService.deleteCandidate(candidate.id).subscribe({
        next: () => {
          this.candidates = this.candidates.filter(c => c.id !== candidate.id);
          this.filterCandidates();
          if (this.selectedCandidate?.id === candidate.id) {
            this.selectedCandidate = null;
          }
        },
        error: (err) => {
          console.error('Error deleting candidate', err);
        }
      });
    }
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(d => d.id === departmentId);
    return department ? department.name : 'Unknown';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'new': return 'status-new';
      case 'screening': return 'status-screening';
      case 'interview': return 'status-interview';
      case 'offer': return 'status-offer';
      case 'hired': return 'status-hired';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }
}
