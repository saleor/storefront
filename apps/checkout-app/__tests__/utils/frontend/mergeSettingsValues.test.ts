import { mergeSettingsValues as mergePrivateSettingsValues } from "@/checkout-app/backend/configuration/mapPrivateMetafieldsToSettings";
import { mergeSettingsValues as mergePublicSettingsValues } from "@/checkout-app/frontend/misc/mapPublicMetafieldsToSettings";
import { PaymentProviderSettingsValues } from "@/checkout-app/types/api";

describe("/utils/frontend/misc/mergeSettingsValues", () => {
  it("overrides default values", () => {
    const defaultSettings = {
      foo: {
        bar: "baz",
        car: "caz",
      },
    };
    const savedSettings = {
      foo: {
        bar: "qux",
        car: "cax",
      },
    };
    const savedPrivateSettings = {
      foo: {
        bar: {
          encrypted: false,
          value: "qux",
        },
        car: {
          encrypted: false,
          value: "cax",
        },
      },
    };

    const mergedSettings = mergePublicSettingsValues(
      defaultSettings,
      savedSettings
    );
    const privateMergedSettings = mergePrivateSettingsValues(
      defaultSettings,
      savedPrivateSettings,
      false
    );

    const expectedSettings = {
      foo: {
        bar: "qux",
        car: "cax",
      },
    };

    expect(mergedSettings).toEqual(expectedSettings);
    expect(privateMergedSettings).toEqual(expectedSettings);
  });

  it("adds default values when no corresponding saved values", () => {
    const defaultSettings = {
      foo: {
        bar: "baz",
        car: "caz",
      },
    };
    const savedSettings = {};

    const mergedSettings = mergePublicSettingsValues(
      defaultSettings,
      savedSettings
    );
    const privateMergedSettings = mergePrivateSettingsValues(
      defaultSettings,
      savedSettings,
      false
    );

    expect(mergedSettings).toEqual(defaultSettings);
    expect(privateMergedSettings).toEqual(defaultSettings);
  });

  it("adds saved values when no corresponding default value (only not encrypted)", () => {
    const defaultSettings = {};
    const savedSettings = {
      foo: {
        bar: "qux",
        cat: "cax",
      },
    };
    const savedPrivateSettings = {
      foo: {
        bar: {
          encrypted: false,
          value: "qux",
        },
        car: {
          encrypted: false,
          value: "cax",
        },
      },
    };

    const mergedSettings = mergePublicSettingsValues(
      defaultSettings,
      savedSettings
    );
    const privateMergedSettings = mergePrivateSettingsValues(
      defaultSettings,
      savedPrivateSettings,
      false
    );

    expect(mergedSettings).toEqual(savedSettings);
    expect(privateMergedSettings).toEqual(defaultSettings);
  });

  it("merges default and saved values", () => {
    const defaultSettings = {
      foo: {
        fooOne: "one",
        fooTwo: "two",
      },
    };
    const savedSettings = {
      foo: {
        fooThree: "three",
        fooFour: "four",
      },
    };
    const savedPrivateSettings = {
      foo: {
        fooThree: {
          encrypted: false,
          value: "three",
        },
        fooFour: {
          encrypted: false,
          value: "four",
        },
      },
    };

    const mergedSettings = mergePublicSettingsValues(
      defaultSettings,
      savedSettings
    );
    const privateMergedSettings = mergePrivateSettingsValues(
      defaultSettings,
      savedPrivateSettings,
      false
    );

    const expectedSettings = {
      foo: {
        fooOne: "one",
        fooTwo: "two",
        fooThree: "three",
        fooFour: "four",
      },
    };

    expect(mergedSettings).toEqual(expectedSettings);
    expect(privateMergedSettings).toEqual(expectedSettings);
  });

  it("overrides default, adds default, adds saved values", () => {
    const defaultSettings = {
      foo: {
        fooOne: "one",
        fooTwo: "two",
        fooThree: "threeOld",
        fooFour: "threeOld",
      },
    };
    const savedSettings = {
      foo: {
        fooOne: "oneReplaced",
        fooTwo: "twoReplaced",
        fooFive: "fourNew",
        fooSix: "sixNew",
      },
    };
    const savedPrivateSettings = {
      foo: {
        fooOne: {
          encrypted: false,
          value: "oneReplaced",
        },
        fooTwo: {
          encrypted: false,
          value: "twoReplaced",
        },
        fooFive: {
          encrypted: false,
          value: "fourNew",
        },
        fooSix: {
          encrypted: false,
          value: "sixNew",
        },
      },
    };

    const mergedSettings = mergePublicSettingsValues(
      defaultSettings,
      savedSettings
    );
    const privateMergedSettings = mergePrivateSettingsValues(
      defaultSettings,
      savedPrivateSettings,
      false
    );

    const expectedSettings = {
      foo: {
        fooOne: "oneReplaced",
        fooTwo: "twoReplaced",
        fooThree: "threeOld",
        fooFour: "threeOld",
        fooFive: "fourNew",
        fooSix: "sixNew",
      },
    };

    expect(mergedSettings).toEqual(expectedSettings);
    expect(privateMergedSettings).toEqual(expectedSettings);
  });

  it("merges default and saved sub-settings", () => {
    const defaultSettings = {
      foo: {
        abc: "123",
        def: "456",
        cde: "145",
      },
    };
    const savedSettings = {
      bar: {
        xyz: "789",
        jpg: "890",
        png: "912",
      },
    };
    const savedPrivateSettings = {
      bar: {
        xyz: {
          encrypted: false,
          value: "789",
        },
        jpg: {
          encrypted: false,
          value: "890",
        },
        png: {
          encrypted: false,
          value: "912",
        },
      },
    };

    const mergedSettings = mergePublicSettingsValues(
      defaultSettings,
      savedSettings
    );
    const privateMergedSettings = mergePrivateSettingsValues(
      defaultSettings,
      savedPrivateSettings,
      false
    );

    const expectedSettings = {
      foo: {
        abc: "123",
        def: "456",
        cde: "145",
      },
      bar: {
        xyz: "789",
        jpg: "890",
        png: "912",
      },
    };

    expect(mergedSettings).toEqual(expectedSettings);
    expect(privateMergedSettings).toEqual(defaultSettings);
  });

  it("merges sample payment provider values", () => {
    const defaultSettings = {
      adyen: {
        clientKey: "",
        merchantAccount: "",
        supportedCurrencies: "",
      },
      mollie: {
        partnerId: "",
        liveApiKey: "",
        testApiKey: "",
      },
    };
    const savedSettings = {
      adyen: {
        clientKey: {
          encrypted: true,
          value:
            "U2FsdGVkX1/DpBetYEcOpf55fq9JoAa/fTUFzTq8zgh5IqTErE4YL8j1VD4KPBUN",
        },
        merchantAccount: {
          encrypted: true,
          value:
            "U2FsdGVkX182nG081Vfy9CdwO+ZDM2pgPCQuQ2foyPwWmh21JWaI33Gz5Fp5q+18",
        },
        supportedCurrencies: {
          encrypted: false,
          value: "USD,EUR",
        },
      },
      mollie: {
        partnerId: {
          encrypted: false,
          value: "",
        },
        liveApiKey: {
          encrypted: false,
          value: "",
        },
        testApiKey: {
          encrypted: false,
          value: "",
        },
      },
    };

    const mergedSettings = mergePrivateSettingsValues(
      defaultSettings,
      savedSettings,
      false
    );

    const expectedSettings = {
      adyen: {
        clientKey: "adyen_unencrypted_key",
        merchantAccount: "adyen_unencrypted_value",
        supportedCurrencies: "USD,EUR",
      },
      mollie: {
        partnerId: "",
        liveApiKey: "",
        testApiKey: "",
      },
    };

    expect(mergedSettings).toEqual(expectedSettings);
  });
});
