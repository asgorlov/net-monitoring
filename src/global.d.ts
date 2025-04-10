interface Window {
  api: {
    openTab: (url: string) => Promise<void>;
  };
}
