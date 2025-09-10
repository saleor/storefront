# FROM node:20-alpine AS base

# # Install dependencies only when needed
# FROM base AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable

# COPY package.json pnpm-lock.yaml ./
# RUN pnpm i --frozen-lockfile --prefer-offline

# # Rebuild the source code only when needed
# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry during the build.
# # ENV NEXT_TELEMETRY_DISABLED 1

# ENV NEXT_OUTPUT=standalone
# ARG NEXT_PUBLIC_SALEOR_API_URL
# ENV NEXT_PUBLIC_SALEOR_API_URL=${NEXT_PUBLIC_SALEOR_API_URL}
# ARG NEXT_PUBLIC_STOREFRONT_URL
# ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}

# # Get PNPM version from package.json
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable

# RUN pnpm build

# # Production image, copy all the files and run next
# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV production
# # Uncomment the following line in case you want to disable telemetry during runtime.
# # ENV NEXT_TELEMETRY_DISABLED 1

# ARG NEXT_PUBLIC_SALEOR_API_URL
# ENV NEXT_PUBLIC_SALEOR_API_URL=${NEXT_PUBLIC_SALEOR_API_URL}
# ARG NEXT_PUBLIC_STOREFRONT_URL
# ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # COPY --from=builder /app/public ./public

# # Set the correct permission for prerender cache
# RUN mkdir .next
# RUN chown nextjs:nodejs .next

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs


# CMD ["node", "server.js"]

# FROM node:20-alpine

# WORKDIR /app

# RUN corepack enable && corepack prepare pnpm@latest --activate

# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install --frozen-lockfile --ignore-scripts

# COPY . .

# RUN printf '%s\n' '#!/bin/sh' 'set -e' \
#   'TARGET="${SALEOR_API_INTERNAL:-http://saleor-api:8000/graphql/}"' \
#   'echo "Waiting for Saleor API at $TARGET"' \
#   'n=0' \
#   'until curl -sSf "$TARGET" >/dev/null 2>&1; do' \
#   '  n=$((n+1))' \
#   '  if [ $n -gt 150 ]; then echo "Timeout waiting for Saleor API"; exit 1; fi' \
#   '  echo "Saleor API not ready yet — sleeping 2s..."' \
#   '  sleep 2' \
#   'done' \
#   'echo "Saleor API is up. Running install/build/start."' \
#   'pnpm install --frozen-lockfile' \
#   'pnpm build' \
#   'pnpm start -p 3000' > /wait-and-run.sh \
#   && chmod +x /wait-and-run.sh

# EXPOSE 3000

# CMD ["/wait-and-run.sh"]





# Stage 1: Builder
FROM node:20-bullseye AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate


COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG NODE_ENV=production
ARG NEXT_PUBLIC_SALEOR_API_URL
ENV NEXT_PUBLIC_SALEOR_API_URL=${NEXT_PUBLIC_SALEOR_API_URL}

# ARG NEXT_PUBLIC_SALEOR_API_URL
# RUN if [ ! -f schema/schema.graphql ]; then \
#       if [ "$NODE_ENV" != "production" ]; then \
#         npx graphql-codegen introspect-schema $NEXT_PUBLIC_SALEOR_API_URL > schema/schema.graphql; \
#       else \
#         echo "schema.graphql missing in production" && exit 1; \
#       fi \
#     fi

# RUN pnpm run generate
# RUN pnpm run build

# Stage 2: Runner
FROM node:20-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/schema/schema.graphql ./schema/schema.graphql

EXPOSE 3000
CMD ["pnpm", "start", "-H", "0.0.0.0", "-p", "3000"]
