import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { LOCALES } from "@/lib/regions";

import { Button } from "../Button";
import { useRegions } from "../RegionsProvider";
import { messages } from "../translations";

export interface RegionDialogProps {
  onClose: () => void;
  isOpen: boolean;
}

export interface RegionFormData {
  channel: string;
  locale: string;
}

export function RegionDialog({ isOpen, onClose }: RegionDialogProps) {
  const t = useIntl();
  const router = useRouter();
  const { resetCheckoutToken } = useCheckout();
  const { channels, currentChannel, setCurrentChannel, currentLocale } = useRegions();
  const { register, handleSubmit } = useForm<RegionFormData>({
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
    <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" open={isOpen} onClose={onClose}>
      <div className="min-h-screen px-4 text-center flex flex-col items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

        <div className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-sm ">
          <div className="flex flex-col items-center">
            <Dialog.Title
              as="h3"
              className="text-center p-5  flex-auto justify-center text-2xl font-bold py-4"
            >
              {t.formatMessage(messages.regionModalHeader)}
            </Dialog.Title>

            <div className="text-gray-300 py-1 mb-4 flex flex-col items-center w-3/5">
              <p className="text-sm text-gray-500 self-start mb-1 ">
                {t.formatMessage(messages.channelFieldLabel)}
              </p>
              <select
                className="w-full text-black"
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
                className="w-full text-black"
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
            <div className="p-3  mt-4 text-center space-x-4 md:block">
              <Button
                className="bg-transparent hover:bg-gray-100 text-black py-2 px-4 border border-gray-200 hover:border-gray-500 "
                onClick={onClose}
              >
                Close
              </Button>
              <Button onClick={onSubmit}>{t.formatMessage(messages.saveButton)}</Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default RegionDialog;
