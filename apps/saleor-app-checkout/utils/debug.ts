import debugPkg from "debug";

export const createDebug = (namespace: string) => debugPkg.debug(`saleor-app-checkout:${namespace}`);