import React, { useCallback, useEffect, useRef } from "react";
import AppLayoutComponent from "./app-layout.component";
import { useAppDispatch } from "../../../../.backup/client/src/hooks/store.hooks";
import {
  getConfigAsync,
  incrementManualPingTrigger,
  resetManualPingTrigger,
  selectAutoPing,
  selectConfigLoading,
  setBaseConfigData,
  updateConfigAsync
} from "../../../../.backup/client/src/store/main.slice";
import settingsUtil from "../../../../.backup/client/src/utils/settings.util";
import useOpenSettingsContext from "../../../../.backup/client/src/contexts/open-settings.context";
import {
  useSchemeFormContext,
  useSettingsFormContext
} from "../../../../.backup/client/src/contexts/form.context";
import {
  validateAndChangeHostViewModels,
  getOnlyValidHostViewModels
} from "../../../../.backup/client/src/utils/host.util";
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
    () =>
      setOpen(prevState => {
        const newState = !prevState;
        if (newState) {
          dispatch(resetManualPingTrigger());
        }

        return newState;
      }),
    [setOpen, dispatch]
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
        configLoading={configLoading}
        showManualPingBtn={!autoPing && !open}
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
