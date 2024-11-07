import "./net-scheme.scss";
import React, { FC, memo, useMemo } from "react";
import NetSchemeItemContainer from "./net-scheme-item/net-scheme-item.container";
import NetSchemeLine from "./net-scheme-line/net-scheme-line";
import { HostViewModel, uuid } from "../../models/host.models";

export interface NetSchemeComponentProps {
  hostViewModels: Record<uuid, HostViewModel>;
}

const NetSchemeComponent: FC<NetSchemeComponentProps> = ({
  hostViewModels
}) => {
  const lineDimensions = useMemo(
    () => ({
      width: "12px",
      height: "100%",
      isVertical: true
    }),
    []
  );

  return (
    <div className="net-scheme">
      <NetSchemeLine dimensions={lineDimensions} />
      <div className="net-scheme__hosts">
        {Object.values(hostViewModels)
          .filter(h => h.parentId === null)
          .map(h => {
            return <NetSchemeItemContainer key={h.id} hostId={h.id} />;
          })}
      </div>
    </div>
  );
};

export default memo(NetSchemeComponent);
