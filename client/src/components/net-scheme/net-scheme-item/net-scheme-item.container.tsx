import React, { forwardRef, memo, useCallback } from "react";
import NetSchemeItemComponent from "./net-scheme-item.component";
import { HostViewModel, uuid } from "../../../models/host.models";
import { HostType } from "../../../constants/common.constants";
import { useSchemeFormContext } from "../../../contexts/form.context";
import { SchemeFormAction } from "../../../constants/form.constants";

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
        remove ? SchemeFormAction.REMOVE : SchemeFormAction.MODIFY
      );
    },
    [setField]
  );

  const addChildHostViewModel = useCallback(() => {
    const child: HostViewModel = {
      id: crypto.randomUUID(),
      type: HostType.SW,
      name: "",
      host: "",
      parentId: hostId,
      childIds: [],
      pinging: false,
      isAlive: null
    };

    setField(child, SchemeFormAction.ADD);
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
