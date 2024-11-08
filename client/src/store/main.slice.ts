import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import { defaultConfig } from "../constants/config.constants";
import { LoggerLevel, LoggerType } from "../constants/logger.constants";
import {
  Config,
  ConfigError,
  UpdatingConfig,
  ClearingLogFiles
} from "../models/common.models";
import Path from "../constants/path.constants";
import { notification } from "antd";
import {
  convertStateToConfig,
  updateState,
  updateStateByConfig
} from "../utils/main.util";
import {
  HostBase,
  HostResponseBody,
  HostStatus,
  HostViewModel,
  uuid
} from "../models/host.models";
import { initializePingHostViewModel } from "../utils/host.util";

export interface MainStateBase {
  port: number;
  loggerLevel: LoggerLevel;
  loggerType: LoggerType;
  numberOfLogFiles: number;
  logFileSizeInBytes: number;
  interval: number;
  timeout: number;
  hostViewModels: Record<uuid, HostViewModel>;
}

export interface MainState extends MainStateBase {
  configLoading: boolean;
  clearLogFilesLoading: boolean;
}

const initialState: MainState = {
  configLoading: false,
  clearLogFilesLoading: false,
  port: defaultConfig.port,
  loggerLevel: defaultConfig.logger.level,
  loggerType: defaultConfig.logger.type,
  numberOfLogFiles: defaultConfig.logger.numberOfLogFiles,
  logFileSizeInBytes: defaultConfig.logger.logFileSizeInBytes,
  interval: defaultConfig.request.interval,
  timeout: defaultConfig.request.timeout,
  hostViewModels: initializePingHostViewModel(defaultConfig.pingHosts)
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
      const { main } = getState() as RootState;
      const options: RequestInit = {
        method: "PUT",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(convertStateToConfig(main))
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

export const clearLogFilesAsync = createAsyncThunk(
  "log/clear",
  (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const options: RequestInit = {
        method: "DELETE"
      };
      fetch(Path.log, options)
        .then(async response => {
          const data: ClearingLogFiles = await response.json();
          if (response.ok && data.isCleared) {
            resolve();
          } else {
            reject(data.message);
          }
        })
        .catch(e => {
          reject("Не удалось выполнить запрос на очистку файлов логирования");
          console.error(e);
        });
    });
  }
);

export const pingAsync = createAsyncThunk(
  "app/ping",
  (hosts: HostBase[]): Promise<HostStatus[]> => {
    return new Promise((resolve, reject) => {
      const options: RequestInit = {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({ hosts })
      };
      fetch(Path.ping, options)
        .then(async response => {
          const data: HostResponseBody = await response.json();
          resolve(data.hostStatuses);
        })
        .catch(e => {
          reject("Не удалось выполнить пинг запрашиваемых адресов");
          console.error(e);
        });
    });
  }
);

export const mainSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setBaseConfigData: (state, action: PayloadAction<MainStateBase>) => {
      updateState(state, action.payload);
    }
  },
  extraReducers: builder => {
    builder.addCase(pingAsync.fulfilled, (state, action) => {
      if (action.payload.length) {
        const newHostViewModels = { ...state.hostViewModels };

        action.payload.forEach(s => {
          const model = newHostViewModels[s.id];
          if (model) {
            const newModel = JSON.parse(JSON.stringify(model));
            newModel.isAlive = s.isAlive;
            newModel.pinging = false;

            newHostViewModels[s.id] = newModel;
          }
        });

        state.hostViewModels = newHostViewModels;
      }
    });

    builder.addCase(pingAsync.pending, (state, action) => {
      if (action.meta.arg.length) {
        const newHostViewModels = { ...state.hostViewModels };

        action.meta.arg.forEach(h => {
          const model = newHostViewModels[h.id];
          if (model) {
            const newModel = JSON.parse(JSON.stringify(model));
            newModel.pinging = true;

            newHostViewModels[h.id] = newModel;
          }
        });

        state.hostViewModels = newHostViewModels;
      }
    });

    builder.addCase(pingAsync.rejected, (state, action) => {
      const newHostViewModels = { ...state.hostViewModels };

      action.meta.arg.forEach(h => {
        const model = newHostViewModels[h.id];
        if (model) {
          const newModel = JSON.parse(JSON.stringify(model));
          newModel.pinging = false;
          newModel.isAlive = newModel.isAlive !== null ? false : null;

          newHostViewModels[h.id] = newModel;
        }
      });

      state.hostViewModels = newHostViewModels;
    });

    builder.addCase(clearLogFilesAsync.fulfilled, state => {
      state.clearLogFilesLoading = false;
    });

    builder.addCase(clearLogFilesAsync.pending, state => {
      state.clearLogFilesLoading = true;
    });

    builder.addCase(clearLogFilesAsync.rejected, (state, action) => {
      const message = action.error.message;
      notification.error({ message });
      state.clearLogFilesLoading = false;
    });

    builder.addCase(updateConfigAsync.fulfilled, state => {
      notification.success({
        message: "Конфигурация обновлена. Требуется перезагрузка приложения."
      });
      state.configLoading = false;
    });

    builder.addMatcher(
      isAnyOf(getConfigAsync.fulfilled, resetConfigAsync.fulfilled),
      (state, action) => {
        const config = action.payload as Config;
        updateStateByConfig(state, config);
        state.configLoading = false;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getConfigAsync.pending,
        updateConfigAsync.pending,
        resetConfigAsync.pending
      ),
      state => {
        state.configLoading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getConfigAsync.rejected,
        updateConfigAsync.rejected,
        resetConfigAsync.rejected
      ),
      (state, action) => {
        const stack = action.error.stack;
        if (stack) {
          console.error(stack);
        }
        const message = action.error.message;
        notification.error({ message });
        state.configLoading = false;
      }
    );
  }
});

export const { setBaseConfigData } = mainSlice.actions;

export const selectPort = (state: RootState): number => state.main.port;
export const selectLoggerLevel = (state: RootState): LoggerLevel =>
  state.main.loggerLevel;
export const selectLoggerType = (state: RootState): LoggerType =>
  state.main.loggerType;
export const selectNumberOfLogFiles = (state: RootState): number =>
  state.main.numberOfLogFiles;
export const selectLogFileSizeInBytes = (state: RootState): number =>
  state.main.logFileSizeInBytes;
export const selectInterval = (state: RootState): number => state.main.interval;
export const selectTimeout = (state: RootState): number => state.main.timeout;
export const selectHostViewModels = (
  state: RootState
): Record<uuid, HostViewModel> => state.main.hostViewModels;
export const selectConfigLoading = (state: RootState): boolean =>
  state.main.configLoading;
export const selectClearLogFilesLoading = (state: RootState): boolean =>
  state.main.clearLogFilesLoading;

export default mainSlice.reducer;
