import React, { useEffect, useRef, useState } from "react";
import AppLayoutComponent from "./app-layout.component";
import { useAppDispatch } from "../../hooks/store.hooks";
import {
  getConfigAsync,
  setBaseConfigData,
  updateConfigAsync
} from "../../store/main.slice";
import { Form } from "antd";
import { SettingsForm } from "../../models/common.models";
import settingsUtil from "../../utils/settings.util";

const AppLayoutContainer = () => {
  const isInitializedRef = useRef(false);
  const dispatch = useAppDispatch();
  const [settingsForm] = Form.useForm<SettingsForm>();
  const settingsFormValues = Form.useWatch([], settingsForm);

  const [open, setOpen] = useState(false);

  const toggleOpenMenu = () => setOpen(prevState => !prevState);

  const saveSettings = () => {
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
    } else {
      settingsForm.resetFields();
    }
  }, [open, settingsForm, dispatch]);

  return (
    <AppLayoutComponent
      open={open}
      settingsForm={settingsForm}
      saveSettings={saveSettings}
      toggleOpenMenu={toggleOpenMenu}
    />
  );
};

export default AppLayoutContainer;
