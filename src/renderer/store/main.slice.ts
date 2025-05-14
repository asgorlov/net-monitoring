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
import { Config } from "../../shared/models/config.models";
import {
  convertStateToConfig,
  getConfigFromFile,
  updateConfig,
  updateState,
  updateStateByConfig,
} from "../utils/store.util";
import { HostViewModel, uuid } from "../../shared/models/host.models";
import { initializePingHostViewModel } from "../utils/host.util";
import settingsUtil from "../utils/settings.util";

export interface MainStateBase {
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
  isSchemeTouched: boolean;
  isSettingsOpened: boolean;
  isSettingsTouched: boolean;
  manualPingTrigger: number;
  clearLogFilesLoading: boolean;
}

const initialState: MainState = {
  configLoading: false,
  isSchemeTouched: false,
  isSettingsOpened: false,
  isSettingsTouched: false,
  manualPingTrigger: 0,
  clearLogFilesLoading: false,
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
      window.api.getConfig().then((result) => {
        if (result.errorMessage) {
          reject(result.errorMessage);
        } else {
          resolve(result.config);
        }
      });
    });
  },
);

export const updateConfigAsync = createAsyncThunk(
  "config/update",
  (_, { getState }): Promise<void> => {
    return new Promise((resolve, reject) => {
      const { main } = getState() as RootState;
      const config = convertStateToConfig(main);
      updateConfig(config).then(resolve).catch(reject);
    });
  },
);

export const resetConfigAsync = createAsyncThunk(
  "config/reset",
  (): Promise<Config> => {
    return new Promise((resolve, reject) => {
      window.api.createDefaultConfig().then((result) => {
        if (result.errorMessage) {
          reject(result.errorMessage);
        } else {
          resolve(result.config);
        }
      });
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
      window.api.clearLogFiles().then((result) => {
        if (result.errorMessage) {
          reject(result.errorMessage);
        } else {
          resolve();
        }
      });
    });
  },
);

export const mainSlice = createSlice({
  name: "main-slice",
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
    setIsSettingsOpened: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpened = action.payload;
    },
    setIsSettingsTouched: (state, action: PayloadAction<boolean>) => {
      state.isSettingsTouched = action.payload;
    },
    setIsSchemeTouched: (state, action: PayloadAction<boolean>) => {
      state.isSchemeTouched = action.payload;
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
        message: "Конфигурация обновлена.",
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
          message: "Конфигурация обновлена.",
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
  setIsSettingsOpened,
  setIsSettingsTouched,
  setIsSchemeTouched,
} = mainSlice.actions;

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
export const selectIsSettingsOpened = (state: RootState): boolean =>
  state.main.isSettingsOpened;
export const selectIsSettingsTouched = (state: RootState): boolean =>
  state.main.isSettingsTouched;
export const selectIsSchemeTouched = (state: RootState): boolean =>
  state.main.isSchemeTouched;

export default mainSlice.reducer;
