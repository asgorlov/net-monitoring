import React, { Dispatch, FC, SetStateAction } from "react";
import { Button, Layout, theme } from "antd";
import SettingsMenu from "../settings-menu/settings-menu";
import NetScheme from "../net-scheme/net-scheme";
import "./app-layout.scss";

export interface AppLayoutComponentProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AppLayoutComponent: FC<AppLayoutComponentProps> = ({ open, setOpen }) => {
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
        <Button
          size="small"
          onClick={() => setOpen(prevState => !prevState)}
        ></Button>
      </Layout.Header>
      <Layout.Content className="app-layout__content">
        <SettingsMenu open={open} />
        <NetScheme />
      </Layout.Content>
      <Layout.Footer
        className="app-layout__footer"
        style={{ borderColor: token.colorBorder }}
      >
        Net Monitoring ©{new Date().getFullYear()} Created by asgorlov
      </Layout.Footer>
    </Layout>
  );
};

export default AppLayoutComponent;
