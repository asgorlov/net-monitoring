import { ConfigLogger, ConfigRequest } from "../../shared/models/config.models";
import { HostViewModel, uuid } from "../../shared/models/host.models";

export interface SettingsFormData
  extends ConfigRequest,
    Omit<ConfigLogger, "logFileSizeInBytes"> {
  logFileSize: number;
}

export interface SettingsForm {
  data: SettingsFormData;
}

export interface SchemeForm {
  data: Record<uuid, HostViewModel>;
  setData: (data: Record<uuid, HostViewModel>) => void;
}
