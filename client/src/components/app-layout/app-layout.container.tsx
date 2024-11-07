import React, { useEffect, useRef } from "react";
import AppLayoutComponent from "./app-layout.component";
import { useAppDispatch } from "../../hooks/store.hooks";
import {
  getConfigAsync,
  setBaseConfigData,
  updateConfigAsync
} from "../../store/main.slice";
import settingsUtil from "../../utils/settings.util";
import useOpenSettingsContext from "../../contexts/open-settings.context";
import {
  useSchemeFormContext,
  useSettingsFormContext
} from "../../contexts/form.context";

const AppLayoutContainer = () => {
  const { open, setOpen } = useOpenSettingsContext();
  const settingsForm = useSettingsFormContext();
  const schemeForm = useSchemeFormContext();
  const dispatch = useAppDispatch();
  const isInitializedRef = useRef(false);

  const toggleOpenMenu = () => setOpen(prevState => !prevState);

  const saveSettings = () => {
    const settingsData = settingsForm.data;
    const schemeData = schemeForm.data;
    dispatch(
      setBaseConfigData({
        port: settingsData.port,
        loggerLevel: settingsData.level,
        loggerType: settingsData.type,
        numberOfLogFiles: settingsData.numberOfLogFiles,
        logFileSizeInBytes: settingsUtil.convertToBytes(
          settingsData.logFileSize
        ),
        interval: settingsUtil.convertToMilliseconds(settingsData.interval),
        timeout: settingsUtil.convertToMilliseconds(settingsData.timeout),
        hostViewModels: schemeData // toDo: добавить валидацию для пустых полей (имя, хост) с подсветкой красным
      })
    );
    dispatch(updateConfigAsync());
    toggleOpenMenu();
  };

  useEffect(() => {
    if (open || !isInitializedRef.current) {
      dispatch(getConfigAsync());
      isInitializedRef.current = true;
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) {
      settingsForm.resetData();
      schemeForm.resetData();
    }
  }, [open, settingsForm, schemeForm]);

  return (
    <AppLayoutComponent
      open={open}
      isFormsTouched={settingsForm.isTouched || schemeForm.isTouched}
      saveSettings={saveSettings}
      toggleOpenMenu={toggleOpenMenu}
    />
  );
};

export default AppLayoutContainer;
