import React, { FC, useCallback } from "react";
import { useSelector } from "react-redux";
import { notification } from "antd";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
} from "antd/es/upload/interface";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import {
  clearLogFilesAsync,
  exportConfigAsync,
  importConfigAsync,
  resetConfigAsync,
  resetManualPingTrigger,
  selectClearLogFilesLoading,
  selectConfigLoading,
  selectIsSettingsOpened,
} from "../../store/main.slice";
import SettingsMenuComponent from "./settings-menu.component";
import { useSettingsFormContext } from "../../contexts/form.context";
import { useAppDispatch } from "../../hooks/store.hooks";
import { DONE_STATUS, ERROR_STATUS } from "../../constants/common.constants";
import { CONFIG_FILE_TYPE } from "../../../shared/constants/config.constants";
import Logger from "../../utils/renderer-logger.utils";

const SettingsMenuContainer: FC = () => {
  const clearLogFilesLoading = useSelector(selectClearLogFilesLoading);
  const configLoading = useSelector(selectConfigLoading);
  const open = useSelector(selectIsSettingsOpened);

  const dispatch = useAppDispatch();
  const { data, setData } = useSettingsFormContext();

  const onClickClearLogs = useCallback(
    () => dispatch(clearLogFilesAsync()),
    [dispatch],
  );

  const resetPingTrigger = useCallback(
    (autoPing: boolean) => {
      if (autoPing) {
        dispatch(resetManualPingTrigger());
      }
    },
    [dispatch],
  );

  const validateUploading = useCallback(
    async (options: RcCustomRequestOptions): Promise<void> => {
      const file = options.file as RcFile;

      let error = "";
      if (file.type !== CONFIG_FILE_TYPE) {
        error = "Неверный формат файла настроек";
      }

      if (error) {
        options.onError?.(new Error(error));
      } else {
        options.onSuccess?.(file);
      }
    },
    [],
  );

  const importConfig = useCallback(
    (info: UploadChangeParam) => {
      const file = info.file as UploadFile;

      if (file.status === DONE_STATUS) {
        dispatch(importConfigAsync(file));
      } else if (file.status === ERROR_STATUS) {
        notification.error({
          message: "Не удалось загрузить файл конфигурации",
        });
        Logger.error(file.error);
      }
    },
    [dispatch],
  );

  const exportConfig = useCallback(
    () => dispatch(exportConfigAsync()),
    [dispatch],
  );

  const resetConfig = useCallback(() => {
    dispatch(resetConfigAsync());
  }, [dispatch]);

  return (
    <SettingsMenuComponent
      open={open}
      configLoading={configLoading}
      formValues={data}
      onChangeFormValues={setData}
      resetPingTrigger={resetPingTrigger}
      onClickClearLogs={onClickClearLogs}
      validateUploading={validateUploading}
      importConfig={importConfig}
      exportConfig={exportConfig}
      resetConfig={resetConfig}
      clearLogsLoading={clearLogFilesLoading}
    />
  );
};

export default SettingsMenuContainer;
