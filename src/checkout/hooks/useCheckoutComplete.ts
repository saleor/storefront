import { useMemo } from "react";
import { useMutation, gql } from "urql";
import { useCheckoutCompleteMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useSubmit } from "@/checkout/hooks/useSubmit";
import { getUrl } from "@/checkout/lib/utils/url";
import { useCortexDataStore } from "@/checkout/state/cortexDataStore";

const UPDATE_METADATA_MUTATION = gql`
	mutation UpdateCheckoutMetadata($id: ID!, $input: [MetadataInput!]!) {
		updateMetadata(id: $id, input: $input) {
			errors {
				field
				message
			}
			item {
				... on Checkout {
					id
				}
			}
		}
	}
`;

export const useCheckoutComplete = () => {
	const {
		checkout: { id: checkoutId },
	} = useCheckout();
	const [{ fetching }, checkoutComplete] = useCheckoutCompleteMutation();
	const [, updateMetadata] = useMutation(UPDATE_METADATA_MUTATION);
	const { cortexData, clearCortexData } = useCortexDataStore();

	const onCheckoutComplete = useSubmit<{}, typeof checkoutComplete>(
		useMemo(
			() => ({
				parse: () => {
					console.warn("[CHECKOUT_COMPLETE] Parsing checkout ID", { checkoutId });
					return {
						checkoutId,
					};
				},
				onStart: async () => {
					console.warn("[CHECKOUT_COMPLETE] Starting checkout completion");


					// Update metadata with Cortex data before completing checkout
					if (cortexData && (cortexData.cortexCloudUsername || cortexData.cortexFollowConfirmed)) {
						try {
							console.warn("[CHECKOUT_COMPLETE] Updating cortex metadata");
							await updateMetadata({
								id: checkoutId,
								input: [
									{
										key: "cortexCloudUsername",
										value: cortexData.cortexCloudUsername,
									},
									{
										key: "cortexFollowConfirmed",
										value: cortexData.cortexFollowConfirmed.toString(),
									},
								],
							});
							console.warn("[CHECKOUT_COMPLETE] Cortex metadata updated");
						} catch (error) {
							console.error("[CHECKOUT_COMPLETE] Failed to update cortex metadata:", error);
							// Continue with checkout even if metadata update fails
						}
					} else {
						console.warn("[CHECKOUT_COMPLETE] No cortex data to update");
					}
				},
				onSubmit: async (...args) => {
					console.warn("[CHECKOUT_COMPLETE] Calling checkoutComplete mutation");
					const result = await checkoutComplete(...args);
					console.warn("[CHECKOUT_COMPLETE] Mutation result", {
						hasData: !!result.data,
						hasError: !!result.error,
						errors: result.data?.checkoutComplete?.errors,
						orderId: result.data?.checkoutComplete?.order?.id,
					});
					return result;
				},
				onSuccess: ({ data }) => {
					console.warn("[CHECKOUT_COMPLETE] Success handler called", {
						hasData: !!data,
						hasOrder: !!data?.order,
						orderId: data?.order?.id,
					});
					const order = data.order;

					if (order) {
						console.warn("[ORDER] Order created successfully", {
							orderId: order.id,
						});

						// Clear cortex data after successful checkout
						clearCortexData();

						// Build the new URL without updating browser history
						const { newUrl } = getUrl({
							query: {
								order: order.id,
							},
							replaceWholeQuery: true,
						});

						console.warn("[ORDER] Redirecting to order confirmation", {
							url: newUrl,
						});

						// Force full page navigation to order confirmation
						window.location.href = newUrl;
					} else {
						console.error("[ORDER] No order returned from checkoutComplete mutation");
					}
				},
			}),
			[checkoutComplete, checkoutId, clearCortexData, cortexData, updateMetadata],
		),
	);
	return { completingCheckout: fetching, onCheckoutComplete };
};
