import React, { forwardRef, useCallback } from "react";
import NetSchemeItemComponent from "./net-scheme-item.component";
import { PingHost } from "../../../models/host.models";

export interface NetSchemeItemContainerProps {
  pingHost: PingHost;
  isMain?: boolean;
}

const NetSchemeItemContainer = forwardRef<
  HTMLDivElement,
  NetSchemeItemContainerProps
>(({ pingHost, isMain }, ref) => {
  //toDo: подумать как добавлять и удалять хосты, также не забыть про вью модель
  const addHost = useCallback(() => {}, []);

  const removeHost = useCallback(() => {}, []);

  return (
    <NetSchemeItemComponent
      pingHost={pingHost}
      isMain={isMain}
      ref={ref}
      addHost={addHost}
      removeHost={removeHost}
    />
  );
});

export default NetSchemeItemContainer;
