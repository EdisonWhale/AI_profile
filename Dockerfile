# Use official Node.js image as base
FROM node:20-alpine AS base

# Install dependencies stage
FROM base AS deps
# Install compatibility libs for Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install project deps
RUN pnpm install --frozen-lockfile

# Build stage
FROM deps AS builder
WORKDIR /app
COPY . .

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Add API key environment variable for build time
ARG GOOGLE_GENERATIVE_AI_API_KEY
ENV GOOGLE_GENERATIVE_AI_API_KEY=$GOOGLE_GENERATIVE_AI_API_KEY

# Build app
RUN pnpm build

# Production image: copy build output and run Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Ensure correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run app
CMD ["node", "server.js"]