import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Role, roleHierarchy, User } from '../../models/user.model';
import { MOCK_USERS } from '../../data/mock-users';
import { SecurityContextService } from './security-context.service';

/**
 * Authentication Service - Handles user authentication and token management
 */
@Injectable()
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor(
    private http: HttpClient,
    private securityContext: SecurityContextService
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    const token = localStorage.getItem(this.TOKEN_KEY);
    
    if (storedUser && token) {
      const user = JSON.parse(storedUser) as User;
      user.token = token; // Add token to user object
      this.currentUserSubject.next(user);
      this.securityContext.setUser(user);
    }
  }

  login(email: string, password: string): Observable<User> {
    // Simulate API call with mock data
    return this.mockLogin({ email, password }).pipe(
      // Add delay to simulate network request
      delay(800),
      tap(response => {
        if (response?.user && response?.token) {
          const { user, token } = response;
          user.token = token;
          localStorage.setItem(this.TOKEN_KEY, token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.securityContext.setUser(user);
        }
      }),
      map(response => response.user),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  // Mock login - simulates API call
  private mockLogin(request: LoginRequest): Observable<LoginResponse> {
    const { email, password } = request;
    const user = MOCK_USERS.find(u => u.email === email);

    // For demo purposes, any password will work
    if (user) {
      const token = this.generateMockToken(user);
      return of({ user, token });
    }

    return of(null).pipe(
      delay(500), // Simulate network latency
      map(() => {
        throw new Error('Invalid email or password');
      })
    );
  }

  private generateMockToken(user: User): string {
    // Create a simple mock JWT
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      sub: user.id.toString(), 
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      exp: new Date().getTime() + 3600000 // 1 hour from now
    }));
    const signature = btoa('mock_signature'); // In a real app, this would be cryptographically secure

    return `${header}.${payload}.${signature}`;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.securityContext.clearUser();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserValue;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(requiredRole: Role | Role[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRoles = roleHierarchy[user.role];
    
    // Check if any of the required roles is in the user's role hierarchy
    return requiredRoles.some(role => userRoles.includes(role));
  }

  /**
   * Check if the user has at least one of the required roles
   */
  hasAnyRole(roles: Role[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Check if the user has all of the required roles
   */
  hasAllRoles(roles: Role[]): boolean {
    return roles.every(role => this.hasRole(role));
  }
}
