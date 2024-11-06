import { Config } from "../models/common.models";
import { MainState, MainStateBase } from "../store/main.slice";
import { HostBase, HostViewModel, PingHost, uuid } from "../models/host.models";

export const getHostsBaseInOneLevel = (hosts: PingHost[]): HostBase[] => {
  const result: HostBase[] = [];

  hosts.forEach(h => {
    result.push({
      id: h.id,
      host: h.host
    });
    if (h.children.length) {
      result.push(...getHostsBaseInOneLevel(h.children));
    }
  });

  return result;
};

export const initializePingHostViewModel = (
  hosts: PingHost[]
): Record<uuid, HostViewModel> => {
  const result: Record<uuid, HostViewModel> = {};

  getHostsBaseInOneLevel(hosts).forEach(v => {
    result[v.id] = {
      id: v.id,
      host: v.host,
      pinging: false,
      isAlive: null
    };
  });

  return result;
};

export const updateStateByBaseConfigData = (
  state: MainState,
  payload: MainStateBase
) => {
  state.port = payload.port;
  state.loggerLevel = payload.loggerLevel;
  state.loggerType = payload.loggerType;
  state.numberOfLogFiles = payload.numberOfLogFiles;
  state.logFileSizeInBytes = payload.logFileSizeInBytes;
  state.interval = payload.interval;
  state.timeout = payload.timeout;
  state.pingHosts = payload.pingHosts;
};

export const updateStateByConfig = (state: MainState, config: Config) => {
  updateStateByBaseConfigData(state, {
    port: config.port,
    loggerLevel: config.logger.level,
    loggerType: config.logger.type,
    numberOfLogFiles: config.logger.numberOfLogFiles,
    logFileSizeInBytes: config.logger.logFileSizeInBytes,
    interval: config.request.interval,
    timeout: config.request.timeout,
    pingHosts: config.pingHosts
  });
};
