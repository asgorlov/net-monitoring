import React, { forwardRef, memo } from "react";
import NetSchemeHostComponent from "./net-scheme-host.component";
import { PingHost } from "../../../models/common.models";

export interface NetSchemeHostContainerProps {
  pingHost: PingHost;
}

const NetSchemeHostContainer = forwardRef<
  HTMLDivElement,
  NetSchemeHostContainerProps
>(({ pingHost }, ref) => {
  return <NetSchemeHostComponent name={pingHost.name} ref={ref} />;
});

export default memo(NetSchemeHostContainer);
