import React, { forwardRef, memo, useCallback } from "react";
import NetSchemeItemComponent from "./net-scheme-item.component";
import { HostViewModel, uuid } from "../../../../shared/models/host.models";
import { SchemeFormAction } from "../../../constants/form.constants";
import { createEmptyHost } from "../../../utils/host.util";

export interface NetSchemeItemContainerProps {
  hostId: uuid;
  parentId?: uuid | null;
  scheme: Record<uuid, HostViewModel>;
  changeScheme: (value: HostViewModel, action?: SchemeFormAction) => void;
}

const NetSchemeItemContainer = forwardRef<
  HTMLDivElement,
  NetSchemeItemContainerProps
>(({ hostId, parentId = null, scheme, changeScheme }, ref) => {
  const hostViewModel = scheme[hostId];

  const changeHostViewModel = useCallback(
    (value: HostViewModel, remove: boolean = false) => {
      changeScheme(
        value,
        remove ? SchemeFormAction.REMOVE : SchemeFormAction.MODIFY,
      );
    },
    [changeScheme],
  );

  const addChildHostViewModel = useCallback(() => {
    changeScheme(createEmptyHost(hostId), SchemeFormAction.ADD);
  }, [hostId, changeScheme]);

  return (
    <NetSchemeItemComponent
      parentId={parentId}
      hostViewModel={hostViewModel}
      changeHostViewModel={changeHostViewModel}
      addChildHostViewModel={addChildHostViewModel}
      ref={ref}
      scheme={scheme}
      changeScheme={changeScheme}
    />
  );
});

export default memo(NetSchemeItemContainer);
