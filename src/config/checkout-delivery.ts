/**
 * Postcode check
 *
 * At checkout's first step Paper asks Saleor whether the shop's own shipping zones serve the
 * postcode entered, and stops an address the zones exclude before the shipping step. It sees only
 * methods defined in shipping zones; with none for the country it stays silent. Turn it off when a
 * shipping app delivers to postcodes the zones exclude: the shipping step then gives the answer.
 */
export const postcodeDeliveryCheck = true;
