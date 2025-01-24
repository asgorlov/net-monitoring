import React, { forwardRef, memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectAutoPing,
  selectConfigLoading,
  selectInterval,
  selectManualPingTrigger
} from "../../../store/main.slice";
import useOpenSettingsContext from "../../../contexts/open-settings.context";
import NetSchemeHostComponent from "./net-scheme-host.component";
import { HostViewModel } from "../../../models/host.models";
import { pingHostAsync } from "../../../utils/host.util";
import settingsUtil from "../../../utils/settings.util";

export interface NetSchemeHostContainerProps {
  hostViewModel: HostViewModel;
  changeHostViewModel: (value: HostViewModel, remove?: boolean) => void;
  addChildHostViewModel: () => void;
}

const NetSchemeHostContainer = forwardRef<
  HTMLDivElement,
  NetSchemeHostContainerProps
>(({ hostViewModel, changeHostViewModel, addChildHostViewModel }, ref) => {
  const manualPingTrigger = useSelector(selectManualPingTrigger);
  const configLoading = useSelector(selectConfigLoading);
  const interval = useSelector(selectInterval);
  const autoPing = useSelector(selectAutoPing);

  const { open } = useOpenSettingsContext();
  const controllerRef = useRef(new AbortController());
  const timerRef = useRef<NodeJS.Timer | undefined>();

  const [pinging, setPinging] = useState(false);
  const [isAlive, setIsAlive] = useState<boolean | null>(null);

  useEffect(() => {
    const stopPing = () => {
      controllerRef.current.abort();
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    };
    stopPing();

    if (!configLoading && hostViewModel.host && !open) {
      if (autoPing || manualPingTrigger > 0) {
        controllerRef.current = new AbortController();
        const ping = () => {
          setPinging(true);
          pingHostAsync(hostViewModel, controllerRef.current)
            .then(setIsAlive)
            .finally(() => setPinging(false));
        };
        ping();

        if (autoPing) {
          timerRef.current = setInterval(
            ping,
            settingsUtil.convertToMilliseconds(interval)
          );
        }

        return stopPing;
      }
    }
  }, [
    autoPing,
    manualPingTrigger,
    hostViewModel,
    configLoading,
    open,
    interval
  ]);

  return (
    <NetSchemeHostComponent
      ref={ref}
      configLoading={configLoading}
      pinging={pinging}
      isEditable={open}
      isAlive={isAlive}
      hostViewModel={hostViewModel}
      changeHostViewModel={changeHostViewModel}
      addChildHostViewModel={addChildHostViewModel}
    />
  );
});

export default memo(NetSchemeHostContainer);
