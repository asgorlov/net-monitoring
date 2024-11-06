import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { useSelector } from "react-redux";
import { selectConfigLoading } from "../../../store/main.slice";
import useSettingsForms from "../../../contexts/settings-forms.context";
import useOpenSettingsContext from "../../../contexts/open-settings.context";
import NetSchemeHostComponent from "./net-scheme-host.component";
import { PingHost } from "../../../models/host.models";

export interface NetSchemeHostContainerProps {
  pingHost: PingHost;
  addHost: () => void;
  removeHost: () => void;
}

const NetSchemeHostContainer = forwardRef<
  HTMLDivElement,
  NetSchemeHostContainerProps
>(({ pingHost, addHost, removeHost }, ref) => {
  const configLoading = useSelector(selectConfigLoading);

  const { open } = useOpenSettingsContext();
  const { setSchemeForm } = useSettingsForms();
  const isHostFormTouchedRef = useRef(false);
  const [formValue, setFormValue] = useState(pingHost);

  const changeFormValue = useCallback((values: PingHost) => {
    isHostFormTouchedRef.current = true;
    setFormValue(values);
  }, []);

  const resetFormValue = useCallback(() => {
    isHostFormTouchedRef.current = false;
    setFormValue(pingHost);
  }, [pingHost]);

  const handleAddHost = useCallback(() => {
    isHostFormTouchedRef.current = true;
    addHost();
  }, [addHost]);

  const handleRemoveHost = useCallback(() => {
    isHostFormTouchedRef.current = true;
    removeHost();
    // toDo: нужно переносить логику с формой в item(на компонент выше) здесь оставить только компонент, контейнер не нужен
  }, [removeHost]);

  useEffect(() => {
    if (!configLoading) {
      setFormValue(pingHost);
    }
  }, [configLoading, pingHost]);

  useEffect(() => {
    setSchemeForm(formValue.id, {
      values: formValue,
      isTouched: isHostFormTouchedRef.current,
      resetFields: resetFormValue
    });
  }, [setSchemeForm, resetFormValue, formValue]);

  return (
    <NetSchemeHostComponent
      ref={ref}
      configLoading={configLoading}
      isEditable={open}
      pinging={false}
      isAlive={null}
      formValue={formValue}
      onFormValueChange={changeFormValue}
      onAddHost={handleAddHost}
      onRemoveHost={handleRemoveHost}
    />
  );
});

export default memo(NetSchemeHostContainer);
