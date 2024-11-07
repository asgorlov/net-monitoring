import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { SettingsForm } from "../models/settings-form.models";
import { HostViewModel, uuid } from "../models/host.models";
import { defaultConfig } from "../constants/config.constants";
import { useSelector } from "react-redux";
import {
  selectHostViewModels,
  selectInterval,
  selectLogFileSizeInBytes,
  selectLoggerLevel,
  selectLoggerType,
  selectNumberOfLogFiles,
  selectPort,
  selectTimeout
} from "../store/main.slice";
import settingsUtil from "../utils/settings.util";
import { HostFieldError, SchemeFormAction } from "../constants/form.constants";
import {
  addHostViewModel,
  modifyHostViewModel,
  removeHostViewModel
} from "../utils/host.util";

export interface SettingsFormInstance {
  data: SettingsForm;
  setData: (data: SettingsForm) => void;
  resetData: () => void;
  isTouched: boolean;
}

const SettingsFormContext = createContext<SettingsFormInstance>({
  data: {
    port: defaultConfig.port,
    level: defaultConfig.logger.level,
    type: defaultConfig.logger.type,
    numberOfLogFiles: defaultConfig.logger.numberOfLogFiles,
    logFileSize: defaultConfig.logger.logFileSizeInBytes,
    interval: defaultConfig.request.interval,
    timeout: defaultConfig.request.timeout
  },
  setData: () => {},
  resetData: () => {},
  isTouched: false
});

export interface SchemeFormInstance {
  data: Record<uuid, HostViewModel>;
  validateData: () => boolean;
  setField: (model: HostViewModel, action?: SchemeFormAction) => void;
  resetData: () => void;
  isTouched: boolean;
}

const SchemeFormContext = createContext<SchemeFormInstance>({
  data: {},
  validateData: () => true,
  setField: () => {},
  resetData: () => {},
  isTouched: false
});

export const FormsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const port = useSelector(selectPort);
  const timeout = useSelector(selectTimeout);
  const interval = useSelector(selectInterval);
  const loggerType = useSelector(selectLoggerType);
  const loggerLevel = useSelector(selectLoggerLevel);
  const numberOfLogFiles = useSelector(selectNumberOfLogFiles);
  const logFileSizeInBytes = useSelector(selectLogFileSizeInBytes);
  const initialSettings = useMemo(
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
  const initialScheme = useSelector(selectHostViewModels);

  const [settings, setSettings] = useState(initialSettings);
  const [scheme, setScheme] = useState(initialScheme);

  const isSettingsTouched = useRef(false);
  const isSchemeTouched = useRef(false);

  const changeSettings = useCallback((v: SettingsForm) => {
    isSettingsTouched.current = true;
    setSettings(v);
  }, []);

  const resetSettings = useCallback(() => {
    isSettingsTouched.current = false;
    setSettings(initialSettings);
  }, [initialSettings]);

  const validateScheme = useCallback(() => {
    const schemeFormErrors: Record<uuid, HostFieldError[]> = {};

    Object.values(scheme).forEach(m => {
      const errors: HostFieldError[] = [];

      if (!m.name) {
        errors.push(HostFieldError.NAME);
      }

      if (!m.host) {
        errors.push(HostFieldError.HOST);
      }

      if (errors.length) {
        schemeFormErrors[m.id] = errors;
      }
    });

    const resultEntries = Object.entries(schemeFormErrors);
    const hasErrors = resultEntries.length > 0;
    if (hasErrors) {
      const newScheme = { ...scheme };
      resultEntries.forEach(
        ([id, errors]) => (newScheme[id] = { ...newScheme[id], errors })
      );
      setScheme(newScheme);
    }

    return hasErrors;
  }, [scheme]);

  const changeScheme = useCallback(
    (
      value: HostViewModel,
      action: SchemeFormAction = SchemeFormAction.MODIFY
    ) => {
      const newScheme = { ...scheme };
      switch (action) {
        case SchemeFormAction.MODIFY:
          modifyHostViewModel(newScheme, value);
          break;
        case SchemeFormAction.ADD:
          addHostViewModel(newScheme, value);
          break;
        case SchemeFormAction.REMOVE:
          removeHostViewModel(newScheme, value);
          break;
        default:
          return;
      }

      isSchemeTouched.current = true;
      setScheme(newScheme);
    },
    [scheme]
  );

  const resetScheme = useCallback(() => {
    isSchemeTouched.current = false;
    setScheme(initialScheme);
  }, [initialScheme]);

  useEffect(() => setSettings(initialSettings), [initialSettings]);

  useEffect(() => setScheme(initialScheme), [initialScheme]);

  return (
    <SettingsFormContext.Provider
      value={{
        data: settings,
        setData: changeSettings,
        resetData: resetSettings,
        isTouched: isSettingsTouched.current
      }}
    >
      <SchemeFormContext.Provider
        value={{
          data: scheme,
          validateData: validateScheme,
          setField: changeScheme,
          resetData: resetScheme,
          isTouched: isSchemeTouched.current
        }}
      >
        {children}
      </SchemeFormContext.Provider>
    </SettingsFormContext.Provider>
  );
};

export const useSettingsFormContext = (): SettingsFormInstance =>
  useContext(SettingsFormContext);

export const useSchemeFormContext = (): SchemeFormInstance =>
  useContext(SchemeFormContext);
