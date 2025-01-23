import React, { useCallback, useEffect, useRef } from "react";
import AppLayoutComponent from "./app-layout.component";
import { useAppDispatch } from "../../hooks/store.hooks";
import {
  getConfigAsync,
  incrementManualPingTrigger,
  selectAutoPing,
  selectConfigLoading,
  setBaseConfigData,
  updateConfigAsync
} from "../../store/main.slice";
import settingsUtil from "../../utils/settings.util";
import useOpenSettingsContext from "../../contexts/open-settings.context";
import {
  useSchemeFormContext,
  useSettingsFormContext
} from "../../contexts/form.context";
import {
  validateAndChangeHostViewModels,
  getOnlyValidHostViewModels
} from "../../utils/host.util";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const AppLayoutContainer = () => {
  const [modal, contextHolder] = Modal.useModal();
  const { open, setOpen } = useOpenSettingsContext();
  const settingsForm = useSettingsFormContext();
  const schemeForm = useSchemeFormContext();
  const dispatch = useAppDispatch();
  const isInitializedRef = useRef(false);

  const autoPing = useSelector(selectAutoPing);
  const configLoading = useSelector(selectConfigLoading);

  const pingManually = useCallback(
    () => dispatch(incrementManualPingTrigger()),
    [dispatch]
  );

  const toggleOpenMenu = useCallback(
    () => setOpen(prevState => !prevState),
    [setOpen]
  );

  const saveSettings = useCallback(() => {
    const settingsData = settingsForm.data;
    const schemeData = validateAndChangeHostViewModels(schemeForm.data);
    const hasErrors = schemeData !== schemeForm.data;
    const save = () => {
      dispatch(
        setBaseConfigData({
          port: settingsData.port,
          loggerLevel: settingsData.level,
          loggerType: settingsData.type,
          numberOfLogFiles: settingsData.numberOfLogFiles,
          logFileSizeInBytes: settingsUtil.convertToBytes(
            settingsData.logFileSize
          ),
          autoPing: settingsData.autoPing,
          interval: settingsData.interval,
          timeout: settingsData.timeout,
          hostViewModels: hasErrors
            ? getOnlyValidHostViewModels(schemeData)
            : schemeData
        })
      );
      dispatch(updateConfigAsync());
      setOpen(false);
    };

    if (hasErrors) {
      const title = "Продолжить операцию сохранения?";
      const content =
        "В данной конфигурации имеются незаполненные подключения, которые будут автоматически удалены. Вы можете отменить операцию, чтобы проверить какие поля не заполнены.";

      modal.confirm({
        title,
        icon: <ExclamationCircleOutlined />,
        centered: true,
        content,
        okText: "Продолжить",
        cancelText: "Отменить",
        onOk: save
      });

      schemeForm.setData(schemeData);
    } else {
      save();
    }
  }, [settingsForm, schemeForm, dispatch, setOpen, modal]);

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
    <>
      <AppLayoutComponent
        open={open}
        showManualPingBtn={!autoPing && !open && !configLoading}
        isFormsTouched={settingsForm.isTouched || schemeForm.isTouched}
        saveSettings={saveSettings}
        toggleOpenMenu={toggleOpenMenu}
        pingManually={pingManually}
      />
      {contextHolder}
    </>
  );
};

export default AppLayoutContainer;
