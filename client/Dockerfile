# ==============================================================================
# Multi-stage Dockerfile for Next.js 15 + Supabase Application
# Optimized for production deployment with security and performance
# ==============================================================================

# ---- Base Stage ----
FROM node:20-alpine AS base

# Install security updates and necessary packages
RUN apk update && apk upgrade && apk add --no-cache \
    libc6-compat \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy package files for dependency caching
COPY package*.json ./

# ---- Dependencies Stage ----
FROM base AS deps

# Install dependencies for production
RUN npm install --only=production --ignore-scripts

# ---- Development Dependencies Stage ----
FROM base AS dev-deps

# Install all dependencies including devDependencies
RUN npm install --ignore-scripts

# ---- Builder Stage ----
FROM dev-deps AS builder

# Copy source code
COPY . .

# Set environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Supabase types (if needed)
# RUN npm run supabase:types || echo "Supabase types generation skipped"

# Build the application
RUN npm run build

# ---- Production Stage ----
FROM base AS production

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy production dependencies
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create necessary directories with proper permissions
RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app/.next/cache

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

# ---- Development Stage ----
FROM dev-deps AS development

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Copy source code
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app/.next && \
    chmod -R 755 /app/.next

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"] 