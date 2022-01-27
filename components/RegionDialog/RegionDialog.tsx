import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { LOCALES } from "@/lib/regions";

import { Button } from "../Button";
import { useRegions } from "../RegionsProvider";
import { messages } from "../translations";
import { useCheckout } from "@/lib/providers/CheckoutProvider";

interface RegionDialogProps {
  onClose: () => void;
  isOpen: boolean;
}

export interface RegionFormData {
  channel: string;
  locale: string;
}

export const RegionDialog = ({ isOpen, onClose }: RegionDialogProps) => {
  const t = useIntl();
  const router = useRouter();
  const { resetCheckoutToken } = useCheckout();
  const { channels, currentChannel, setCurrentChannel, currentLocale } =
    useRegions();
  const { register: register, handleSubmit: handleSubmit } =
    useForm<RegionFormData>({
      defaultValues: {
        channel: currentChannel.slug,
        locale: currentLocale,
      },
    });
  const onSubmit = handleSubmit(async (formData: RegionFormData) => {
    if (formData.channel !== currentChannel.slug) {
      await setCurrentChannel(formData.channel);
      resetCheckoutToken();
    }
    onClose();

    // Update current URL to use the chosen channel
    await router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        channel: formData.channel,
        locale: formData.locale,
      },
    });
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="min-w-screen h-screen fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center"
      id="modal-id"
    >
      <div className="absolute bg-black opacity-50 inset-0 z-0"></div>
      <div className="w-full  max-w-lg pb-6 relative mx-auto my-auto rounded-sm shadow-lg flex flex-col items-center bg-white ">
        <div className="text-center p-5 mt-4 flex-auto justify-center">
          <h2 className="text-2xl font-bold py-4">
            {t.formatMessage(messages.regionModalHeader)}
          </h2>
        </div>
        <div className="text-gray-300 py-1 mb-4 flex flex-col items-center w-3/5">
          <p className="text-sm text-gray-500 self-start mb-1">
            {t.formatMessage(messages.channelFieldLabel)}
          </p>
          <select
            className="w-full"
            id="channel"
            {...register("channel", {
              required: true,
            })}
          >
            {channels.map(({ slug, name }) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-gray-300 py-1 pb-3 flex flex-col items-center w-3/5">
          <p className="text-sm text-gray-500 self-start mb-1">
            {t.formatMessage(messages.languageFieldLabel)}
          </p>
          <select
            className="w-full"
            id="locale"
            {...register("locale", {
              required: true,
            })}
          >
            {LOCALES.map((locale) => (
              <option key={locale.slug} value={locale.slug}>
                {locale.name}
              </option>
            ))}
          </select>
        </div>
        <div className="p-3  mt-4 mb-4 text-center space-x-4 md:block">
          <Button onClick={onSubmit}>
            {t.formatMessage(messages.saveButton)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegionDialog;
