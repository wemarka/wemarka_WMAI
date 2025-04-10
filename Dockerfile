FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and related files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy all files
COPY . .

# Build the application
RUN pnpm build

# Production image
FROM node:18-alpine AS production
WORKDIR /app

# Copy built assets from the build stage
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY package.json ./

# Expose the port the app runs on
EXPOSE 4173

# Command to run the application
CMD ["pnpm", "preview", "--host"]
