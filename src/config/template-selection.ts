/**
 * Fork-owned PDP selection. One shop, one template, chosen at build time.
 *
 * 1. Register the template in `src/templates/pdp/registry.ts`.
 * 2. Set `ACTIVE_PDP_TEMPLATE` to its id.
 * 3. Set `ACTIVE_PDP_GALLERY` to that template's `gallery` field
 *    (`standard`, `immersive`, or `mosaic`). The contract test fails when
 *    these disagree, and the gallery island plus route skeleton follow this value.
 *
 * Do not edit `src/app/.../products/[slug]/page.tsx` or `gallery-layout.ts` to change layout.
 */

export const ACTIVE_PDP_TEMPLATE = "immersive" as const;

export const ACTIVE_PDP_GALLERY = "immersive" as const;
