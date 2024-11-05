import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
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
import useOpenSettingsContext from "../../contexts/open-settings.context";
import useSettingsForms from "../../contexts/settings-forms.context";
import settingsUtil from "../../utils/settings.util";
import { SettingsForm } from "../../models/settings-form.models";

const SettingsMenuContainer: FC = () => {
  const port = useSelector(selectPort);
  const timeout = useSelector(selectTimeout);
  const interval = useSelector(selectInterval);
  const loggerType = useSelector(selectLoggerType);
  const loggerLevel = useSelector(selectLoggerLevel);
  const configLoading = useSelector(selectConfigLoading);
  const numberOfLogFiles = useSelector(selectNumberOfLogFiles);
  const logFileSizeInBytes = useSelector(selectLogFileSizeInBytes);

  const { setSettingsForm } = useSettingsForms();
  const { open } = useOpenSettingsContext();
  const isFieldsTouchedRef = useRef(false);
  const initialFormValues = useMemo(
    () => ({
      port,
      level: loggerLevel,
      type: loggerType,
      numberOfLogFiles,
      logFileSize: settingsUtil.convertToMb(logFileSizeInBytes),
      interval: settingsUtil.convertToSeconds(interval),
      timeout: settingsUtil.convertToSeconds(timeout)
    }),
    [
      port,
      loggerLevel,
      loggerType,
      numberOfLogFiles,
      logFileSizeInBytes,
      interval,
      timeout
    ]
  );
  const [formValues, setFormValues] = useState<SettingsForm>(initialFormValues);

  const changeFormValues = useCallback(
    (values: SettingsForm) => {
      isFieldsTouchedRef.current = true;
      setFormValues(values);
    },
    [isFieldsTouchedRef]
  );

  const resetFormValues = useCallback(() => {
    isFieldsTouchedRef.current = false;
    setFormValues(initialFormValues);
  }, [isFieldsTouchedRef, initialFormValues]);

  useEffect(() => {
    if (!configLoading) {
      setFormValues(initialFormValues);
    }
  }, [configLoading, initialFormValues]);

  useEffect(() => {
    setSettingsForm({
      values: formValues,
      isTouched: isFieldsTouchedRef.current,
      resetFields: resetFormValues
    });
  }, [setSettingsForm, formValues, isFieldsTouchedRef, resetFormValues]);

  return (
    <SettingsMenuComponent
      open={open}
      configLoading={configLoading}
      formValues={formValues}
      onChangeFormValues={changeFormValues}
    />
  );
};

export default SettingsMenuContainer;
