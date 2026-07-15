FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY ./.npmrc package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile --prefer-offline

# Ordered from least likely to most likely to be updated
COPY \
    ./global.d.ts \
    ./knip.config.ts \
    ./next.config.js \
    ./paper-version.json \
    ./postcss.config.cjs \
    ./tailwind.config.cjs \
    ./tsconfig.json \
    ./.graphqlrc.ts \
    ./
COPY ./messages ./messages/
COPY ./public ./public/
COPY ./src ./src/

# Disable telemetry (build + runtime)
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_SALEOR_API_URL
ENV NEXT_PUBLIC_SALEOR_API_URL=${NEXT_PUBLIC_SALEOR_API_URL}

ARG NEXT_PUBLIC_STOREFRONT_URL
ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}

ARG NEXT_PUBLIC_DEFAULT_CHANNEL
ENV NEXT_PUBLIC_DEFAULT_CHANNEL=${NEXT_PUBLIC_DEFAULT_CHANNEL:-default-channel}

ARG NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS
ENV NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS=${NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS:-false}

# Build Next.js
RUN NEXT_OUTPUT=standalone \
    pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ARG NEXT_PUBLIC_SALEOR_API_URL
ENV NEXT_PUBLIC_SALEOR_API_URL=${NEXT_PUBLIC_SALEOR_API_URL}

ARG NEXT_PUBLIC_STOREFRONT_URL
ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}

# Note: takes the value from NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS as it's only
# reflecting to the backend server whether the Stripe integration is enabled
ARG NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS
ENV ENABLE_STRIPE_PAYMENTS=${NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS:-false}

CMD ["node", "server.js"]
