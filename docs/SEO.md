# SEO Implementation Guide

This storefront includes comprehensive SEO utilities for optimizing your e-commerce site for search engines.

## Overview

The SEO system provides:
- Meta tags generation (title, description, Open Graph, Twitter Cards)
- Structured data (JSON-LD) for rich snippets
- Next.js Metadata API integration
- Reusable utilities and types

## File Structure

```
src/
├── types/
│   └── seo.ts                    # TypeScript types for SEO
├── lib/
│   ├── constants.ts              # Site configuration
│   └── seo.ts                    # SEO utility functions
└── ui/components/
    └── StructuredData.tsx        # Structured data component
```

## Configuration

Update the site configuration in `src/lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  name: "Your Store Name",
  description: "Your store description",
  url: process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000",
  image: "/og-image.jpg",
  locale: "en_US",
  twitter: {
    site: "@yourhandle",
    creator: "@yourhandle",
  },
  social: {
    youtube: "https://youtube.com/...",
    facebook: "https://facebook.com/...",
    instagram: "https://instagram.com/...",
    github: "https://github.com/...",
  },
  contact: {
    email: "support@example.com",
  },
};
```

## Usage Examples

### 1. Basic Page Metadata

For static pages, use the `generateMetadata` function:

```typescript
// src/app/about/page.tsx
import { generateMetadata } from "@/lib/seo";

export const metadata = generateMetadata({
  title: "About Us",
  description: "Learn more about our company and mission",
  image: "/about-og.jpg",
});

export default function AboutPage() {
  return <div>About content...</div>;
}
```

### 2. Dynamic Product Pages

For dynamic pages with product data:

```typescript
// src/app/products/[slug]/page.tsx
import { generateMetadata as generateMeta, generateProductSchema } from "@/lib/seo";
import { StructuredData } from "@/ui/components/StructuredData";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);

  return generateMeta({
    title: product.name,
    description: product.description,
    image: product.image,
    type: "product",
  });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);

  // Generate product schema
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    currency: "USD",
    availability: "https://schema.org/InStock",
    brand: product.brand,
    sku: product.sku,
  });

  return (
    <>
      <StructuredData data={productSchema} />
      <div>{/* Product content */}</div>
    </>
  );
}
```

### 3. Category/Collection Pages

For category or collection pages:

```typescript
// src/app/categories/[slug]/page.tsx
import { generateMetadata as generateMeta } from "@/lib/seo";
import { StructuredData } from "@/ui/components/StructuredData";
import { generateBreadcrumbSchema } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await fetchCategory(params.slug);

  return generateMeta({
    title: category.name,
    description: category.description,
    image: category.image,
  });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await fetchCategory(params.slug);

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories" },
    { name: category.name, url: `/categories/${params.slug}` },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <div>{/* Category content */}</div>
    </>
  );
}
```

### 4. Blog/Article Pages

For blog posts or article pages:

```typescript
// src/app/blog/[slug]/page.tsx
import { generateMetadata as generateMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  return generateMeta({
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author.name,
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  return <article>{/* Post content */}</article>;
}
```

## Available Utilities

### Meta Tags Generation

```typescript
import { generateMetaTags, generateMetadata } from "@/lib/seo";

// Generate meta tags object
const meta = generateMetaTags({
  title: "Page Title",
  description: "Page description",
  image: "/image.jpg",
});

// Generate Next.js metadata (recommended)
const metadata = generateMetadata({
  title: "Page Title",
  description: "Page description",
  image: "/image.jpg",
});
```

### Structured Data Schemas

```typescript
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";

// Organization schema (added globally in root layout)
const orgSchema = generateOrganizationSchema();

// Website schema (added globally in root layout)
const websiteSchema = generateWebsiteSchema();

// Product schema
const productSchema = generateProductSchema({
  name: "Product Name",
  description: "Product description",
  price: "99.99",
  currency: "USD",
  // ... more fields
});

// Breadcrumb schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" },
]);
```

## Best Practices

1. **Always provide unique titles and descriptions** for each page
2. **Use high-quality images** (1200x630px) for Open Graph images
3. **Include structured data** on product and category pages
4. **Set canonical URLs** to avoid duplicate content issues
5. **Use breadcrumbs** to help search engines understand site structure
6. **Test with SEO tools**:
   - Google Rich Results Test
   - Facebook Sharing Debugger
   - Twitter Card Validator

## Environment Variables

Ensure these environment variables are set:

```env
NEXT_PUBLIC_STOREFRONT_URL=https://yourstore.com
NEXT_PUBLIC_SALEOR_API_URL=https://api.yourstore.com/graphql/
```

## Robots.txt and Sitemap

Create `public/robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://yourstore.com/sitemap.xml
```

For sitemap generation, consider using Next.js built-in sitemap support or a package like `next-sitemap`.

## Testing SEO

Use these tools to test your SEO implementation:

- **Lighthouse** (built into Chrome DevTools)
- **Google Search Console**
- **Schema.org Validator**: https://validator.schema.org/
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator

## Additional Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search/docs)
- [Open Graph Protocol](https://ogp.me/)
