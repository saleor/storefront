import { useForm } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { SALEOR_AUTHORIZATION_BEARER_HEADER, SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { useEffect } from "react";
import { Button } from "@saleor/macaw-ui";

export const ConfigForm = () => {
  const { register, handleSubmit, setValue } = useForm<{ checkoutUrl: string }>({});
  const { appBridgeState } = useAppBridge();

  useEffect(() => {
    fetch("/api/settings", {
      method: "GET",
      headers: [
        ["content-type", "application/json"],
        [SALEOR_DOMAIN_HEADER, appBridgeState?.domain ?? ""],
        [SALEOR_AUTHORIZATION_BEARER_HEADER, appBridgeState?.token ?? ""],
      ],
    })
      .then((r) => r.json())
      .then(({ data }) => {
        setValue("checkoutUrl", data.checkoutUrl);
      });
  }, []);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        if (!appBridgeState) {
          return;
        }

        fetch("/api/settings", {
          method: "POST",
          headers: [
            ["content-type", "application/json"],
            [SALEOR_DOMAIN_HEADER, appBridgeState?.domain ?? ""],
            [SALEOR_AUTHORIZATION_BEARER_HEADER, appBridgeState?.token ?? ""],
          ],
          body: JSON.stringify(values),
        })
          .then()
          .catch();
      })}
    >
      <TextField
        required
        type="url"
        variant="standard"
        helperText="To this URL user will be redirected from order"
        {...register("checkoutUrl")}
        label="Checkout URL"
      />
      <Button className="ml-4 font-bold block" type="submit">
        Save
      </Button>
    </form>
  );
};
