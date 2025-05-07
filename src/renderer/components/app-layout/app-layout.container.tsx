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
  setBaseConfigData,
  updateConfigAsync,
} from "../../store/main.slice";
import settingsUtil from "../../utils/settings.util";
import useOpenSettingsContext from "../../contexts/open-settings.context";
import {
  useSchemeFormContext,
  useSettingsFormContext,
} from "../../contexts/form.context";
import {
  validateAndChangeHostViewModels,
  getOnlyValidHostViewModels,
} from "../../utils/host.util";
import packageJson from "../../../../package.json";

const AppLayoutContainer = () => {
  const [modal, contextHolder] = Modal.useModal();
  const { open, setOpen } = useOpenSettingsContext();
  const settingsForm = useSettingsFormContext();
  const schemeForm = useSchemeFormContext();
  const dispatch = useAppDispatch();
  const isInitializedRef = useRef(false);

  const autoPing = useSelector(selectAutoPing);
  const configLoading = useSelector(selectConfigLoading);

  const pingManually = () => dispatch(incrementManualPingTrigger());

  const toggleOpenMenu = () => {
    setOpen((prevState) => {
      const newState = !prevState;
      if (newState) {
        dispatch(resetManualPingTrigger());
      }

      return newState;
    });
  };

  const saveSettings = () => {
    const settingsData = settingsForm.data;
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
        configLoading={configLoading}
        showManualPingBtn={!autoPing && !open}
        isFormsTouched={settingsForm.isTouched || schemeForm.isTouched}
        saveSettings={saveSettings}
        toggleOpenMenu={toggleOpenMenu}
        pingManually={pingManually}
        onLinkClick={onLinkClick}
      />
      {contextHolder}
    </>
  );
};

export default AppLayoutContainer;
