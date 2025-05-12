import React, { forwardRef, memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectAutoPing,
  selectConfigLoading,
  selectInterval,
  selectManualPingTrigger,
} from "../../../store/main.slice";
import useOpenSettingsContext from "../../../contexts/open-settings.context";
import NetSchemeHostComponent from "./net-scheme-host.component";
import { HostViewModel } from "../../../../shared/models/host.models";
import { pingHostAsync } from "../../../utils/host.util";
import settingsUtil from "../../../utils/settings.util";
import { useSchemeFormContext } from "../../../contexts/form.context";

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
  const { isTouched } = useSchemeFormContext();
  const controllerRef = useRef(new AbortController());
  const timerRef = useRef<NodeJS.Timeout | undefined>();

  const [pinging, setPinging] = useState(false);
  const [isAlive, setIsAlive] = useState<boolean | null>(null);

  useEffect(() => {
    const stopPing = () => {
      controllerRef.current.abort();

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
    stopPing();

    const canBePinged =
      hostViewModel.host &&
      !configLoading &&
      !open &&
      (autoPing || manualPingTrigger > 0);
    if (canBePinged) {
      controllerRef.current = new AbortController();
      const ping = () => {
        pingHostAsync(
          hostViewModel,
          controllerRef.current.signal,
          setPinging,
        ).then(setIsAlive);
      };
      ping();

      if (autoPing) {
        timerRef.current = setInterval(
          ping,
          settingsUtil.convertToMilliseconds(interval),
        );
      }

      return stopPing;
    }
  }, [
    autoPing,
    manualPingTrigger,
    hostViewModel,
    configLoading,
    open,
    interval,
  ]);

  useEffect(() => {
    if (!open && isTouched) {
      setIsAlive(null);
    }
  }, [open, isTouched]);

  return (
    <NetSchemeHostComponent
      ref={ref}
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
