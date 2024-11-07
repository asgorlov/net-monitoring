import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectConfigLoading } from "../../store/main.slice";
import SettingsMenuComponent from "./settings-menu.component";
import useOpenSettingsContext from "../../contexts/open-settings.context";
import { useSettingsFormContext } from "../../contexts/form.context";

const SettingsMenuContainer: FC = () => {
  const configLoading = useSelector(selectConfigLoading);

  const { open } = useOpenSettingsContext();
  const { data, setData } = useSettingsFormContext();

  return (
    <SettingsMenuComponent
      open={open}
      configLoading={configLoading}
      formValues={data}
      onChangeFormValues={setData}
    />
  );
};

export default SettingsMenuContainer;
