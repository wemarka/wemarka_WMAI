# Wemarka WMAI Architecture

## Overview

Wemarka WMAI is a comprehensive full-stack web application that serves as a unified business operating system. The application is built using React, TypeScript, and Vite for the frontend, with Supabase providing backend services.

## Folder Structure

The project follows a modular architecture with clear separation of concerns:

```
src/
├── App.tsx                # Main application component
├── backend/               # Backend-related code
│   ├── lib/               # Backend libraries
│   └── services/          # Backend services
├── components/            # Shared UI components
│   └── ui/                # Shadcn UI components
├── docs/                  # Project documentation
├── frontend/              # Frontend application code
│   ├── components/        # Frontend-specific components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── modules/           # Feature modules
│   ├── services/          # Frontend services
│   └── types/             # TypeScript type definitions
├── i18n/                  # Internationalization setup
├── lib/                   # Shared libraries
├── shared/                # Shared code between frontend and backend
├── stories/               # Storybook stories
├── tempobook/             # Tempo storyboards
└── types/                 # Global type definitions
```

## Module System

The application is organized into feature modules, each representing a distinct business function:

```
frontend/modules/
├── accounting/           # Accounting and financial management
├── admin/                # Administrative functions
├── ai/                   # AI assistant functionality
├── analytics/            # Data analytics and reporting
├── auth/                 # Authentication and authorization
├── customer-service/     # Customer support features
├── customers/            # Customer management
├── dashboard/            # Main dashboard
├── developer/            # Developer tools
├── documentation-center/ # Documentation
├── documents/            # Document management
├── help-center/          # Help and support
├── inbox/                # Unified messaging
├── integrations/         # Third-party integrations
├── layout/               # Layout components
├── marketing/            # Marketing tools
├── settings/             # System settings
└── store/                # E-commerce functionality
```

Each module typically contains:

- `components/`: UI components specific to the module
- `services/`: Module-specific services
- `types.ts`: Type definitions for the module
- `index.ts`: Entry point that exports the module's components

## Layout System

The application uses a nested layout approach:

1. **App Layout**: The top-level layout defined in `App.tsx` that includes:
   - Authentication providers
   - Language providers
   - Route definitions

2. **Dashboard Layout**: A layout specific to authenticated dashboard pages that includes:
   - Main sidebar navigation
   - Top navigation bar
   - Content area

3. **Module Layout**: Each module can have its own layout that includes:
   - Module-specific header
   - Module-specific navigation
   - Content area

## Routing

The application uses React Router for navigation:

- Routes are defined in `App.tsx`
- Protected routes are wrapped with the `ProtectedRoute` component
- Each module has its own routes nested under `/dashboard/{module-name}`
- The application supports dynamic routes for specific resources

## Context Providers

The application uses React Context for state management:

- `AuthContext`: Manages user authentication state
- `LanguageContext`: Manages internationalization and RTL support
- `RoleContext`: Manages user roles and permissions
- `SidebarContext`: Manages sidebar state
- `AIContext`: Manages AI assistant functionality

## Component Architecture

Components follow a hierarchical structure:

1. **UI Components**: Low-level, reusable components (buttons, inputs, etc.)
2. **Composite Components**: Components composed of multiple UI components
3. **Feature Components**: Components specific to a feature or module
4. **Page Components**: Top-level components that represent a page

## State Management

The application uses a combination of:

- React Context for global state
- React hooks (useState, useReducer) for component state
- Custom hooks for reusable state logic

## API Integration

The application integrates with Supabase for backend services:

- Authentication and user management
- Database access
- Storage for files and assets
- Edge functions for serverless functionality

## Internationalization

The application supports multiple languages and RTL layouts:

- Uses i18next for translations
- Supports English and Arabic languages
- Provides RTL layout for Arabic

## Testing

The application includes:

- Component tests using a test runner
- Storybook stories for component documentation
- Tempo storyboards for visual testing

## Build System

The application uses Vite for building and development:

- Fast development server with HMR
- Optimized production builds
- Environment-specific builds (staging, production)

## Styling

The application uses Tailwind CSS for styling:

- Utility-first CSS framework
- Custom theme configuration
- Component-specific styles
- Dark mode support
