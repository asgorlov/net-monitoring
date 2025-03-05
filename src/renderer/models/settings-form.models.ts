import { ConfigLogger, ConfigRequest } from "./config.models";

export interface SettingsForm
  extends ConfigRequest,
    Omit<ConfigLogger, "logFileSizeInBytes"> {
  port: number;
  logFileSize: number;
}
