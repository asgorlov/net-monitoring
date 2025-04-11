import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import { notification } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { RootState } from "./store";
import {
  defaultConfig,
  CONFIG_FILE_NAME,
  CONFIG_FILE_TYPE,
} from "../../shared/constants/config.constants";
import {
  LoggerLevel,
  LoggerType,
} from "../../shared/constants/logger.constants";
import { Config, ClearingLogFiles } from "../../shared/models/config.models";
import Path from "../constants/path.constants";
import {
  convertStateToConfig,
  getConfigFromFile,
  updateConfig,
  updateState,
  updateStateByConfig,
} from "../utils/main.util";
import { HostViewModel, uuid } from "../../shared/models/host.models";
import { initializePingHostViewModel } from "../utils/host.util";
import settingsUtil from "../utils/settings.util";

export interface MainStateBase {
  port: number;
  loggerLevel: LoggerLevel;
  loggerType: LoggerType;
  numberOfLogFiles: number;
  logFileSizeInBytes: number;
  autoPing: boolean;
  interval: number;
  timeout: number;
  hostViewModels: Record<uuid, HostViewModel>;
}

export interface MainState extends MainStateBase {
  configLoading: boolean;
  manualPingTrigger: number;
  clearLogFilesLoading: boolean;
}

const initialState: MainState = {
  configLoading: false,
  manualPingTrigger: 0,
  clearLogFilesLoading: false,
  port: defaultConfig.port,
  loggerLevel: defaultConfig.logger.level,
  loggerType: defaultConfig.logger.type,
  numberOfLogFiles: defaultConfig.logger.numberOfLogFiles,
  logFileSizeInBytes: defaultConfig.logger.logFileSizeInBytes,
  autoPing: defaultConfig.request.autoPing,
  interval: defaultConfig.request.interval,
  timeout: defaultConfig.request.timeout,
  hostViewModels: initializePingHostViewModel(defaultConfig.pingHosts),
};

export const getConfigAsync = createAsyncThunk(
  "config/get",
  (): Promise<Config> => {
    return new Promise((resolve, reject) => {
      // toDo: Исправить логику
      // fetch(Path.config)
      //   .then(async (response) => {
      //     if (response.ok) {
      //       const data: Config = await response.json();
      //       resolve(data);
      //     } else {
      //       const data: ConfigError = await response.json();
      //       reject(data.message);
      //     }
      //   })
      //   .catch((e) => {
      //     reject("Не удалось выполнить запрос на получение настроек");
      //     console.error(e);
      //   });
      resolve(defaultConfig);
    });
  },
);

export const updateConfigAsync = createAsyncThunk(
  "config/update",
  (_, { getState }): Promise<void> => {
    return new Promise((resolve, reject) => {
      // toDo: Исправить логику
      // const { main } = getState() as RootState;
      // const config = convertStateToConfig(main);
      // updateConfig(config).then(resolve).catch(reject);
      resolve();
    });
  },
);

export const resetConfigAsync = createAsyncThunk(
  "config/reset",
  (): Promise<Config> => {
    return new Promise((resolve, reject) => {
      // toDo: Исправить логику
      // const options: RequestInit = {
      //   method: "DELETE",
      // };
      // fetch(Path.config, options)
      //   .then(async (response) => {
      //     if (response.ok) {
      //       const data: Config = await response.json();
      //       resolve(data);
      //     } else {
      //       const data: ConfigError = await response.json();
      //       reject(data.message);
      //     }
      //   })
      //   .catch((e) => {
      //     reject(
      //       "Не удалось выполнить запрос на возврат настроек по умолчанию",
      //     );
      //     console.error(e);
      //   });
      resolve(defaultConfig);
    });
  },
);

export const importConfigAsync = createAsyncThunk(
  "config/import",
  async (file: UploadFile): Promise<Config> => {
    const config = await getConfigFromFile(file);
    await updateConfig(config);

    return config;
  },
);

export const exportConfigAsync = createAsyncThunk(
  "config/export",
  (_, { getState }) => {
    const { main } = getState() as RootState;
    settingsUtil.downloadFile(
      JSON.stringify(convertStateToConfig(main), null, 4),
      CONFIG_FILE_NAME,
      CONFIG_FILE_TYPE,
    );
  },
);

export const clearLogFilesAsync = createAsyncThunk(
  "log/clear",
  (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // toDo: Исправить логику
      // const options: RequestInit = {
      //   method: "DELETE",
      // };
      // fetch(Path.log, options)
      //   .then(async (response) => {
      //     const data: ClearingLogFiles = await response.json();
      //     if (response.ok && data.isCleared) {
      //       resolve();
      //     } else {
      //       reject(data.message);
      //     }
      //   })
      //   .catch((e) => {
      //     reject("Не удалось выполнить запрос на очистку файлов логирования");
      //     console.error(e);
      //   });
      resolve();
    });
  },
);

export const mainSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setBaseConfigData: (state, action: PayloadAction<MainStateBase>) => {
      updateState(state, action.payload);
    },
    resetManualPingTrigger: (state) => {
      state.manualPingTrigger = 0;
    },
    incrementManualPingTrigger: (state) => {
      state.manualPingTrigger++;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearLogFilesAsync.fulfilled, (state) => {
      notification.success({
        message: "Папка с файлами логирования очищена",
      });
      state.clearLogFilesLoading = false;
    });

    builder.addCase(clearLogFilesAsync.pending, (state) => {
      state.clearLogFilesLoading = true;
    });

    builder.addCase(clearLogFilesAsync.rejected, (state, action) => {
      const message = action.error.message;
      notification.error({ message });
      state.clearLogFilesLoading = false;
    });

    builder.addCase(updateConfigAsync.fulfilled, (state) => {
      notification.success({
        message:
          "Конфигурация обновлена. Для корректной работы приложения требуется перезагрузка",
      });
      state.configLoading = false;
    });

    builder.addCase(getConfigAsync.fulfilled, (state, action) => {
      const config = action.payload as Config;
      updateStateByConfig(state, config);
      state.configLoading = false;
    });

    builder.addMatcher(
      isAnyOf(importConfigAsync.fulfilled, resetConfigAsync.fulfilled),
      (state, action) => {
        const config = action.payload as Config;
        updateStateByConfig(state, config);
        notification.success({
          message:
            "Конфигурация обновлена. Для корректной работы приложения требуется перезагрузка",
        });
        state.configLoading = false;
      },
    );

    builder.addMatcher(
      isAnyOf(
        getConfigAsync.pending,
        updateConfigAsync.pending,
        importConfigAsync.pending,
        resetConfigAsync.pending,
      ),
      (state) => {
        state.configLoading = true;
      },
    );

    builder.addMatcher(
      isAnyOf(
        getConfigAsync.rejected,
        updateConfigAsync.rejected,
        importConfigAsync.rejected,
        resetConfigAsync.rejected,
      ),
      (state, action) => {
        const stack = action.error.stack;
        if (stack) {
          console.error(stack);
        }
        const message = action.error.message;
        notification.error({ message });
        state.configLoading = false;
      },
    );
  },
});

export const {
  setBaseConfigData,
  resetManualPingTrigger,
  incrementManualPingTrigger,
} = mainSlice.actions;

export const selectPort = (state: RootState): number => state.main.port;
export const selectLoggerLevel = (state: RootState): LoggerLevel =>
  state.main.loggerLevel;
export const selectLoggerType = (state: RootState): LoggerType =>
  state.main.loggerType;
export const selectNumberOfLogFiles = (state: RootState): number =>
  state.main.numberOfLogFiles;
export const selectLogFileSizeInBytes = (state: RootState): number =>
  state.main.logFileSizeInBytes;
export const selectAutoPing = (state: RootState): boolean =>
  state.main.autoPing;
export const selectInterval = (state: RootState): number => state.main.interval;
export const selectTimeout = (state: RootState): number => state.main.timeout;
export const selectHostViewModels = (
  state: RootState,
): Record<uuid, HostViewModel> => state.main.hostViewModels;
export const selectConfigLoading = (state: RootState): boolean =>
  state.main.configLoading;
export const selectManualPingTrigger = (state: RootState): number =>
  state.main.manualPingTrigger;
export const selectClearLogFilesLoading = (state: RootState): boolean =>
  state.main.clearLogFilesLoading;

export default mainSlice.reducer;
