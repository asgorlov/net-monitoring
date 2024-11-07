import React, { useCallback, useEffect, useRef } from "react";
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
import { getValidHostViewModels } from "../../utils/host.util";

const AppLayoutContainer = () => {
  const { open, setOpen } = useOpenSettingsContext();
  const settingsForm = useSettingsFormContext();
  const schemeForm = useSchemeFormContext();
  const dispatch = useAppDispatch();
  const isInitializedRef = useRef(false);

  const toggleOpenMenu = useCallback(
    () => setOpen(prevState => !prevState),
    [setOpen]
  );

  const isInvalidSettings = useCallback((): boolean => {
    return schemeForm.validateData();
  }, [schemeForm]);

  const saveSettings = useCallback(
    (hasErrors: boolean = false) => {
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
          hostViewModels: hasErrors
            ? getValidHostViewModels(schemeData)
            : schemeData
        })
      );
      dispatch(updateConfigAsync());
      setOpen(false);
    },
    [settingsForm, schemeForm, dispatch, setOpen]
  );

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
      isInvalidSettings={isInvalidSettings}
      isFormsTouched={settingsForm.isTouched || schemeForm.isTouched}
      saveSettings={saveSettings}
      toggleOpenMenu={toggleOpenMenu}
    />
  );
};

export default AppLayoutContainer;
