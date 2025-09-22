# WorkHub HRMS - Backend Integration

This document details the integration approach between the Angular frontend and the backend API services for the WorkHub HRMS system.

---

## Table of Contents

1. [API Communication Strategy](#api-communication-strategy)
2. [Authentication & Authorization](#authentication--authorization)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Error Handling](#error-handling)
5. [Data Models](#data-models)
6. [Integration Testing](#integration-testing)
7. [Mock Backend Services](#mock-backend-services)

---

## API Communication Strategy

### Core Principles

- **REST Architectural Style**: API follows RESTful principles
- **JSON Data Format**: Request/response bodies use JSON format
- **JWT Authentication**: Bearer token authentication for secure communication
- **HTTP Status Codes**: Standard HTTP status codes for response status
- **Versioned API**: URLs include version number for backward compatibility

### API Service Implementation

The frontend application implements a centralized API service layer to encapsulate all backend communication:

```typescript
// Core API service pattern
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  get<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(url), options)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  // Other HTTP methods (post, put, delete, etc.)
}
```

### Service Organization

- **Core API Service**: Base service with common HTTP functionality
- **Feature Services**: Domain-specific services extending the core API service
- **Mock Services**: Development implementations simulating backend responses

---

## Authentication & Authorization

### Authentication Flow

1. **Login Request**: Frontend sends credentials to auth endpoint
2. **Token Generation**: Backend validates credentials and returns JWT tokens
3. **Token Storage**: Frontend securely stores tokens in browser storage
4. **Token Usage**: Tokens attached to subsequent API requests via interceptor
5. **Token Refresh**: Automatic refresh of expiring tokens
6. **Logout**: Token removal and session termination

### Authorization Integration

- **Role-based Access**: Backend enforces role permissions on endpoints
- **Permission Propagation**: User permissions included in JWT claims
- **Frontend Guards**: Angular route guards using permission information
- **UI Adaptation**: Interface elements conditionally displayed based on permissions

### JWT Structure

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "MANAGER",
  "permissions": ["VIEW_EMPLOYEES", "APPROVE_LEAVE"],
  "departmentId": "dept-123",
  "iat": 1516239022,
  "exp": 1516246222
}
```

---

## API Endpoints Reference

### Authentication Module

| Endpoint | Method | Description | Request Payload | Response |
|----------|--------|-------------|-----------------|----------|
| `/api/auth/login` | POST | Authenticate user | `{ username, password }` | `{ accessToken, refreshToken, user }` |
| `/api/auth/refresh-token` | POST | Refresh auth token | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| `/api/auth/logout` | POST | Logout user | `{ refreshToken }` | `{ success: true }` |

### Employee Module

| Endpoint | Method | Description | Request Payload | Response |
|----------|--------|-------------|-----------------|----------|
| `/api/employees` | GET | Get all employees | Query parameters | Employee collection with pagination |
| `/api/employees/{id}` | GET | Get employee details | - | Employee details |
| `/api/employees` | POST | Create new employee | Employee data | Created employee |
| `/api/employees/{id}` | PUT | Update employee | Updated employee data | Updated employee |
| `/api/employees/{id}` | DELETE | Delete employee | - | Success status |

### Leave Management Module

| Endpoint | Method | Description | Request Payload | Response |
|----------|--------|-------------|-----------------|----------|
| `/api/leave-requests` | GET | Get leave requests | Query parameters | Leave requests collection |
| `/api/leave-requests/{id}` | GET | Get leave request details | - | Leave request details |
| `/api/leave-requests` | POST | Create leave request | Leave request data | Created leave request |
| `/api/leave-requests/{id}/approve` | PUT | Approve leave request | Approval data | Updated leave request |
| `/api/leave-requests/{id}/reject` | PUT | Reject leave request | Rejection data | Updated leave request |
| `/api/leave-balances/{employeeId}` | GET | Get employee leave balances | - | Leave balance details |

### Performance Module

| Endpoint | Method | Description | Request Payload | Response |
|----------|--------|-------------|-----------------|----------|
| `/api/reviews` | GET | Get performance reviews | Query parameters | Review collection |
| `/api/reviews/{id}` | GET | Get review details | - | Review details |
| `/api/reviews` | POST | Create performance review | Review data | Created review |
| `/api/goals` | GET | Get performance goals | Query parameters | Goals collection |
| `/api/goals` | POST | Create performance goal | Goal data | Created goal |

### Department Module

| Endpoint | Method | Description | Request Payload | Response |
|----------|--------|-------------|-----------------|----------|
| `/api/departments` | GET | Get all departments | - | Department collection |
| `/api/departments/{id}` | GET | Get department details | - | Department details |
| `/api/departments` | POST | Create department | Department data | Created department |

### Admin Module

| Endpoint | Method | Description | Request Payload | Response |
|----------|--------|-------------|-----------------|----------|
| `/api/users` | GET | Get all users | Query parameters | User collection |
| `/api/users/{id}` | GET | Get user details | - | User details |
| `/api/users` | POST | Create user | User data | Created user |
| `/api/roles` | GET | Get all roles | - | Role collection |
| `/api/roles/{id}` | GET | Get role details | - | Role details |

---

## Error Handling

### Error Response Structure

```json
{
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "error": "Invalid email format"
    },
    {
      "field": "startDate",
      "error": "Start date must be in the future"
    }
  ],
  "timestamp": "2023-11-15T10:30:45.123Z",
  "path": "/api/employees"
}
```

### Error Handling Implementation

```typescript
// Error handling service
@Injectable({ providedIn: 'root' })
export class ErrorHandlingService {
  handleHttpError(error: HttpErrorResponse): Observable<never> {
    // Log error
    console.error('API Error:', error);
    
    // Parse error response
    const errorResponse = this.parseErrorResponse(error);
    
    // Notification handling
    this.notificationService.showError(errorResponse.userMessage);
    
    // Authentication errors
    if (error.status === 401) {
      this.authService.handleAuthError();
    }
    
    // Return observable with error
    return throwError(() => errorResponse);
  }
  
  private parseErrorResponse(error: HttpErrorResponse): ErrorModel {
    // Implementation details
  }
}
```

### Common Error Scenarios

| HTTP Status | Error Code | Description | Frontend Handling |
|-------------|------------|-------------|------------------|
| 400 | VALIDATION_ERROR | Input validation failed | Display field-specific errors |
| 401 | UNAUTHORIZED | Invalid/expired authentication | Redirect to login |
| 403 | FORBIDDEN | Insufficient permissions | Display permission error |
| 404 | NOT_FOUND | Resource not found | Display not found message |
| 409 | CONFLICT | Resource conflict | Display conflict resolution |
| 422 | BUSINESS_RULE_VIOLATION | Business rule violated | Display business error |
| 500 | SERVER_ERROR | Internal server error | Display generic error |

---

## Data Models

### Core Models

#### User Model

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  departmentId: string;
  isActive: boolean;
  lastLogin?: Date;
}

enum UserRole {
  ADMIN = 'ADMIN',
  HR = 'HR',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}
```

#### Employee Model

```typescript
interface Employee {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: Department;
  manager?: Employee;
  hireDate: Date;
  status: EmployeeStatus;
  address?: Address;
  emergencyContact?: EmergencyContact;
}

enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  ONBOARDING = 'ONBOARDING',
  OFFBOARDING = 'OFFBOARDING',
  TERMINATED = 'TERMINATED',
  ON_LEAVE = 'ON_LEAVE'
}
```

#### Department Model

```typescript
interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string;
  parentDepartmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Feature-specific Models

Each feature module defines its own models reflecting the backend data structures:

- Leave Request models
- Performance Review models
- Attendance models
- Payroll models
- etc.

---

## Integration Testing

### Testing Strategy

1. **Unit Tests**: Mock API services for component testing
2. **Integration Tests**: Test API service implementation with HTTP testing controller
3. **E2E Tests**: Full-stack tests with real API integration

### API Mock Framework

```typescript
// Example of API mock service
@Injectable()
export class MockEmployeeService {
  private employees: Employee[] = [/* mock data */];

  getEmployees(): Observable<Employee[]> {
    return of(this.employees).pipe(delay(100));
  }
  
  getEmployee(id: string): Observable<Employee> {
    const employee = this.employees.find(e => e.id === id);
    if (!employee) {
      return throwError(() => new Error('Employee not found'));
    }
    return of(employee).pipe(delay(100));
  }
  
  // Additional methods
}
```

---

## Mock Backend Services

During development, the frontend uses mock services to simulate backend API responses.

### Mock Service Implementation

```typescript
// Mock API interceptor
@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // In-memory database
    const { users, employees, departments } = this.db;
    
    // Handle authentication
    if (request.url.endsWith('/api/auth/login') && request.method === 'POST') {
      return this.handleLogin(request);
    }
    
    // Handle other routes
    if (request.url.match(/\/api\/employees\/\d+$/) && request.method === 'GET') {
      return this.handleGetEmployee(request);
    }
    
    // Pass through any unhandled requests
    return next.handle(request);
  }
  
  // Implementation of specific handlers
}
```

### Development Configuration

The application uses environment configuration to switch between real and mock backends:

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: '/api',
  useMockBackend: true
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.workhub-hrms.com/api',
  useMockBackend: false
};
```

---

## Deployment Integration

### Backend Service Discovery

- **Development**: Local backend service on port 8080
- **Staging**: Backend service with staging configuration
- **Production**: Load-balanced backend service

### CORS Configuration

Backend CORS settings to allow frontend applications:

```
Access-Control-Allow-Origin: https://workhub-hrms.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Environment Configuration

Frontend environment configuration for each deployment target:

```typescript
// environment.staging.ts
export const environment = {
  production: false,
  staging: true,
  apiUrl: 'https://staging-api.workhub-hrms.com/api',
  useMockBackend: false
};
```

---

*Document maintained by the WorkHub HRMS Development Team*
