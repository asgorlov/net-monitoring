import path from "path";
import { CONFIG_FILE_NAME } from "../../shared/constants/config.constants";

const configPath = path.join(process.cwd(), `/${CONFIG_FILE_NAME}`);

const pathToLogDir = path.join(process.cwd(), "/logs");

const Path = {
  config: configPath,
  logDir: pathToLogDir,
};

export default Path;
