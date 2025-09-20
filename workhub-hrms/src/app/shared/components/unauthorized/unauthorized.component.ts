import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
        <p>Current role: {{ currentUserRole || 'Not logged in' }}</p>
        <div class="action-buttons">
          <button (click)="goBack()" class="back-button">Go Back</button>
          <button (click)="goHome()" class="home-button">Go to Dashboard</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }
    
    .unauthorized-content {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }
    
    h1 {
      color: #dc3545;
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 1rem;
      color: #6c757d;
    }
    
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s;
    }
    
    .back-button {
      background-color: #6c757d;
      color: white;
    }
    
    .home-button {
      background-color: #007bff;
      color: white;
    }
    
    button:hover {
      opacity: 0.9;
    }
  `]
})
export class UnauthorizedComponent {
  get currentUserRole(): string | null {
    return this.authService.currentUserValue?.role || null;
  }

  constructor(
    private router: Router, 
    private authService: AuthService
  ) { }

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
