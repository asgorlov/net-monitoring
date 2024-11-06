import { ConfigLogger, ConfigRequest } from "./common.models";

export interface SettingsForm
  extends ConfigRequest,
    Omit<ConfigLogger, "logFileSizeInBytes"> {
  port: number;
  logFileSize: number;
}