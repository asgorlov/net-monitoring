import { HostType } from "../../renderer/constants/common.constants";
import { HostFieldError } from "../../renderer/constants/form.constants";

export type uuid = string;

export interface HostBase {
  id: uuid;
  host: string;
}

export interface CommonPingHost extends HostBase {
  name: string;
  type: HostType;
}

export interface PingHost extends CommonPingHost {
  children: PingHost[];
}

export interface FlattedPingHost extends CommonPingHost {
  parentId: uuid | null;
  childIds: uuid[];
}

export interface HostViewModel extends FlattedPingHost {
  errors: HostFieldError[];
}

export interface PingHostParams {
  pingId: uuid;
  host: HostBase;
}
