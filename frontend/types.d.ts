declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

interface Window {
  DeckyPluginLoader?: {
    deckyState?: { setActivePlugin(name: string): void };
  };
}
