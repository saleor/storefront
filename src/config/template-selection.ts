/**
 * Fork-owned PDP selection. One shop, one template, chosen at build time.
 *
 * 1. Register the template in `src/templates/pdp/registry.ts`.
 * 2. Set `ACTIVE_PDP_TEMPLATE` to its id.
 * 3. Set `ACTIVE_PDP_GALLERY` to that template's `gallery` field
 *    (`standard`, `immersive`, `mosaic`, or `columns`). The app throws at
 *    startup when these disagree. The gallery island and route skeleton follow
 *    `ACTIVE_PDP_GALLERY`; the template's own classes follow its `gallery` field.
 *
 * Do not edit `src/app/.../products/[slug]/page.tsx` or `gallery-layout.ts` to change layout.
 */

export const ACTIVE_PDP_TEMPLATE = "immersive" as const;

export const ACTIVE_PDP_GALLERY = "immersive" as const;
