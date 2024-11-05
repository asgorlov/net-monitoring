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
import useSettingsForms from "../../contexts/settings-forms.context";

const AppLayoutContainer = () => {
  const { settingsForm, schemeForm } = useSettingsForms();
  const { open, setOpen } = useOpenSettingsContext();
  const isInitializedRef = useRef(false);
  const dispatch = useAppDispatch();

  const isFormsTouched =
    settingsForm.isTouched || Object.values(schemeForm).some(s => s.isTouched);

  const toggleOpenMenu = () => setOpen(prevState => !prevState);

  const saveSettings = () => {
    const settingsFormValues = settingsForm.values;
    dispatch(
      setBaseConfigData({
        port: settingsFormValues.port,
        loggerLevel: settingsFormValues.level,
        loggerType: settingsFormValues.type,
        numberOfLogFiles: settingsFormValues.numberOfLogFiles,
        logFileSizeInBytes: settingsUtil.convertToBytes(
          settingsFormValues.logFileSize
        ),
        interval: settingsUtil.convertToMilliseconds(
          settingsFormValues.interval
        ),
        timeout: settingsUtil.convertToMilliseconds(settingsFormValues.timeout),
        pingHosts: [] //toDo: отдельно получать данные от редактирвоания схемы
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
      settingsForm.resetFields();
      Object.values(schemeForm).forEach(s => s.resetFields());
    }
  }, [open, settingsForm, schemeForm]);

  return (
    <AppLayoutComponent
      open={open}
      isFormsTouched={isFormsTouched}
      saveSettings={saveSettings}
      toggleOpenMenu={toggleOpenMenu}
    />
  );
};

export default AppLayoutContainer;
