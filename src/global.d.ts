interface Window {
  api: {
    openTab: (url: string) => Promise<void>;
    sendMessage: (channel: string, data: any) => Promise<any>;
  };
}
