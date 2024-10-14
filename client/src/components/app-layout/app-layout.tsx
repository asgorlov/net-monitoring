import React, { FC, useState } from "react";
import { Button, Layout, theme } from "antd";
import "./app-layout.scss";
import SettingsMenu from "../settings-menu/settings-menu";
import NetScheme from "../net-scheme/net-scheme";

const AppLayout: FC = () => {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);

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

export default AppLayout;
