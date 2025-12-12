# Implementation Plan

- [x] 1. Create GraphQL queries for dynamic content

  - [x] 1.1 Create ShopSettings.graphql query
    - Add query to fetch shop name, description, headerText, and metadata
    - Include metafields for social links, payment methods, and WhatsApp config
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 1.2 Create SiteContent.graphql query
    - Add query to fetch a single page by slug with metadata and pageType
    - Include metafields for hero content attributes
    - _Requirements: 3.1, 4.1, 4.2_
  - [x] 1.3 Create TrustBadges.graphql query
    - Add query to fetch pages filtered by trust-badge pageType
    - Include metafields for icon, description, and sort_order
    - _Requirements: 1.1, 1.2_
  - [x] 1.4 Run GraphQL codegen to generate TypeScript types
    - Execute codegen command to update src/gql/graphql.ts
    - _Requirements: 5.3_

- [x] 2. Create content service with fallbacks

  - [x] 2.1 Create src/lib/content.ts with type definitions
    - Define TrustBadge, HeroContent, ShopInfo, and StorePolicy interfaces
    - Define fallback constants for each content type
    - _Requirements: 1.3, 3.3, 6.3_
  - [x] 2.2 Implement getShopInfo function
    - Fetch shop settings from Saleor API
    - Parse metadata for social links, payment methods, WhatsApp
    - Return fallback values on error
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 2.3 Implement getTrustBadges function
    - Fetch trust badge pages from Saleor API
    - Transform page data to TrustBadge interface
    - Sort by sort_order metadata
    - Return fallback badges on error
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 2.4 Implement getHeroContent function
    - Fetch hero content page by slug
    - Parse metafields for headline, CTAs, stats
    - Return fallback hero on error
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 2.5 Implement getStorePolicies function
    - Fetch shipping and returns policy pages
    - Extract summary text for trust badges
    - Return fallback policies on error
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 3. Update TrustBadges component

  - [x] 3.1 Convert TrustBadges to async server component
    - Import getTrustBadges from content service
    - Fetch badges dynamically instead of from config
    - Handle empty badges array gracefully
    - _Requirements: 1.2, 1.3_

- [x] 4. Create ProductPageTrustBadges component

  - [x] 4.1 Create src/ui/components/ProductPageTrustBadges.tsx
    - Create async server component
    - Fetch store policies using getStorePolicies
    - Display shipping threshold, return period, secure checkout
    - _Requirements: 1.1, 4.1, 4.2_
  - [x] 4.2 Update product page to use ProductPageTrustBadges
    - Replace hardcoded trust badges in products/[slug]/page.tsx
    - Import and render ProductPageTrustBadges component
    - _Requirements: 1.1, 4.4_

- [x] 5. Update HeroSection component

  - [x] 5.1 Convert HeroSection to async server component
    - Import getHeroContent from content service
    - Fetch hero content dynamically
    - Remove import of homepageConfig
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 6. Update Footer component

  - [x] 6.1 Fetch shop info in Footer component
    - Import getShopInfo from content service
    - Replace hardcoded store name and description
    - _Requirements: 2.1, 2.4_
  - [x] 6.2 Update social links to use dynamic data
    - Render social links from shopInfo.socialLinks
    - Only show links that have URLs configured
    - _Requirements: 2.2, 2.4_
  - [x] 6.3 Update payment methods display
    - Render payment icons based on shopInfo.paymentMethods
    - Support dynamic list of payment providers
    - _Requirements: 2.3, 2.4_

- [x] 7. Update WhatsApp button component

  - [x] 7.1 Make WhatsApp config dynamic
    - Fetch WhatsApp settings from shop metadata
    - Only render button if WhatsApp is configured
    - _Requirements: 2.2_

- [x] 8. Cleanup and documentation
  - [x] 8.1 Deprecate src/config/homepage.ts
    - Add deprecation comment to file
    - Keep as fallback reference but remove imports from components
    - _Requirements: 5.1, 5.2_
  - [x] 8.2 Update any remaining hardcoded strings
    - Search for remaining hardcoded content
    - Replace with dynamic content or move to fallbacks
    - _Requirements: 5.1_
