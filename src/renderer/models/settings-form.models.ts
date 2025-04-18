import { ConfigLogger, ConfigRequest } from "../../shared/models/config.models";

export interface SettingsForm
  extends ConfigRequest,
    Omit<ConfigLogger, "logFileSizeInBytes"> {
  logFileSize: number;
}
