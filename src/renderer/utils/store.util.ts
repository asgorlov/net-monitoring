import { Config } from "../../shared/models/config.models";
import { MainState, MainStateBase } from "../store/main.slice";
import {
  convertHostViewModelsToPingHosts,
  getUpdatedHostViewModels,
} from "./host.util";
import { UploadFile } from "antd/es/upload/interface";
import { defaultConfig } from "../../shared/constants/config.constants";

export const updateState = (state: MainState, payload: MainStateBase) => {
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
    loggerLevel: config.logger.level,
    loggerType: config.logger.type,
    numberOfLogFiles: config.logger.numberOfLogFiles,
    logFileSizeInBytes: config.logger.logFileSizeInBytes,
    autoPing: config.request.autoPing,
    interval: config.request.interval,
    timeout: config.request.timeout,
    hostViewModels: getUpdatedHostViewModels(
      config.pingHosts,
      state.hostViewModels,
    ),
  });
};

export const convertStateToConfig = (state: MainState): Config => {
  return {
    logger: {
      level: state.loggerLevel,
      type: state.loggerType,
      numberOfLogFiles: state.numberOfLogFiles,
      logFileSizeInBytes: state.logFileSizeInBytes,
    },
    request: {
      autoPing: state.autoPing,
      interval: state.interval,
      timeout: state.timeout,
    },
    pingHosts: convertHostViewModelsToPingHosts(state.hostViewModels),
  };
};

export const getConfigFromFile = (file: UploadFile): Promise<Config> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = (event: ProgressEvent<FileReader>) => {
      const json = event.target?.result?.toString();

      if (json) {
        try {
          const config = JSON.parse(json);

          Object.keys(config).forEach((name) => {
            if (!Object.hasOwn(defaultConfig, name)) {
              delete config[name];
            }
          });

          resolve(config);
        } catch (e) {
          console.error(e);
          reject("Не удалось распарсить файл настроек");
        }
      }
    };

    reader.readAsText(file.originFileObj as Blob);
  });
};

export const updateConfig = (config: Config): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const result = await window.api.updateConfig(config);
    if (result.errorMessage) {
      reject(result.errorMessage);
    } else {
      resolve();
    }
  });
};
