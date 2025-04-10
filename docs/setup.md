# Wemarka WMAI Setup Guide

## Overview

This document provides instructions for setting up the Wemarka WMAI project locally for development purposes.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.x or later)
- **npm** (v8.x or later) or **yarn** (v1.22.x or later)
- **Git** for version control

## Environment Variables

The application requires the following environment variables to be set:

```
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

You can obtain these values from your Supabase project dashboard.

## Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd wemarka-wmai
   ```

2. **Install dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add the required environment variables as listed above.

4. **Generate Supabase types (optional)**

   ```bash
   npm run types:supabase
   ```

   This will generate TypeScript types based on your Supabase schema.

## Running the Application

### Development Mode

To start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173.

### Building for Production

To build the application for production:

```bash
npm run build
```

For staging environment:

```bash
npm run build:staging
```

For production environment:

```bash
npm run build:production
```

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Supabase Setup

### Database Migrations

The project uses SQL migrations to set up and update the database schema. These migrations are located in the `supabase/migrations` directory.

To apply migrations to your Supabase project, you can use the Supabase CLI or apply them manually through the Supabase dashboard SQL editor.

### Edge Functions

The project includes Supabase Edge Functions located in the `supabase/functions` directory. These can be deployed using the Supabase CLI.

## Additional Development Tools

- **ESLint**: `npm run lint` to check for code quality issues
- **TypeScript**: The project uses TypeScript for type safety

## Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   - Verify that your environment variables are correctly set
   - Check that your Supabase project is running and accessible

2. **Build Errors**
   - Make sure all dependencies are installed correctly
   - Check for TypeScript errors with `tsc`

3. **Runtime Errors**
   - Check the browser console for detailed error messages
   - Verify that your Supabase schema matches the expected types

## Support

For additional help, please contact the development team or refer to the project documentation.
