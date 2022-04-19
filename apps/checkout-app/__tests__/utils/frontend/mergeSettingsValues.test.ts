import { mergeSettingsValues } from "@/frontend/utils";

describe("/utils/frontend/mergeSettingsValues", () => {
  it("overrides default values", async () => {
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

    const mergedSettings = mergeSettingsValues(defaultSettings, savedSettings);

    const expectedSettings = {
      foo: {
        bar: "qux",
        car: "cax",
      },
    };

    expect(mergedSettings).toEqual(expectedSettings);
  });

  it("adds default values when no corresponding saved values", async () => {
    const defaultSettings = {
      foo: {
        bar: "baz",
        car: "caz",
      },
    };
    const savedSettings = {};

    const mergedSettings = mergeSettingsValues(defaultSettings, savedSettings);

    expect(mergedSettings).toEqual(defaultSettings);
  });

  it("adds saved values when no corresponding default values", async () => {
    const defaultSettings = {};
    const savedSettings = {
      foo: {
        bar: "qux",
        cat: "cax",
      },
    };

    const mergedSettings = mergeSettingsValues(defaultSettings, savedSettings);

    expect(mergedSettings).toEqual(savedSettings);
  });

  it("merges default and saved values", async () => {
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

    const mergedSettings = mergeSettingsValues(defaultSettings, savedSettings);

    const expectedSettings = {
      foo: {
        fooOne: "one",
        fooTwo: "two",
        fooThree: "three",
        fooFour: "four",
      },
    };

    expect(mergedSettings).toEqual(expectedSettings);
  });

  it("overrides default, adds default, adds saved values", async () => {
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

    const mergedSettings = mergeSettingsValues(defaultSettings, savedSettings);

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
  });

  it("merges default and saved sub-settings", async () => {
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

    const mergedSettings = mergeSettingsValues(defaultSettings, savedSettings);

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
  });
});
