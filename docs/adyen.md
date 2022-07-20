# Adyen setup guide

In this guide we'll setup [Adyen](https://www.adyen.com/) payment gateway with Saleor Checkout.

## Setup

Saleor Checkout uses Adyen's [Pay by Link flow](https://docs.adyen.com/unified-commerce/pay-by-link)

1. [Sign up for Adyen test account](https://www.adyen.com/signup)

2. In [test Customer Area](https://ca-test.adyen.com/) create [new merchant account](https://ca-test.adyen.com/ca/ca/accounts/show.shtml)

3. [Create new API credentials](https://ca-test.adyen.com/ca/ca/config/api_credentials_new.shtml). Go to **Developers > API credentials > Create new credential**

Select "Web service user" and enter some description (for example "Saleor Checkout")

![Setup Adyen API credentials modal in Customer Area](./screenshots/setup-adyen-1.png)

4. Copy **API key** from newly generated API credentials:

![Copy API key from Adyen Customer Area](./screenshots/setup-adyen-2.png)

Go to Checkout app configuration. It can be found in Saleor dashboard in: **Apps > Third party apps > Checkout**. Once you open the app, select one of the channels and click the gears icon:

![Payment gateway configuration in Saleor dashboard](./screenshots/config-dashboard-2.png)

To configure API key go to: Adyen > **Private API key** and paste what you've copied from Adyen.

![Paste API key in Checkout app configuration](./screenshots/setup-adyen-3.png)

5. Click **"Generate client key"** and copy it to clipboard, paste it in Checkout app configuration > Adyen > **Public client key**

![Copy client key from Adyen's Customer Area](./screenshots/setup-adyen-4.png)

![Paste client key in Checkout app configuration](./screenshots/setup-adyen-5.png)

6. **Add allowed origin** to your Client key, paste URL of your deployed [Checkout SPA](#checkout-spa) and click **"Add"**

![Pasted deployed URL of Checkout SPA in client key's allowed origin](./screenshots/setup-adyen-6.png)

7. **Save changes** you've made to API credential

8. [Create standard notification webhook](https://docs.adyen.com/unified-commerce/pay-by-link/payment-links/api#webhooks). Go to Developers > [Webhooks](https://ca-test.adyen.com/ca/ca/config/showthirdparty.shtml) > "+ Webhook" > ["Standard notification"](https://ca-test.adyen.com/ca/ca/config/configurethirdparty.shtml?method:add&selectedMimetype=notifications)

![Creating new Standard notification webhook in Adyen portal](./screenshots/setup-adyen-7.png)

Fill out the webhook details:

- **Description** - enter some description for your webhook (ex. Saleor Checkout notifications)
- **Server configuration**
  - **URL** - URL of your deployed [Checkout App](#saleor-app-checkout) + `/api/webhooks/adyen`

```
<YOUR_CHECKOUT_APP_URL>/api/webhooks/adyen
```

- Other settings should be set to default:
  - **Method**: JSON
  - **SSL version**: TLSv1.2
  - **Service version** - 1

![Webhook Server configuration config](./screenshots/setup-adyen-webhook-1.png)

- **Merchant accounts** - choose "Include only specific merchant accounts" and select the merchant account you'll use for checkout, the name must be provided in Checkout App configuration

![Webhook Merchant accounts configuration](./screenshots/setup-adyen-webhook-2.png)

![Merchant account configuration in Checkout app settings](./screenshots/setup-adyen-webhook-3.png)

- **Events** - leave events selected by default
- **Security**
  - **Basic authentication** - arbitrary username and password, you can use `openssl rand -hex 64` to generate random password
  - **HMAC Key** - click "Generate" and copy the key
  - Those 3 values: `username`, `password` and `HMAC Key` must be provided in Checkout App configuration

This is how your webhook configuration should look like in Adyen:

![Final adyen webhook configuration](./screenshots/setup-adyen-webhook-4.png)

This is how your Checkout App configuration should look like in Saleor dashboard:

![Final checkout app configuration in Saleor dashboard](./screenshots/setup-adyen-webhook-5.png)

9. Save settings in Adyen and in Checkout App configuration

10. Test webhook configuration in Adyen

Click "Test configuration" button after you've saved the configuration.

Select **"AUTHORISATION"** from the list and click "Test"

![Selecting what webhook event should be sent to Checkout App](./screenshots/setup-adyen-webhook-test-1.png)

Adyen will make a call to your webhook. If everything is configured properly you'll see that the test was successful:

![Successful webhook test in Adyen](./screenshots/setup-adyen-webhook-test-2.png)

> Note: It can take a while for your webhook configuration to propagate in Adyen after you save it. If the test failed, give it a few minutes before you try again

If the response failed because of invalid configuration in Adyen, Checkout App will return the reason in response:

![Failed test because of invalid HMAC Key](./screenshots/setup-adyen-webhook-test-3.png)

11. After you've tested your webhook, enable it, by clicking the toggle button

![Enabling the webhook in Adyen](./screenshots/setup-adyen-webhook-6.png)

12. 🥳 Congrats! You've finished configuration of Adyen payment gateway
