# Export package.json's in monorepo using turborepo
# https://turborepo.org/docs/handbook/deploying-with-docker#the-solution
FROM node:16-slim AS builder
WORKDIR /app

ARG PNPM_VERSION=7.13.4
RUN npm --no-update-notifier --no-fund --global install pnpm@${PNPM_VERSION} turbo

COPY . .
RUN turbo prune --scope=saleor-app-checkout --docker

# -- Install dependencies using pnpm

FROM node:16-slim AS installer
WORKDIR /app
RUN npm --no-update-notifier --no-fund --global install pnpm@${PNPM_VERSION}

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./.npmrc ./.npmrc

# Remove unused dependencies in production
RUN pnpm remove cypress
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store\
  pnpm install --shamefully-hoist

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
# TODO: replace with ARG + ENV
COPY .env .env
ENV IS_DOCKER=true
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store\
  pnpm run build:saleor-app-checkout

ENV NODE_ENV production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs apps/saleor-app-checkout
USER nextjs

EXPOSE 3001

WORKDIR /app/apps/saleor-app-checkout
CMD pnpm run start
