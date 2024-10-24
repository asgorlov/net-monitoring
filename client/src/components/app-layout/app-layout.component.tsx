import "./app-layout.scss";
import React, { FC } from "react";
import { Button, Layout, theme } from "antd";
import NetScheme from "../net-scheme/net-scheme";
import SettingsMenuContainer from "../settings-menu/settings-menu.container";
import { FormInstance } from "antd/es/form/hooks/useForm";
import { SettingsForm } from "../../models/common.models";
import { DeleteOutlined, MenuOutlined, SaveOutlined } from "@ant-design/icons";
import clsx from "clsx";

export interface AppLayoutComponentProps {
  open: boolean;
  settingsForm: FormInstance<SettingsForm>;
  saveSettings: () => void;
  toggleOpenMenu: () => void;
}

const AppLayoutComponent: FC<AppLayoutComponentProps> = ({
  open,
  settingsForm,
  saveSettings,
  toggleOpenMenu
}) => {
  const { token } = theme.useToken();

  return (
    <Layout className="app-layout">
      <Layout.Header
        style={{
          background: token.colorBgLayout,
          borderColor: token.colorBorder
        }}
        className="app-layout__header"
      >
        <div className="app-layout__header__btns-block">
          <Button size="small" onClick={toggleOpenMenu}>
            <MenuOutlined />
          </Button>
          <div
            className={clsx("app-layout__header__btns-block__settings", {
              _touched: open && settingsForm.isFieldsTouched()
            })}
          >
            <Button
              size="small"
              onClick={toggleOpenMenu}
              disabled={!open || !settingsForm.isFieldsTouched()}
            >
              <DeleteOutlined />
              Отменить
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={saveSettings}
              disabled={!open || !settingsForm.isFieldsTouched()}
            >
              <SaveOutlined />
              Сохранить
            </Button>
          </div>
        </div>
      </Layout.Header>
      <Layout.Content className="app-layout__content">
        <SettingsMenuContainer open={open} form={settingsForm} />
        <NetScheme />
      </Layout.Content>
      <Layout.Footer
        className="app-layout__footer"
        style={{ borderColor: token.colorBorder }}
      >
        Net Monitoring ©{new Date().getFullYear()} Created by{" "}
        <a href="https://github.com/asgorlov" target="_blank">
          asgorlov
        </a>
      </Layout.Footer>
    </Layout>
  );
};

export default AppLayoutComponent;
