import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import AppLayoutComponent from "./app-layout.component";
import { useAppDispatch } from "../../hooks/store.hooks";
import {
  getConfigAsync,
  incrementManualPingTrigger,
  resetManualPingTrigger,
  selectAutoPing,
  selectConfigLoading,
  selectIsSchemeTouched,
  selectIsSettingsOpened,
  selectIsSettingsTouched,
  setBaseConfigData,
  setIsSettingsOpened,
  updateConfigAsync,
} from "../../store/main.slice";
import settingsUtil from "../../utils/settings.util";
import {
  validateAndChangeHostViewModels,
  getOnlyValidHostViewModels,
} from "../../utils/host.util";
import packageJson from "../../../../package.json";
import { SchemeForm, SettingsForm } from "../../models/settings.models";

const AppLayoutContainer = () => {
  const [modal, contextHolder] = Modal.useModal();
  const dispatch = useAppDispatch();
  const settingsFormRef = useRef<SettingsForm>();
  const schemeFormRef = useRef<SchemeForm>();

  const open = useSelector(selectIsSettingsOpened);
  const autoPing = useSelector(selectAutoPing);
  const configLoading = useSelector(selectConfigLoading);
  const isSchemeTouched = useSelector(selectIsSchemeTouched);
  const isSettingsTouched = useSelector(selectIsSettingsTouched);

  const setSettingsForm = (form: SettingsForm) => {
    settingsFormRef.current = form;
  };

  const setSchemeForm = (form: SchemeForm) => {
    schemeFormRef.current = form;
  };

  const pingManually = () => dispatch(incrementManualPingTrigger());

  const toggleOpenMenu = () => {
    const newValue = !open;
    if (newValue) {
      dispatch(resetManualPingTrigger());
    }

    dispatch(setIsSettingsOpened(newValue));
  };

  const saveSettings = () => {
    const settingsData = settingsFormRef.current.data;
    const schemeForm = schemeFormRef.current;
    const schemeData = validateAndChangeHostViewModels(schemeForm.data);
    const hasErrors = schemeData !== schemeForm.data;
    const save = () => {
      dispatch(
        setBaseConfigData({
          loggerLevel: settingsData.level,
          loggerType: settingsData.type,
          numberOfLogFiles: settingsData.numberOfLogFiles,
          logFileSizeInBytes: settingsUtil.convertToBytes(
            settingsData.logFileSize,
          ),
          autoPing: settingsData.autoPing,
          interval: settingsData.interval,
          timeout: settingsData.timeout,
          hostViewModels: hasErrors
            ? getOnlyValidHostViewModels(schemeData)
            : schemeData,
        }),
      );
      dispatch(updateConfigAsync());
      dispatch(setIsSettingsOpened(false));
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
        onOk: save,
      });
      schemeForm.setData(schemeData);
    } else {
      save();
    }
  };

  const onLinkClick = () => {
    window.api.openTab(packageJson.author.url).catch(() => {
      notification.error({
        message: `Не удалось открыть ссылку: ${packageJson.author.url}`,
      });
    });
  };

  useEffect(() => {
    dispatch(getConfigAsync());
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      dispatch(getConfigAsync());
    }
  }, [open, dispatch]);

  return (
    <>
      <AppLayoutComponent
        open={open}
        configLoading={configLoading}
        showManualPingBtn={!autoPing && !open}
        isFormsTouched={isSettingsTouched || isSchemeTouched}
        saveSettings={saveSettings}
        toggleOpenMenu={toggleOpenMenu}
        pingManually={pingManually}
        onLinkClick={onLinkClick}
        setSettingsForm={setSettingsForm}
        setSchemeForm={setSchemeForm}
      />
      {contextHolder}
    </>
  );
};

export default AppLayoutContainer;
