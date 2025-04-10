import { ConfigLogger } from "./shared/models/config.models";

declare global {
  interface Window {
    api: {
      openTab: (url: string) => Promise<void>;
    };
    logger?: ConfigLogger | null;
  }
}
