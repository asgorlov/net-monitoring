import React, { FC } from "react";
import { useSelector } from "react-redux";
import {
  selectConfigLoading,
  selectInterval,
  selectLogFileSizeInBytes,
  selectLoggerLevel,
  selectLoggerType,
  selectNumberOfLogFiles,
  selectPort,
  selectTimeout
} from "../../store/main.slice";
import SettingsMenuComponent from "./settings-menu.component";
import { FormInstance } from "antd/es/form/hooks/useForm";
import { SettingsForm } from "../../models/common.models";
import useOpenSettingsContext from "../../contexts/open-settings.context";

export interface SettingsMenuContainerProps {
  form: FormInstance<SettingsForm>;
}

const SettingsMenuContainer: FC<SettingsMenuContainerProps> = ({ form }) => {
  const { open } = useOpenSettingsContext();
  const port = useSelector(selectPort);
  const timeout = useSelector(selectTimeout);
  const interval = useSelector(selectInterval);
  const loggerType = useSelector(selectLoggerType);
  const loggerLevel = useSelector(selectLoggerLevel);
  const configLoading = useSelector(selectConfigLoading);
  const numberOfLogFiles = useSelector(selectNumberOfLogFiles);
  const logFileSizeInBytes = useSelector(selectLogFileSizeInBytes);

  return (
    <SettingsMenuComponent
      port={port}
      timeout={timeout}
      interval={interval}
      loggerType={loggerType}
      loggerLevel={loggerLevel}
      configLoading={configLoading}
      numberOfLogFiles={numberOfLogFiles}
      logFileSizeInBytes={logFileSizeInBytes}
      open={open}
      form={form}
    />
  );
};

export default SettingsMenuContainer;
