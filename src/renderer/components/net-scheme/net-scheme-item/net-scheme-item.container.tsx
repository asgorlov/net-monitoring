import React, { forwardRef, memo, useCallback } from "react";
import NetSchemeItemComponent from "./net-scheme-item.component";
import { HostViewModel, uuid } from "../../../../shared/models/host.models";
import { useSchemeFormContext } from "../../../contexts/form.context";
import { SchemeFormAction } from "../../../constants/form.constants";
import { createEmptyHost } from "../../../utils/host.util";

export interface NetSchemeItemContainerProps {
  hostId: uuid;
  parentId?: uuid | null;
}

const NetSchemeItemContainer = forwardRef<
  HTMLDivElement,
  NetSchemeItemContainerProps
>(({ hostId, parentId = null }, ref) => {
  const { data, setField } = useSchemeFormContext();

  const hostViewModel = data[hostId];

  const changeHostViewModel = useCallback(
    (value: HostViewModel, remove: boolean = false) => {
      setField(
        value,
        remove ? SchemeFormAction.REMOVE : SchemeFormAction.MODIFY,
      );
    },
    [setField],
  );

  const addChildHostViewModel = useCallback(() => {
    setField(createEmptyHost(hostId), SchemeFormAction.ADD);
  }, [hostId, setField]);

  return (
    <NetSchemeItemComponent
      parentId={parentId}
      hostViewModel={hostViewModel}
      changeHostViewModel={changeHostViewModel}
      addChildHostViewModel={addChildHostViewModel}
      ref={ref}
    />
  );
});

export default memo(NetSchemeItemContainer);
