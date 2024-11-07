import React, { forwardRef, memo } from "react";
import { useSelector } from "react-redux";
import { selectConfigLoading } from "../../../store/main.slice";
import useOpenSettingsContext from "../../../contexts/open-settings.context";
import NetSchemeHostComponent from "./net-scheme-host.component";
import { HostViewModel } from "../../../models/host.models";

export interface NetSchemeHostContainerProps {
  hostViewModel: HostViewModel;
  changeHostViewModel: (value: HostViewModel, remove?: boolean) => void;
  addChildHostViewModel: () => void;
}

const NetSchemeHostContainer = forwardRef<
  HTMLDivElement,
  NetSchemeHostContainerProps
>(({ hostViewModel, changeHostViewModel, addChildHostViewModel }, ref) => {
  const configLoading = useSelector(selectConfigLoading);

  const { open } = useOpenSettingsContext();

  return (
    <NetSchemeHostComponent
      ref={ref}
      configLoading={configLoading}
      isEditable={open}
      hostViewModel={hostViewModel}
      changeHostViewModel={changeHostViewModel}
      addChildHostViewModel={addChildHostViewModel}
    />
  );
});

export default memo(NetSchemeHostContainer);
