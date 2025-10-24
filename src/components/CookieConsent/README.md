# Cookie Consent Component

A modern, privacy-focused cookie consent banner for the Saleor storefront. Built with Next.js 15, React 19, and TailwindCSS.

## Features

- **Privacy-first**: Only essential and YouTube cookies
- **Three consent levels**:
  - Accept All (Essential + YouTube)
  - Essential Only (No YouTube embeds)
  - Custom Settings (Granular control)
- **Fully accessible**: Keyboard navigation, ARIA labels, focus management
- **Type-safe**: Full TypeScript support
- **Persistent**: Stores preferences in localStorage
- **Responsive**: Mobile-friendly design
- **Animated**: Smooth slide-up and fade-in animations
- **Always accessible**: Cookie preferences button in footer for easy access

## Cookie Categories

### Essential Cookies (Always Active)
- Session cookies for authentication
- Shopping cart persistence (30 days)
- Stripe secure payment processing

### YouTube Video Embeds (Optional)
- Video playback functionality
- When disabled, YouTube embeds will be hidden
- Uses youtube-nocookie.com when available

## Installation

The component is already integrated into your storefront:

1. **Cookie Consent Component** - Added to `src/app/layout.tsx`
2. **Footer Button** - Cookie preferences button added to `src/ui/components/Footer.tsx`

Users can access cookie settings in two ways:
- Initial banner on first visit
- "Cookie Preferences" button in the footer (always visible)

## Usage

### Basic Integration

The component handles everything automatically. No props required:

```tsx
import { CookieConsent } from "@/components/CookieConsent";

function App() {
  return (
    <>
      {/* Your app content */}
      <CookieConsent />
    </>
  );
}
```

### Checking Consent Status

Use the hook to check if the user has consented to specific cookies:

```tsx
import { useCookieConsent } from "@/components/CookieConsent";

function YouTubeEmbed({ videoId }: { videoId: string }) {
  const { hasConsent } = useCookieConsent();

  if (!hasConsent("youtube")) {
    return (
      <div className="bg-gray-800 p-4 text-center">
        <p>YouTube videos are disabled. Enable them in cookie settings.</p>
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      // ... other props
    />
  );
}
```

### Listening to Consent Changes

Listen for consent updates anywhere in your app:

```tsx
useEffect(() => {
  const handleConsentUpdate = (event: CustomEvent) => {
    console.log("Consent updated:", event.detail);
    // Reload embeds, update tracking, etc.
  };

  window.addEventListener("cookieConsentUpdated", handleConsentUpdate);
  return () => window.removeEventListener("cookieConsentUpdated", handleConsentUpdate);
}, []);
```

### Programmatic Control

```tsx
import { useCookieConsent } from "@/components/CookieConsent";

function PrivacySettings() {
  const { acceptAll, acceptEssential, openSettings, consentData } = useCookieConsent();

  return (
    <div>
      <button onClick={openSettings}>Manage Cookie Preferences</button>
      <button onClick={acceptAll}>Accept All Cookies</button>
      <button onClick={acceptEssential}>Essential Only</button>

      <p>Current consent: {JSON.stringify(consentData)}</p>
    </div>
  );
}
```

## Styling with Body Classes

The component automatically adds classes to `<body>` based on consent:

```css
/* Your global CSS */
body.youtube-enabled .youtube-embed {
  display: block;
}

body.youtube-blocked .youtube-embed {
  display: none;
}
```

## API Reference

### `useCookieConsent()` Hook

Returns:
- `consentData: CookieConsentData` - Current consent state
- `hasConsent(category: "essential" | "youtube"): boolean` - Check specific consent
- `acceptAll(): void` - Accept all cookies
- `acceptEssential(): void` - Accept only essential cookies
- `saveSettings(settings): void` - Save custom settings
- `showBanner: boolean` - Banner visibility state
- `showSettings: boolean` - Settings modal visibility state
- `openSettings(): void` - Open settings modal
- `closeSettings(): void` - Close settings modal

### Types

```typescript
interface CookieConsentData {
  hasConsented: boolean;
  essential: boolean;
  youtube: boolean;
  timestamp: string | null;
}

type CookieConsentCategory = "essential" | "youtube";
```

## Customization

### Colors

The component uses your Tailwind theme colors:
- Primary accent: `red-900` (#8B0000)
- Background: `gray-900`, `gray-800`
- Text: `white`, `gray-300`, `gray-400`

To customize, edit the component files or use Tailwind's configuration.

### Animation

Animations are defined in `tailwind.config.ts`:
- `animate-slide-up`: Banner entrance
- `animate-fade-in`: Modal entrance

### Text Content

Edit the text directly in:
- `CookieBanner.tsx` - Banner content
- `CookieSettingsModal.tsx` - Modal content

## Browser Support

- Modern browsers with ES6+ support
- localStorage required for persistence
- Falls back gracefully if localStorage unavailable

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Focus management
- Escape key to close modals
- High contrast for readability

## Privacy Compliance

This component helps with:
- GDPR (EU)
- CCPA (California)
- PECR (UK)
- General privacy best practices

**Note**: Consult with legal counsel to ensure full compliance with applicable laws.

## Files Structure

```
src/components/CookieConsent/
├── index.tsx                      # Main component & exports
├── CookieBanner.tsx              # Banner component
├── CookieSettingsModal.tsx       # Settings modal
├── CookiePreferencesButton.tsx   # Footer button component
├── CookieIcon.tsx                # Cookie SVG icon
└── README.md                     # This file

src/hooks/
└── useCookieConsent.ts           # Cookie consent hook

src/types/
└── cookie-consent.ts             # TypeScript types
```

## License

Part of the Saleor e-commerce template.
