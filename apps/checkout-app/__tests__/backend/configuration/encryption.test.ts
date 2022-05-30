import { obfuscateValue } from "@/backend/configuration/encryption";

describe("@/backend/configuration/encryption", () => {
  describe("obfuscateValue", () => {
    it("obfuscates first part of value", () => {
      expect(obfuscateValue("12345")).toBe("**** 5");
      expect(obfuscateValue("123456")).toBe("**** 56");
      expect(obfuscateValue("1234567")).toBe("**** 567");
      expect(obfuscateValue("123456789")).toBe("**** 6789");
      expect(obfuscateValue("1234567__qwe$%#%^!@#89abcd")).toBe("**** abcd");
    });

    it("obfuscates everything for value length shorter than 4", () => {
      expect(obfuscateValue("1")).toBe("****");
      expect(obfuscateValue("12")).toBe("****");
      expect(obfuscateValue("123")).toBe("****");
      expect(obfuscateValue("1234")).toBe("****");
    });
  });
});
