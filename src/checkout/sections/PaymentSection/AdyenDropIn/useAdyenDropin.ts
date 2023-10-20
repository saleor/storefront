/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type DropinElement from "@adyen/adyen-web/dist/types/components/Dropin";
import { useCallback, useEffect, useMemo, useState } from "react";
import { camelCase } from "lodash-es";
import {
	type TransactionInitializeMutationVariables,
	type TransactionProcessMutationVariables,
	useTransactionInitializeMutation,
	useTransactionProcessMutation,
} from "@/checkout/graphql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useEvent } from "@/checkout/hooks/useEvent";
import { useSubmit } from "@/checkout/hooks/useSubmit";
import {
	type AdyenCheckoutInstanceOnAdditionalDetails,
	type AdyenCheckoutInstanceOnSubmit,
	type AdyenCheckoutInstanceState,
	type AdyenPaymentResponse,
} from "@/checkout/sections/PaymentSection/AdyenDropIn/types";
import {
	anyFormsValidating,
	areAllFormsValid,
	useCheckoutValidationActions,
	useCheckoutValidationState,
} from "@/checkout/state/checkoutValidationStateStore";
import { clearQueryParams, getQueryParams, type ParamBasicValue, replaceUrl } from "@/checkout/lib/utils/url";
import { type ParsedAdyenGateway } from "@/checkout/sections/PaymentSection/types";
import {
	areAnyRequestsInProgress,
	hasFinishedApiChangesWithNoError,
	useCheckoutUpdateState,
	useCheckoutUpdateStateActions,
} from "@/checkout/state/updateStateStore";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import {
	adyenErrorMessages,
	apiErrorMessages,
} from "@/checkout/sections/PaymentSection/AdyenDropIn/errorMessages";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { useUser } from "@/checkout/hooks/useUser";
import { getUrlForTransactionInitialize } from "@/checkout/sections/PaymentSection/utils";
import { usePaymentProcessingScreen } from "@/checkout/sections/PaymentSection/PaymentProcessingScreen";

export interface AdyenDropinProps {
	config: ParsedAdyenGateway;
}

export const useAdyenDropin = (props: AdyenDropinProps) => {
	const { config } = props;
	const { id } = config;

	const {
		checkout: { id: checkoutId, totalPrice },
	} = useCheckout();
	const { authenticated } = useUser();
	const { getMessageByErrorCode } = useErrorMessages(adyenErrorMessages);
	const { errorMessages: commonErrorMessages } = useErrorMessages(apiErrorMessages);
	const { validateAllForms } = useCheckoutValidationActions();
	const { validationState } = useCheckoutValidationState();
	const { updateState, loadingCheckout, ...rest } = useCheckoutUpdateState();
	const { showCustomErrors } = useAlerts();
	const { submitInProgress } = useCheckoutUpdateState();
	const { setSubmitInProgress, setShouldRegisterUser } = useCheckoutUpdateStateActions();
	const { setIsProcessingPayment } = usePaymentProcessingScreen();

	const [currentTransactionId, setCurrentTransactionId] = useState<ParamBasicValue>(
		getQueryParams().transaction,
	);
	const [, transactionInitialize] = useTransactionInitializeMutation();
	const [, transactionProccess] = useTransactionProcessMutation();
	const { onCheckoutComplete } = useCheckoutComplete();

	const [adyenCheckoutSubmitParams, setAdyenCheckoutSubmitParams] = useState<{
		state: AdyenCheckoutInstanceState;
		component: DropinElement;
	} | null>(null);

	const anyRequestsInProgress = areAnyRequestsInProgress({ updateState, loadingCheckout, ...rest });

	const finishedApiChangesWithNoError = hasFinishedApiChangesWithNoError({
		updateState,
		loadingCheckout,
		...rest,
	});

	const handlePaymentResult = useCallback(
		({
			paymentResponse,
			transaction,
		}: {
			paymentResponse: AdyenPaymentResponse;
			transaction: MightNotExist<{ id: string }>;
		}) => {
			const { action, resultCode } = paymentResponse;

			if (transaction) {
				setCurrentTransactionId(transaction.id);
				replaceUrl({ query: { transaction: transaction.id } });
			}

			if (action) {
				adyenCheckoutSubmitParams?.component.handleAction(action);
			}

			switch (resultCode) {
				case "Authorised":
					adyenCheckoutSubmitParams?.component.setStatus("success");
					void onCheckoutComplete();
					return;
				case "Error":
					adyenCheckoutSubmitParams?.component.setStatus("error");
					showCustomErrors([{ message: "There was an error processing your payment." }]);
					return;
				case "Refused":
					setCurrentTransactionId(undefined);

					adyenCheckoutSubmitParams?.component.setStatus("ready");

					const messageKey = camelCase(paymentResponse.refusalReason);

					showCustomErrors([{ message: getMessageByErrorCode(messageKey) }]);

					return;
			}
		},
		[adyenCheckoutSubmitParams?.component, getMessageByErrorCode, onCheckoutComplete, showCustomErrors],
	);

	const onTransactionInitialize = useSubmit<
		TransactionInitializeMutationVariables,
		typeof transactionInitialize
	>(
		useMemo(
			() => ({
				onSubmit: transactionInitialize,
				onError: () => {
					showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
					adyenCheckoutSubmitParams?.component.setStatus("ready");
				},
				extractCustomErrors: (result) => result?.data?.transactionInitialize?.data?.errors,
				onSuccess: async ({ data }) => {
					if (!data) {
						showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
						return;
					}

					const { transaction, data: adyenData } = data;

					if (!transaction || !adyenData) {
						return;
					}

					if (adyenData) {
						void handlePaymentResult({
							paymentResponse: adyenData.paymentResponse,
							transaction,
						});
					}
				},
			}),
			[
				adyenCheckoutSubmitParams?.component,
				commonErrorMessages.somethingWentWrong,
				handlePaymentResult,
				showCustomErrors,
				transactionInitialize,
			],
		),
	);

	const onTransactionProccess = useSubmit<TransactionProcessMutationVariables, typeof transactionProccess>(
		useMemo(
			() => ({
				onSubmit: transactionProccess,
				onError: () => {
					// will tell the processing screen to disappear
					setIsProcessingPayment(false);
					// we don't do these at onFinished since redirect will happen first
					clearQueryParams("transaction");
					setCurrentTransactionId(null);

					showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
					adyenCheckoutSubmitParams?.component.setStatus("ready");
				},
				extractCustomErrors: (result) => result?.data?.transactionProcess?.data?.errors,
				onSuccess: ({ data }) => {
					if (!data?.data) {
						showCustomErrors([{ message: commonErrorMessages.somethingWentWrong }]);
						return;
					}

					const {
						transaction,
						data: { paymentDetailsResponse },
					} = data;

					// we don't do these at onFinished since redirect will happen first
					clearQueryParams("transaction");
					setCurrentTransactionId(null);

					handlePaymentResult({
						paymentResponse: paymentDetailsResponse,
						transaction,
					});
				},
			}),
			[
				adyenCheckoutSubmitParams?.component,
				commonErrorMessages.somethingWentWrong,
				handlePaymentResult,
				setIsProcessingPayment,
				showCustomErrors,
				transactionProccess,
			],
		),
	);

	// handler for when user presses submit in the dropin
	const onSubmitInitialize: AdyenCheckoutInstanceOnSubmit = useEvent(async (state, component) => {
		component.setStatus("loading");
		setAdyenCheckoutSubmitParams({ state, component });
		validateAllForms(authenticated);
		setShouldRegisterUser(true);
		setSubmitInProgress(true);
	});

	// when submission is initialized, awaits for all the other requests to finish,
	// forms to validate, then either does transaction initialize or process
	useEffect(() => {
		const validating = anyFormsValidating(validationState);
		const allFormsValid = areAllFormsValid(validationState);

		if (!submitInProgress || validating || anyRequestsInProgress || !adyenCheckoutSubmitParams) {
			return;
		}

		// submit was finished - we can mark it as complete
		setSubmitInProgress(false);

		// there was en error either in some other request or form validation
		// - stop the submission altogether
		if (!finishedApiChangesWithNoError || !allFormsValid) {
			adyenCheckoutSubmitParams?.component.setStatus("ready");
			return;
		}

		adyenCheckoutSubmitParams.component.setStatus("loading");

		// there is a previous transaction going on, we want to process instead of initialize
		if (currentTransactionId) {
			void onTransactionProccess({
				data: adyenCheckoutSubmitParams?.state.data,
				id: currentTransactionId,
			});
			return;
		}

		void onTransactionInitialize({
			checkoutId,
			amount: totalPrice.gross.amount,
			paymentGateway: {
				id,
				data: {
					...adyenCheckoutSubmitParams.state.data,
					returnUrl: getUrlForTransactionInitialize()?.newUrl,
				},
			},
		});
	}, [
		adyenCheckoutSubmitParams,
		anyRequestsInProgress,
		checkoutId,
		currentTransactionId,
		finishedApiChangesWithNoError,
		onTransactionInitialize,
		onTransactionProccess,
		submitInProgress,
		totalPrice.gross.amount,
		validationState,
		id,
		setSubmitInProgress,
	]);

	const onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails = useEvent(async (state, component) => {
		setAdyenCheckoutSubmitParams({ state, component });
		if (currentTransactionId) {
			adyenCheckoutSubmitParams?.component?.setStatus("loading");
			setSubmitInProgress(true);
		}
	});

	// handle when page is opened from previously redirected payment
	useEffect(() => {
		const { redirectResult, transaction, processingPayment } = getQueryParams();

		if (!redirectResult || !transaction || !processingPayment) {
			return;
		}

		const decodedRedirectData = decodeURI(redirectResult);

		setCurrentTransactionId(transaction);

		clearQueryParams("redirectResult", "resultCode");

		void onTransactionProccess({
			id: transaction,
			data: { details: { redirectResult: decodedRedirectData } },
		});
	}, []);

	return { onSubmit: onSubmitInitialize, onAdditionalDetails };
};
