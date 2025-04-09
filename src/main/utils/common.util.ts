import { shell } from "electron";

const openTabExternal = async (url: string): Promise<void> => {
  await shell.openExternal(url);
};

const CommonUtil = {
  openTabExternal: openTabExternal,
};

export default CommonUtil;
