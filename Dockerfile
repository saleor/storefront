FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# libc6-compat for Node.js on Alpine, python3/make/g++ for native modules (better-sqlite3)
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm i --frozen-lockfile --prefer-offline

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

ENV NEXT_OUTPUT=standalone
ARG NEXT_PUBLIC_SALEOR_API_URL
ENV NEXT_PUBLIC_SALEOR_API_URL=${NEXT_PUBLIC_SALEOR_API_URL}
ARG NEXT_PUBLIC_STOREFRONT_URL
ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}
ARG NEXT_PUBLIC_DEFAULT_CHANNEL
ENV NEXT_PUBLIC_DEFAULT_CHANNEL=${NEXT_PUBLIC_DEFAULT_CHANNEL}

# Get PNPM version from package.json
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Skip codegen (prebuild) — generated types are committed in src/gql/
RUN npx next build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXT_PUBLIC_SALEOR_API_URL
ENV NEXT_PUBLIC_SALEOR_API_URL=${NEXT_PUBLIC_SALEOR_API_URL}
ARG NEXT_PUBLIC_STOREFRONT_URL
ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}
ARG SALEOR_API_URL
ENV SALEOR_API_URL=${SALEOR_API_URL}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Create writable data directory for SQLite (affiliate system)
RUN mkdir -p data && chown nextjs:nodejs data

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure better-sqlite3 native binary is available in standalone output
# (serverExternalPackages tells Next.js to keep it external, but the .node binary
# may not be traced — this guarantees it's present)
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

USER nextjs

# Affiliate DB is stored here — mount as a Docker volume for persistence
VOLUME /app/data

CMD ["node", "server.js"]
