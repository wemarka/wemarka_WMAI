# Wemarka Deployment Guide

## Environment Setup

### Environment Files

The application uses different environment files for different deployment environments:

- `.env.development` - Used during local development
- `.env.staging` - Used for staging deployments
- `.env.production` - Used for production deployments

Each environment file should be created based on the corresponding template (`.env.*.template`).

### Required Environment Variables

```
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_SERVICE_KEY=your-service-key

# Application Settings
VITE_APP_ENV=development|staging|production
VITE_APP_URL=https://your-app-url.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true|false

# Deployment Information
VITE_DEPLOY_TIME=auto-populated-by-vercel
VITE_BUILD_ID=auto-populated-by-vercel
```

## Build Process

### Local Development

```bash
npm run dev
```

### Staging Build

```bash
npm run build:staging
```

### Production Build

```bash
npm run build:production
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure the environment variables in the Vercel project settings
3. Deploy using the Vercel dashboard or CLI

```bash
vercel --prod  # For production deployment
vercel         # For preview deployment
```

### Docker Deployment

1. Build the Docker image

```bash
docker build -t wemarka-app:latest .
```

2. Run the Docker container

```bash
docker run -p 8080:80 -e VITE_APP_ENV=production wemarka-app:latest
```

## Staging Environment Notice

The application includes a `StagingEnvironmentNotice` component that displays a banner in non-production environments. This banner helps users identify when they're using a staging or development environment.

The banner is automatically shown based on the `VITE_APP_ENV` environment variable or the hostname of the application.

## Troubleshooting

### Environment Variables Not Loading

If environment variables are not being loaded correctly:

1. Ensure the variable names start with `VITE_` (required for client-side access)
2. Verify the environment files are in the correct location (project root)
3. Check that you're using the correct build command for your environment

### Build Failures

If the build process fails:

1. Check the TypeScript errors using `npm run tsc`
2. Verify all dependencies are installed correctly
3. Check for any environment-specific code that might be causing issues

### Deployment Issues

If deployment to Vercel fails:

1. Check the Vercel build logs for errors
2. Verify the environment variables are set correctly in Vercel
3. Ensure the build command in `vercel.json` is correct
