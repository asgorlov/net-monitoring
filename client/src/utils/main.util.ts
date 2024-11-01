import { Config, HostViewModel, PingHost } from "../models/common.models";
import { MainState, MainStateBase } from "../store/main.slice";

export const getHostValuesInOneLevel = (hosts: PingHost[]): string[] => {
  const result: string[] = [];

  hosts.forEach(h => {
    result.push(h.host);
    if (h.children.length) {
      result.push(...getHostValuesInOneLevel(h.children));
    }
  });

  return result;
};

export const initializePingHostViewModel = (
  hosts: PingHost[]
): Map<string, HostViewModel> => {
  const hostValues = getHostValuesInOneLevel(hosts);
  const entries: [string, HostViewModel][] = hostValues.map(v => {
    const model: HostViewModel = {
      host: v,
      pinging: false,
      isAlive: null
    };

    return [v, model];
  });

  return new Map(entries);
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
