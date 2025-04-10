import { shell } from "electron";

const openTabExternal = async (url: string): Promise<void> => {
  try {
    await shell.openExternal(url);
  } catch (e) {
    console.error(e); // toDo: сделать логирование в файл
    throw e;
  }
};

const CommonUtil = {
  openTabExternal: openTabExternal,
};

export default CommonUtil;
