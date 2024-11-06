import { HostType } from "../constants/common.constants";

export type uuid = string;

export interface HostBase {
  id: uuid;
  host: string;
}

export interface HostStatus extends HostBase {
  isAlive: boolean | null;
}

export interface HostResponseBody {
  hostStatuses: HostStatus[];
}

export interface PingHost extends HostBase {
  name: string;
  type: HostType;
  children: PingHost[];
}

export interface HostViewModel extends HostStatus {
  pinging: boolean;
}
