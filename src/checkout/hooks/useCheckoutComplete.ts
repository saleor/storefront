import { useMemo } from "react";
import { useMutation, gql } from "urql";
import { useCheckoutCompleteMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useSubmit } from "@/checkout/hooks/useSubmit";
import { replaceUrl } from "@/checkout/lib/utils/url";
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
				parse: () => ({
					checkoutId,
				}),
				onStart: async () => {
					// Update metadata with Cortex data before completing checkout
					if (cortexData && (cortexData.cortexCloudUsername || cortexData.cortexFollowConfirmed)) {
						try {
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
						} catch (error) {
							console.error("Failed to update cortex metadata:", error);
							// Continue with checkout even if metadata update fails
						}
					}
				},
				onSubmit: checkoutComplete,
				onSuccess: ({ data }) => {
					const order = data.order;

					if (order) {
						// Clear cortex data after successful checkout
						clearCortexData();

						const newUrl = replaceUrl({
							query: {
								order: order.id,
							},
							replaceWholeQuery: true,
						});
						window.location.href = newUrl;
					}
				},
			}),
			[checkoutComplete, checkoutId, clearCortexData, cortexData, updateMetadata],
		),
	);
	return { completingCheckout: fetching, onCheckoutComplete };
};
