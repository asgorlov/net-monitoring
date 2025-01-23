import { Config } from "../models/config.models";
import { MainState, MainStateBase } from "../store/main.slice";
import {
  convertHostViewModelsToPingHosts,
  getUpdatedHostViewModels
} from "./host.util";

export const updateState = (state: MainState, payload: MainStateBase) => {
  state.port = payload.port;
  state.loggerLevel = payload.loggerLevel;
  state.loggerType = payload.loggerType;
  state.numberOfLogFiles = payload.numberOfLogFiles;
  state.logFileSizeInBytes = payload.logFileSizeInBytes;
  state.autoPing = payload.autoPing ?? state.autoPing;
  state.interval = payload.interval;
  state.timeout = payload.timeout;
  state.hostViewModels = payload.hostViewModels;
};

export const updateStateByConfig = (state: MainState, config: Config) => {
  updateState(state, {
    port: config.port,
    loggerLevel: config.logger.level,
    loggerType: config.logger.type,
    numberOfLogFiles: config.logger.numberOfLogFiles,
    logFileSizeInBytes: config.logger.logFileSizeInBytes,
    autoPing: config.request.autoPing,
    interval: config.request.interval,
    timeout: config.request.timeout,
    hostViewModels: getUpdatedHostViewModels(
      config.pingHosts,
      state.hostViewModels
    )
  });
};

export const convertStateToConfig = (state: MainState): Config => {
  return {
    port: state.port,
    logger: {
      level: state.loggerLevel,
      type: state.loggerType,
      numberOfLogFiles: state.numberOfLogFiles,
      logFileSizeInBytes: state.logFileSizeInBytes
    },
    request: {
      autoPing: state.autoPing,
      interval: state.interval,
      timeout: state.timeout
    },
    pingHosts: convertHostViewModelsToPingHosts(state.hostViewModels)
  };
};
