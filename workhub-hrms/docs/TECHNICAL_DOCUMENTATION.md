# WorkHub HRMS - Technical Documentation

This document provides a comprehensive overview of the WorkHub HRMS application architecture, components, and implementation details. It serves as a reference guide for developers joining the project.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Completed Features & Iterations](#completed-features--iterations)
3. [Core Architecture](#core-architecture)
4. [Authentication & Security](#authentication--security)
5. [Feature Modules](#feature-modules)
6. [Shared Components](#shared-components)
7. [Services & Utilities](#services--utilities)
8. [Development Guidelines](#development-guidelines)

---

## Project Overview

WorkHub HRMS is a comprehensive Human Resource Management System built with Angular. The application implements a modular architecture with role-based access control and follows reactive programming patterns throughout.

**Technology Stack:**
- Angular 16+
- Angular Material
- Tailwind CSS
- RxJS
- JWT Authentication

---

## Completed Features & Iterations

### Authentication & IAM Basics
**Status:** Completed
**Description:** Core authentication system, login/logout functionality, JWT token management, and role-based permissions framework.

### Multi-Tenant Isolation
**Status:** Completed
**Description:** Department-based multi-tenancy allowing data isolation between departments.

### Feature Modules (HR Workflows)
**Status:** Completed
**Description:** Core HR processes including employee management, leave management, and performance reviews.

### Async Processing Simulation
**Status:** Completed
**Description:** Background processing simulation for time-consuming operations.

### Networking & Security (Front-end Simulation)
**Status:** Completed
**Description:** API integration patterns, error handling, and security protocols.

### UI/UX Enhancements
**Status:** Completed
**Description:** Modern UI with responsive design, accessibility improvements, and consistent user experience.

---

## Core Architecture

### Core Module
**Purpose:** Contains singleton services, interceptors, and utilities used throughout the application.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/core/core.module.ts` | Main core module configuration | Angular modules |
| `/src/app/core/services/logger.service.ts` | Centralized logging service | None |
| `/src/app/core/interceptors/error-handler.interceptor.ts` | Global HTTP error handling | HttpClient, Router |
| `/src/app/core/guards/module-import.guard.ts` | Prevents multiple imports of Core module | None |

### Main Layout
**Purpose:** Provides the main application layout structure with header, sidebar, and content area.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/core/components/main-layout/main-layout.component.ts` | Main layout container component | Router, AuthService |
| `/src/app/core/components/main-layout/main-layout.component.html` | Layout template with responsive design | Angular Material |
| `/src/app/core/components/main-layout/main-layout.component.scss` | Layout styling | None |

---

## Authentication & Security

### Authentication Module
**Purpose:** Handles user authentication, token management, and security contexts.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/core/security/security.module.ts` | Security module configuration | Angular modules |
| `/src/app/core/security/services/auth.service.ts` | Authentication service for login/logout | HttpClient, JwtHelperService |
| `/src/app/core/security/services/security-context.service.ts` | Manages authenticated user context | AuthService, LocalStorageService |
| `/src/app/core/security/guards/auth.guard.ts` | Route protection based on authentication status | Router, AuthService |
| `/src/app/core/security/guards/role.guard.ts` | Role-based route protection | Router, SecurityContextService |
| `/src/app/core/security/models/user.model.ts` | User and role interfaces | None |
| `/src/app/core/security/interceptors/auth.interceptor.ts` | Adds authentication tokens to requests | AuthService |

### Multi-Tenancy
**Purpose:** Implements department-based data isolation and context switching.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/core/security/services/tenant.service.ts` | Manages tenant/department context | SecurityContextService |
| `/src/app/shared/components/department-selector/department-selector.component.ts` | Department selection UI | TenantService, DepartmentService |
| `/src/app/core/interceptors/tenant.interceptor.ts` | Adds tenant context to API calls | TenantService |

---

## Feature Modules

### Dashboard Module
**Purpose:** Provides role-specific dashboards with key metrics and quick actions.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/features/dashboard/dashboard.module.ts` | Dashboard module configuration | SharedModule, RouterModule |
| `/src/app/features/dashboard/dashboard.component.ts` | Main dashboard component with role-based display | SecurityContextService, DashboardService |
| `/src/app/features/dashboard/components/employee-widget/employee-widget.component.ts` | Employee dashboard widget | EmployeeService |
| `/src/app/features/dashboard/components/manager-widget/manager-widget.component.ts` | Manager dashboard widget | ManagerService, TeamService |
| `/src/app/features/dashboard/components/hr-analytics-widget/hr-analytics-widget.component.ts` | HR analytics widget | AnalyticsService, ChartService |
| `/src/app/features/dashboard/components/admin-widget/admin-widget.component.ts` | Admin dashboard widget | AdminService, SystemService |
| `/src/app/features/dashboard/services/dashboard.service.ts` | Dashboard data service | ApiService, SecurityContextService |
| `/src/app/features/dashboard/services/dashboard.tokens.ts` | Injection tokens for dashboard services | None |

### Employee Module
**Purpose:** Manages employee records, profiles, and related functionality.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/features/employee/employee.module.ts` | Employee module configuration | SharedModule, RouterModule |
| `/src/app/features/employee/employee-list/employee-list.component.ts` | Employee directory listing | EmployeeService, TenantService |
| `/src/app/features/employee/employee-details/employee-details.component.ts` | Employee profile details | EmployeeService, DocumentService |
| `/src/app/features/employee/employee-form/employee-form.component.ts` | Employee creation/editing form | EmployeeService, ValidationService |
| `/src/app/features/employee/models/employee.model.ts` | Employee data models and interfaces | None |
| `/src/app/features/employee/services/employee.service.ts` | Employee data service | ApiService, TenantService |

### Leave Management Module
**Purpose:** Manages employee leave requests, approvals, and balances.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/features/leave/leave.module.ts` | Leave management module | SharedModule, RouterModule |
| `/src/app/features/leave/leave-request/leave-request.component.ts` | Leave request form | LeaveService, NotificationService |
| `/src/app/features/leave/leave-calendar/leave-calendar.component.ts` | Team leave calendar | LeaveService, EmployeeService |
| `/src/app/features/leave/leave-approval/leave-approval.component.ts` | Manager approval interface | LeaveService, WorkflowService |
| `/src/app/features/leave/models/leave.model.ts` | Leave request models | None |
| `/src/app/features/leave/services/leave.service.ts` | Leave management service | ApiService, WorkflowService |

### HR Module
**Purpose:** Handles HR processes including recruitment, onboarding, and performance management.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/features/hr/hr.module.ts` | HR module configuration | SharedModule, RouterModule |
| `/src/app/features/hr/recruitment/recruitment.component.ts` | Recruitment tracking | RecruitmentService, WorkflowService |
| `/src/app/features/hr/onboarding/onboarding.component.ts` | Employee onboarding process | OnboardingService, WorkflowService |
| `/src/app/features/hr/offboarding/offboarding.component.ts` | Employee offboarding process | OffboardingService, WorkflowService |
| `/src/app/features/hr/performance/performance-reviews.component.ts` | Performance review management | PerformanceService |
| `/src/app/features/hr/services/hr.service.ts` | Core HR service | ApiService, TenantService |
| `/src/app/features/hr/services/recruitment.service.ts` | Recruitment management service | ApiService, WorkflowService |
| `/src/app/features/hr/services/performance.service.ts` | Performance management service | ApiService, EmployeeService |

### Manager Module
**Purpose:** Provides team management tools for managers.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/features/manager/manager.module.ts` | Manager module configuration | SharedModule, RouterModule |
| `/src/app/features/manager/team-management/team-management.component.ts` | Team overview | ManagerService, EmployeeService |
| `/src/app/features/manager/performance-reviews/performance-reviews.component.ts` | Team performance review management | PerformanceService, ManagerService |
| `/src/app/features/manager/services/manager.service.ts` | Manager-related services | ApiService, EmployeeService |
| `/src/app/features/manager/models/team.model.ts` | Team data models | None |

### Admin Module
**Purpose:** System administration interface for managing users, roles, and settings.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/features/admin/admin.module.ts` | Admin module configuration | SharedModule, RouterModule |
| `/src/app/features/admin/user-management/user-management.component.ts` | User account management | AdminService, UserService |
| `/src/app/features/admin/role-management/role-management.component.ts` | Role and permission management | AdminService |
| `/src/app/features/admin/system-settings/system-settings.component.ts` | System configuration | AdminService |
| `/src/app/features/admin/services/admin.service.ts` | Admin functionality services | ApiService, SecurityContextService |

### Demo Module
**Purpose:** Demonstration components for key features.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/features/demo/demo.module.ts` | Demo module configuration | SharedModule, RouterModule |
| `/src/app/features/demo/security-demo/security-demo.component.ts` | Security features demonstration | SecurityContextService |
| `/src/app/features/demo/notification-demo/notification-demo.component.ts` | Notification system demo | NotificationService |
| `/src/app/features/demo/workflow-demo/workflow-demo.component.ts` | Workflow process simulation | WorkflowService, NotificationService |

---

## Shared Components

### Shared Module
**Purpose:** Provides reusable components, directives, and pipes.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/shared/shared.module.ts` | Shared module configuration | CommonModule, MaterialModule |
| `/src/app/shared/components/page-header/page-header.component.ts` | Consistent page headers | None |
| `/src/app/shared/components/data-table/data-table.component.ts` | Reusable data table | Angular Material |
| `/src/app/shared/components/notification-toast-container/notification-toast-container.component.ts` | Toast notification container | NotificationService |
| `/src/app/shared/components/loading-spinner/loading-spinner.component.ts` | Loading indicator | None |
| `/src/app/shared/directives/permission.directive.ts` | Permission-based element visibility | SecurityContextService |
| `/src/app/shared/directives/has-role.directive.ts` | Role-based element visibility | SecurityContextService |
| `/src/app/shared/pipes/format-date.pipe.ts` | Date formatting utility | None |
| `/src/app/shared/pipes/safe-html.pipe.ts` | Sanitizes HTML for display | DomSanitizer |

---

## Services & Utilities

### API and Network Services
**Purpose:** Handles API communication, request/response transformation, and error handling.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/core/network/services/api.service.ts` | Core API service | HttpClient, ErrorHandlingService |
| `/src/app/core/network/interceptors/api.interceptor.ts` | API request/response manipulation | None |
| `/src/app/core/network/interceptors/error-handling.interceptor.ts` | Centralized error handling | NotificationService, LoggerService |
| `/src/app/core/network/services/network-security.service.ts` | Network security features | None |

### Workflow System
**Purpose:** Implements multi-step approval processes and task management.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/core/services/workflow.service.ts` | Workflow processing service | ApiService, NotificationService |
| `/src/app/core/models/workflow.model.ts` | Workflow models and interfaces | None |

### Notification System
**Purpose:** Implements application notifications including toasts and in-app messages.

#### Files & Locations

| File Path | Description | Dependencies |
|-----------|-------------|--------------|
| `/src/app/core/services/notification.service.ts` | Notification management service | Subject/BehaviorSubject from RxJS |
| `/src/app/core/models/notification.model.ts` | Notification data models | None |

---

## Development Guidelines

### Code Organization
- Feature-based module structure
- Core module for singleton services
- Shared module for reusable components
- Clear separation of concerns with services, components, and models

### Naming Conventions
- Components: `feature-name.component.ts`
- Services: `feature-name.service.ts`
- Models: `feature-name.model.ts`
- Interfaces: `IFeatureName`
- Enums: `FeatureNameType`

### Coding Standards
- Use TypeScript interfaces for data models
- Component-scoped CSS with BEM naming
- Reactive programming with RxJS
- Proper unsubscribe patterns in components

### Testing Strategy
- Unit tests for services and components
- Integration tests for complex workflows
- Mock services for API dependencies

---

*Document maintained by the WorkHub HRMS Development Team*
