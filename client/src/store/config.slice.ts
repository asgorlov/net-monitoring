import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import { defaultConfig } from "../constants/config.constants";
import { LoggerLevel, LoggerType } from "../constants/logger.constants";
import { Config, ConfigError, UpdatingConfig } from "../models/config.models";
import Path from "../constants/path.constants";
import { notification } from "antd";

export interface ConfigStateBase {
  port: number;
  loggerLevel: LoggerLevel;
  loggerType: LoggerType;
  numberOfLogFiles: number;
  logFileSizeInBytes: number;
  interval: number;
  timeout: number;
  pingHosts: string[];
}

export interface ConfigState extends ConfigStateBase {
  loading: boolean;
}

const initialState: ConfigState = {
  loading: false,
  port: defaultConfig.port,
  loggerLevel: defaultConfig.logger.level,
  loggerType: defaultConfig.logger.type,
  numberOfLogFiles: defaultConfig.logger.numberOfLogFiles,
  logFileSizeInBytes: defaultConfig.logger.logFileSizeInBytes,
  interval: defaultConfig.request.interval,
  timeout: defaultConfig.request.timeout,
  pingHosts: defaultConfig.pingHosts
};

export const getConfigAsync = createAsyncThunk(
  "config/get",
  (): Promise<Config> => {
    return new Promise((resolve, reject) => {
      fetch(Path.config)
        .then(async response => {
          if (response.ok) {
            const data: Config = await response.json();
            resolve(data);
          } else {
            const data: ConfigError = await response.json();
            reject(data.message);
          }
        })
        .catch(e => {
          reject("Не удалось выполнить запрос на получение настроек");
          console.error(e);
        });
    });
  }
);

export const updateConfigAsync = createAsyncThunk(
  "config/update",
  async (_, { getState }): Promise<void> => {
    return new Promise((resolve, reject) => {
      const state = getState() as ConfigState;
      const config: Config = {
        port: state.port,
        logger: {
          level: state.loggerLevel,
          type: state.loggerType,
          numberOfLogFiles: state.numberOfLogFiles,
          logFileSizeInBytes: state.logFileSizeInBytes
        },
        request: {
          interval: state.interval,
          timeout: state.timeout
        },
        pingHosts: state.pingHosts
      };
      const options: RequestInit = {
        method: "PUT",
        body: JSON.stringify(config)
      };

      fetch(Path.config, options)
        .then(async response => {
          const data: UpdatingConfig = await response.json();
          if (response.ok && data.isUpdated) {
            resolve();
          } else {
            reject(data.message);
          }
        })
        .catch(e => {
          reject("Не удалось выполнить запрос на обновление настроек");
          console.error(e);
        });
    });
  }
);

export const resetConfigAsync = createAsyncThunk(
  "config/reset",
  (): Promise<Config> => {
    return new Promise((resolve, reject) => {
      const options: RequestInit = {
        method: "DELETE"
      };
      fetch(Path.config, options)
        .then(async response => {
          if (response.ok) {
            const data: Config = await response.json();
            resolve(data);
          } else {
            const data: ConfigError = await response.json();
            reject(data.message);
          }
        })
        .catch(e => {
          reject(
            "Не удалось выполнить запрос на возврат настроек по умолчанию"
          );
          console.error(e);
        });
    });
  }
);

const updateConfigState = (state: ConfigState, payload: ConfigStateBase) => {
  state.port = payload.port;
  state.loggerLevel = payload.loggerLevel;
  state.loggerType = payload.loggerType;
  state.numberOfLogFiles = payload.numberOfLogFiles;
  state.logFileSizeInBytes = payload.logFileSizeInBytes;
  state.interval = payload.interval;
  state.timeout = payload.timeout;
  state.pingHosts = payload.pingHosts;
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfigBase: (state, action: PayloadAction<ConfigStateBase>) => {
      updateConfigState(state, action.payload);
    }
  },
  extraReducers: builder => {
    builder.addCase(updateConfigAsync.fulfilled, state => {
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(getConfigAsync.fulfilled, resetConfigAsync.fulfilled),
      (state, action) => {
        const config = action.payload as Config;
        const configStateBase = {
          port: config.port,
          loggerLevel: config.logger.level,
          loggerType: config.logger.type,
          numberOfLogFiles: config.logger.numberOfLogFiles,
          logFileSizeInBytes: config.logger.logFileSizeInBytes,
          interval: config.request.interval,
          timeout: config.request.timeout,
          pingHosts: config.pingHosts
        };
        updateConfigState(state, configStateBase);
        state.loading = false;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getConfigAsync.pending,
        updateConfigAsync.pending,
        resetConfigAsync.pending
      ),
      state => {
        state.loading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getConfigAsync.rejected,
        updateConfigAsync.rejected,
        resetConfigAsync.rejected
      ),
      (state, action) => {
        const message = action.error.message;
        notification.error({ message });
        state.loading = false;
      }
    );
  }
});

export const { setConfigBase } = configSlice.actions;

export const selectConfigLoading = (state: RootState): boolean =>
  state.config.loading;
export const selectPort = (state: RootState): number => state.config.port;
export const selectLoggerLevel = (state: RootState): LoggerLevel =>
  state.config.loggerLevel;
export const selectLoggerType = (state: RootState): LoggerType =>
  state.config.loggerType;
export const selectNumberOfLogFiles = (state: RootState): number =>
  state.config.numberOfLogFiles;
export const selectLogFileSizeInBytes = (state: RootState): number =>
  state.config.logFileSizeInBytes;
export const selectInterval = (state: RootState): number =>
  state.config.interval;
export const selectTimeout = (state: RootState): number => state.config.timeout;
export const selectPingHosts = (state: RootState): string[] =>
  state.config.pingHosts;

export default configSlice.reducer;
