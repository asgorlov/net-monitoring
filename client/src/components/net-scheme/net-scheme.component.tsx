import "./net-scheme.scss";
import React, { FC, memo, useMemo } from "react";
import NetSchemeItemContainer from "./net-scheme-item/net-scheme-item.container";
import NetSchemeLine from "./net-scheme-line/net-scheme-line";
import { HostViewModel, uuid } from "../../models/host.models";
import NetSchemeEmptyItem from "./net-scheme-empty-item/net-scheme-empty-item";

export interface NetSchemeComponentProps {
  hostViewModels: Record<uuid, HostViewModel>;
  addHostViewModel: () => void;
  isEditable: boolean;
}

const NetSchemeComponent: FC<NetSchemeComponentProps> = ({
  hostViewModels,
  addHostViewModel,
  isEditable
}) => {
  const lineDimensions = useMemo(
    () => ({
      width: "12px",
      isVertical: true
    }),
    []
  );

  return (
    <div className="net-scheme__wrapper">
      <div className="net-scheme">
        <NetSchemeLine dimensions={lineDimensions} />
        <div className="net-scheme__hosts">
          {Object.values(hostViewModels)
            .filter(h => h.parentId === null)
            .map(h => {
              return <NetSchemeItemContainer key={h.id} hostId={h.id} />;
            })}
          {isEditable && <NetSchemeEmptyItem add={addHostViewModel} />}
        </div>
      </div>
    </div>
  );
};

export default memo(NetSchemeComponent);
