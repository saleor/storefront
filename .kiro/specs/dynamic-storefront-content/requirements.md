# Requirements Document

## Introduction

This feature removes all hardcoded content from the Luxior Mall storefront and replaces it with dynamic content fetched from Saleor 3.22.17's API. This includes trust badges, footer content, hero section, store policies, and other static content that should be manageable from the Saleor admin dashboard using Content Models, Shop settings, and Menus.

## Glossary

- **Storefront**: The Next.js frontend application that displays products and content to customers
- **Saleor_API**: The GraphQL API provided by Saleor 3.22.17 backend
- **Content_Model**: Saleor's CMS feature for creating custom content types with defined fields
- **Shop_Settings**: Saleor's shop configuration including metadata for store-wide settings
- **Trust_Badge**: A visual indicator showing store benefits (free shipping, returns policy, secure checkout)
- **Hero_Section**: The main promotional banner on the homepage
- **Store_Policy**: Business rules like shipping thresholds, return periods, and payment methods

## Requirements

### Requirement 1: Dynamic Trust Badges

**User Story:** As a store administrator, I want to manage trust badges from Saleor admin, so that I can update shipping thresholds and return policies without code changes.

#### Acceptance Criteria

1. WHEN the product page loads, THE Storefront SHALL fetch trust badge content from Saleor_API using Content_Model or Shop_Settings metadata.
2. WHEN the homepage loads, THE Storefront SHALL fetch trust badge content from Saleor_API and display it in the TrustBadges component.
3. IF the Saleor_API returns no trust badge content, THEN THE Storefront SHALL display sensible fallback values.
4. WHEN trust badge content is updated in Saleor admin, THE Storefront SHALL reflect the changes within the configured cache revalidation period.

### Requirement 2: Dynamic Footer Content

**User Story:** As a store administrator, I want to manage footer content from Saleor admin, so that I can update store description, social links, and contact information without code changes.

#### Acceptance Criteria

1. WHEN the footer renders, THE Storefront SHALL fetch store name and description from Shop_Settings.
2. WHEN the footer renders, THE Storefront SHALL fetch social media links from Shop_Settings metadata or a dedicated Content_Model.
3. WHEN the footer renders, THE Storefront SHALL fetch payment method icons/labels from Shop_Settings or Content_Model.
4. IF the Saleor_API returns no footer content, THEN THE Storefront SHALL display sensible fallback values.

### Requirement 3: Dynamic Hero Section

**User Story:** As a store administrator, I want to manage the homepage hero section from Saleor admin, so that I can update promotional content and CTAs without code changes.

#### Acceptance Criteria

1. WHEN the homepage loads, THE Storefront SHALL fetch hero content (headline, description, CTAs, badge text) from Saleor_API.
2. WHEN the hero section renders, THE Storefront SHALL display dynamic stats fetched from Saleor_API or computed from product/order data.
3. IF the Saleor_API returns no hero content, THEN THE Storefront SHALL display sensible fallback values.

### Requirement 4: Dynamic Store Policies

**User Story:** As a store administrator, I want to manage store policies from Saleor admin, so that shipping info, return policies, and other policy content stays consistent across the site.

#### Acceptance Criteria

1. WHEN the product page loads, THE Storefront SHALL fetch shipping policy details (free shipping threshold, delivery time) from Saleor_API.
2. WHEN the product page loads, THE Storefront SHALL fetch return policy details (return period, conditions) from Saleor_API.
3. WHEN the ProductTabs component renders, THE Storefront SHALL fetch shipping and returns content from Saleor_API Content_Models instead of Pages.
4. THE Storefront SHALL use consistent policy values across all pages where they appear.

### Requirement 5: Remove Hardcoded Configuration

**User Story:** As a developer, I want to remove the hardcoded homepage config file, so that all content is managed through Saleor admin.

#### Acceptance Criteria

1. WHEN the feature is complete, THE Storefront SHALL NOT contain hardcoded content strings for trust badges, hero section, or store policies.
2. THE Storefront SHALL remove or deprecate the `src/config/homepage.ts` file after migrating to API-based content.
3. THE Storefront SHALL provide TypeScript types for all content fetched from Saleor_API.

### Requirement 6: Caching and Performance

**User Story:** As a user, I want the storefront to load quickly, so that dynamic content fetching does not degrade performance.

#### Acceptance Criteria

1. WHEN fetching content from Saleor_API, THE Storefront SHALL cache responses with appropriate revalidation periods (minimum 1 hour for static content).
2. THE Storefront SHALL use Next.js ISR (Incremental Static Regeneration) for content that changes infrequently.
3. IF the Saleor_API is unavailable, THEN THE Storefront SHALL serve cached content or fallback values without breaking the page.
