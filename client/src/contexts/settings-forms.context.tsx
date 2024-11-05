import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState
} from "react";
import { PingHost, uuid } from "../models/common.models";
import { NamePath } from "rc-field-form/es/interface";
import { defaultConfig } from "../constants/config.constants";
import { SettingsForm } from "../models/settings-form.models";

export interface FormContext<T> {
  values: T;
  isTouched: boolean;
  resetFields: (fields?: NamePath<T>[]) => void;
}

export interface SettingsFormsContextModel {
  settingsForm: FormContext<SettingsForm>;
  setSettingsForm: (value: FormContext<SettingsForm>) => void;
  schemeForm: Record<uuid, FormContext<PingHost>>;
  setSchemeForm: (hostId: uuid, value: FormContext<PingHost>) => void;
}

const initialSettings: FormContext<SettingsForm> = {
  values: {
    port: defaultConfig.port,
    level: defaultConfig.logger.level,
    type: defaultConfig.logger.type,
    numberOfLogFiles: defaultConfig.logger.numberOfLogFiles,
    logFileSize: defaultConfig.logger.logFileSizeInBytes,
    interval: defaultConfig.request.interval,
    timeout: defaultConfig.request.timeout
  },
  isTouched: false,
  resetFields: () => {}
};

const initialScheme: Record<uuid, FormContext<PingHost>> = {};

const SettingsFormsContext = createContext<SettingsFormsContextModel>({
  settingsForm: initialSettings,
  setSettingsForm: () => {},
  schemeForm: initialScheme,
  setSchemeForm: () => {}
});

export const SettingsFormsContextProvider: FC<PropsWithChildren> = ({
  children
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [scheme, setScheme] = useState(initialScheme);

  const setPartOfScheme = useCallback(
    (id: uuid, value: FormContext<PingHost>) => {
      setScheme(prevState => ({ ...prevState, [id]: value }));
    },
    []
  );

  return (
    <SettingsFormsContext.Provider
      value={{
        settingsForm: settings,
        setSettingsForm: setSettings,
        schemeForm: scheme,
        setSchemeForm: setPartOfScheme
      }}
    >
      {children}
    </SettingsFormsContext.Provider>
  );
};

const useSettingsForms = (): SettingsFormsContextModel =>
  useContext(SettingsFormsContext);

export default useSettingsForms;
