import { shell } from "electron";
import Logger from "./main-logger.utils";

const openTabExternal = async (url: string): Promise<void> => {
  try {
    await shell.openExternal(url);
  } catch (e) {
    Logger.error(e);
    throw e;
  }
};

const CommonUtil = {
  openTabExternal: openTabExternal,
};

export default CommonUtil;
