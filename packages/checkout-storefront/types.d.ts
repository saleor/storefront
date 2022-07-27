declare module "*.svg" {
  const svg: string | { width: number; height: number; src: string };
  export = svg;
}
