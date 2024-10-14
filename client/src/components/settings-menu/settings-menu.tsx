import React, { FC } from "react";
import "./settings-menu.scss";
import { theme } from "antd";
import clsx from "clsx";

export interface MenuProps {
  open: boolean;
}

const SettingsMenu: FC<MenuProps> = ({ open }) => {
  const { token } = theme.useToken();

  return (
    <div
      className={clsx("settings-menu", { _opened: open })}
      style={{
        background: token.colorBgLayout,
        borderColor: token.colorBorder
      }}
    >
      menu settings
    </div>
  );
};

export default SettingsMenu;
