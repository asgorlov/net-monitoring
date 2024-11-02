import React, { forwardRef } from "react";
import NetSchemeItemComponent from "./net-scheme-item.component";
import { PingHost } from "../../../models/common.models";

export interface NetSchemeItemContainerProps {
  pingHost: PingHost;
  isMain?: boolean;
}

const NetSchemeItemContainer = forwardRef<
  HTMLDivElement,
  NetSchemeItemContainerProps
>(({ pingHost, isMain }, ref) => {
  return (
    <NetSchemeItemComponent pingHost={pingHost} isMain={isMain} ref={ref} />
  );
});

export default NetSchemeItemContainer;
