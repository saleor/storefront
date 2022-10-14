FROM node:16-slim
WORKDIR /app

# Setup pnpm package manager
RUN npm install -g pnpm@7.11.0

# Setup proxy to API used in saleor-platform
RUN apt-get update && apt-get install -y nginx jq
COPY apps/storefront/nginx/dev.conf /etc/nginx/conf.d/default.conf

COPY . .

# Remove Cypress from dependencies
RUN jq 'del(.devDependencies.cypress)' package.json > _.json && mv _.json package.json
RUN pnpm install

# Env variables
RUN rm .env

ARG SALEOR_API_URL
ENV SALEOR_API_URL ${SALEOR_API_URL:-http://localhost:8000/graphql/}

ARG STOREFRONT_URL
ENV STOREFRONT_URL ${STOREFRONT_URL:-http://localhost:3000}

ARG CHECKOUT_APP_URL
ENV CHECKOUT_APP_URL ${CHECKOUT_APP_URL:-http://localhost:3001}

ARG CHECKOUT_STOREFRONT_URL
ENV CHECKOUT_STOREFRONT_URL ${CHECKOUT_STOREFRONT_URL:-http://localhost:3001/checkout-spa/}

ARG CLOUD_DEPLOYMENT_URL https://prod.demo.saleor.cloud
ENV CLOUD_DEPLOYMENT_URL ${CLOUD_DEPLOYMENT_URL:-https://prod.demo.saleor.cloud}

ARG SENTRY_DSN
ENV SENTRY_DSN ${SENTRY_DSN}

ARG SENTRY_ENVIRONMENT
ENV SENTRY_ENVIRONMENT ${SENTRY_ENVIRONMENT}

ARG SENTRY_RELEASE
ENV SENTRY_RELEASE ${SENTRY_RELEASE}

ENV ENABLE_EXPERIMENTAL_COREPACK 1

RUN pnpm turbo run build
