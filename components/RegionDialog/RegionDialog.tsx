import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

import { clearCheckout } from "@/lib/checkout";
import { LOCALES } from "@/lib/regions";

import { Button } from "../Button";
import useChannels from "../ChannelsProvider/useChannels";

interface RegionDialogProps {
  onClose: () => void;
  isOpen: boolean;
}

export interface RegionFormData {
  channel: string;
  locale: string;
}

const RegionDialog: React.FC<RegionDialogProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { channels, currentChannel, setCurrentChannel } = useChannels();
  const { register: register, handleSubmit: handleSubmit } =
    useForm<RegionFormData>({
      defaultValues: {
        channel: currentChannel.slug || "default-channel",
        locale: router.locale || "en-US",
      },
    });
  const onSubmit = handleSubmit(async (formData: RegionFormData) => {
    if (formData.channel !== currentChannel.slug) {
      await setCurrentChannel(formData.channel);
      clearCheckout();
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
      <div className="w-full  max-w-lg pb-5 relative mx-auto my-auto rounded-sm shadow-lg  bg-white ">
        <div className="text-center p-5 flex-auto justify-center">
          <h2 className="text-xl font-bold py-4 ">Choose your region</h2>
        </div>
        <p className="text-sm text-gray-500 px-8">Channel</p>
        <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
          <select
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
        <p className="text-sm text-gray-500 px-8">Language</p>
        <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
          <select
            id="locale"
            {...register("locale", {
              required: true,
            })}
          >
            {LOCALES.map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
          </select>
        </div>
        <div className="p-3  mt-2 text-center space-x-4 md:block">
          <Button onClick={onSubmit}>Apply</Button>
        </div>
      </div>
    </div>
  );
};

export default RegionDialog;
