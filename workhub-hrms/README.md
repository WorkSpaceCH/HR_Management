# WorkHub HRMS

A comprehensive Human Resource Management System (HRMS) built with Angular, Angular Material, and Tailwind CSS.

## Project Overview

WorkHub HRMS is an enterprise-grade application designed to streamline HR processes, employee management, and administrative tasks for organizations. The system provides different portals for employees, managers, HR personnel, and administrators, with role-based access control.

## Features

- **Authentication & Authorization**: Secure login with JWT-based authentication and role-based access control
- **Employee Portal**: Profile management, leave requests, performance tracking
- **Manager Portal**: Team management, leave approvals, performance evaluations
- **HR Portal**: Recruitment, payroll management, policy administration
- **Admin Portal**: User management, system settings, access control

## Technologies Used

- **Angular 16**: Frontend framework
- **Angular Material**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **RxJS**: Reactive programming library
- **TypeScript**: Typed JavaScript

## Project Structure

```
workhub-hrms/
├── src/
│   ├── app/
│   │   ├── core/                 # Core functionality
│   │   │   ├── guards/           # Route guards for authentication
│   │   │   ├── interceptors/     # HTTP interceptors
│   │   │   └── services/         # Core services (auth, etc.)
│   │   │
│   │   ├── features/             # Feature modules
│   │   │   ├── admin/            # Admin functionality
│   │   │   ├── auth/             # Authentication pages
│   │   │   ├── dashboard/        # Dashboard views
│   │   │   ├── employee/         # Employee functionality
│   │   │   ├── hr/               # HR functionality
│   │   │   └── manager/          # Manager functionality
│   │   │
│   │   ├── services/             # API and business services
│   │   │
│   │   └── shared/               # Shared components, directives, and pipes
│   │       ├── components/       # Reusable components
│   │       ├── directives/       # Custom directives
│   │       └── pipes/            # Custom pipes
│   │
│   ├── assets/                   # Static assets
│   └── environments/             # Environment configurations
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm start
   ```

## Development

### Building

```
npm run build
```

### Running Tests

```
npm test
```

## Architecture

The application follows a modular architecture with lazy-loaded feature modules for better performance and code organization. It uses the container-presenter component pattern to separate business logic from presentation logic.

Key design patterns:
- Lazy-loaded modules
- MVVM (Model-View-ViewModel) pattern
- Reactive state management with RxJS
- Container/Presenter component pattern

## API Integration

The frontend connects to a RESTful API backend. The API base URL can be configured in the environment files.

## Future Enhancements

- Document management system
- Time tracking and attendance
- Performance evaluation system
- Reporting and analytics dashboard

## License

[MIT](LICENSE)
