/**
 * Shipping address components for checkout.
 *
 * ## Component Hierarchy
 *
 * ```
 * HybridAddressSelector (smart, recommended)
 * ├── AddressSelector (inline mode, ≤3 addresses)
 * │   └── Radio cards with "set as default" checkbox
 * └── AddressCard + AddressPickerSheet (collapsed mode, 4+ addresses)
 *     └── Sheet with scrollable address list
 * ```
 *
 * ## When to Use What
 *
 * - `HybridAddressSelector` - **Default choice**. Automatically adapts UX based on address count.
 * - `AddressSelector` - When you always want inline radio cards (no threshold).
 * - `AddressCard` - Standalone compact address preview.
 * - `AddressPickerSheet` - Standalone sheet for address selection (advanced use).
 * - `AddressDisplay` - Read-only address display (e.g., order confirmation).
 *
 * ## Example
 *
 * ```tsx
 * import { HybridAddressSelector, AddressDisplay } from "@/checkout/components/shipping-address";
 *
 * // Smart selector: adapts to address count (≤3 inline, 4+ collapsed with sheet)
 * <HybridAddressSelector
 *   addresses={user.addresses}
 *   selectedAddressId={selectedId}
 *   onSelectAddress={setSelectedId}
 *   defaultAddressId={user.defaultShippingAddress?.id}
 *   onAddNew={() => setShowAddForm(true)}
 *   onEdit={(id) => setEditId(id)}
 * />
 *
 * // For order confirmation / review
 * <AddressDisplay
 *   title="Shipping address"
 *   address={checkout.shippingAddress}
 * />
 * ```
 */

export { HybridAddressSelector, type HybridAddressSelectorProps } from "./HybridAddressSelector";
export { AddressSelector, type AddressSelectorProps } from "./AddressSelector";
export { AddressDisplay, type AddressDisplayProps } from "./AddressDisplay";
export { AddressCard, type AddressCardProps } from "./AddressCard";
export { AddressPickerSheet, type AddressPickerSheetProps } from "./AddressPickerSheet";

// Re-export form components from existing location for convenience
export {
	AddressFields,
	FormInput,
	FormSelect,
	FieldError,
	addressFieldIcons,
	addressFieldPairs,
} from "@/checkout/views/SaleorCheckout/AddressFormFields";
