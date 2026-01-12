# Builder.io Integration with Saleor Storefront

This document explains how to integrate Builder.io drag-and-drop page building with the Saleor storefront's GraphQL data.

## Overview

The integration allows you to:

- Design pages using Builder.io's drag-and-drop interface
- Access Saleor GraphQL data within Builder.io components
- Maintain the existing storefront functionality while adding dynamic page building capabilities

## Implementation Details

### 1. Component Structure

The integration uses these key components:

- `src/components/builder-io/BuilderIntegration.tsx` - Main integration component
- `src/app/[channel]/(main)/builder-page/page.tsx` - Example page using the integration

### 2. How It Works

1. **Builder.io Content Loading**: The `BuilderIntegration` component loads content from Builder.io
2. **GraphQL Data Access**: Saleor GraphQL data is fetched and made available to components
3. **Dynamic Rendering**: Builder.io content can access both its own data and GraphQL data

### 3. Usage Example

```tsx
<BuilderIntegration pageId="home-page" channel={channel} />
```

### 4. Environment Setup

Add your Builder.io API key to environment variables:

```bash
NEXT_PUBLIC_BUILDER_API_KEY=your-builder-api-key-here
```

### 5. Integration Benefits

- **Non-developer Friendly**: Designers can create and modify pages without code changes
- **Data Integration**: Access to real-time Saleor data (products, categories, etc.)
- **Consistent Styling**: Maintain existing Tailwind CSS and component structure
- **Performance**: Server-side rendering with proper caching

## Customization Options

### Adding GraphQL Data to Builder Components

To pass Saleor data to Builder.io components, modify the `getBuilderPageData` function:

```typescript
export async function getBuilderPageData(pageId: string, channel?: string) {
	// Fetch data from GraphQL
	const products = await executeGraphQL(ProductListPaginatedDocument, {
		variables: { channel },
		revalidate: 60,
	});

	return {
		pageId,
		channel,
		products: products?.edges.map((e) => e.node),
	};
}
```

### Creating Custom Builder Components

You can create custom React components that access both Builder.io content and Saleor data:

```tsx
import { registerComponent } from "@builder.io/react";

registerComponent(MyCustomComponent, {
	name: "MyCustomComponent",
	inputs: [
		{
			name: "productCount",
			type: "number",
			defaultValue: 5,
		},
	],
});
```

## Best Practices

1. **Performance**: Use appropriate caching strategies for GraphQL queries
2. **Security**: Ensure proper authentication when accessing Saleor data
3. **Testing**: Test both Builder.io content and GraphQL integration thoroughly
4. **Fallbacks**: Provide fallback content when Builder.io is unavailable

## Troubleshooting

### Common Issues:

- **API Key Not Found**: Ensure `NEXT_PUBLIC_BUILDER_API_KEY` is set in environment
- **Type Errors**: Make sure all required dependencies are installed
- **Content Not Loading**: Verify Builder.io content exists for the specified page ID

### Debugging:

1. Check browser console for any Builder.io or GraphQL errors
2. Verify environment variables are correctly set
3. Confirm the page ID exists in Builder.io

## Next Steps

1. Set up your Builder.io account and API key
2. Create pages in Builder.io with the desired layout
3. Test integration by visiting `/[channel]/builder-page`
4. Customize components to access Saleor data as needed
