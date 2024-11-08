import React, { FC, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  clearLogFilesAsync,
  selectClearLogFilesLoading,
  selectConfigLoading
} from "../../store/main.slice";
import SettingsMenuComponent from "./settings-menu.component";
import useOpenSettingsContext from "../../contexts/open-settings.context";
import { useSettingsFormContext } from "../../contexts/form.context";
import { useAppDispatch } from "../../hooks/store.hooks";

const SettingsMenuContainer: FC = () => {
  const clearLogFilesLoading = useSelector(selectClearLogFilesLoading);
  const configLoading = useSelector(selectConfigLoading);

  const dispatch = useAppDispatch();
  const { open } = useOpenSettingsContext();
  const { data, setData } = useSettingsFormContext();

  const onClickClearLogs = useCallback(
    () => dispatch(clearLogFilesAsync()),
    [dispatch]
  );

  return (
    <SettingsMenuComponent
      open={open}
      configLoading={configLoading}
      formValues={data}
      onChangeFormValues={setData}
      onClickClearLogs={onClickClearLogs}
      clearLogsLoading={clearLogFilesLoading}
    />
  );
};

export default SettingsMenuContainer;
