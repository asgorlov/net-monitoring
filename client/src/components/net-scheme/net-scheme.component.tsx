import "./net-scheme.scss";
import React, { FC, memo, useMemo } from "react";
import NetSchemeItemContainer from "./net-scheme-item/net-scheme-item.container";
import { PingHost } from "../../models/common.models";
import NetSchemeLine from "./net-scheme-line/net-scheme-line";

export interface NetSchemeComponentProps {
  pingHosts: PingHost[];
}

const NetSchemeComponent: FC<NetSchemeComponentProps> = ({ pingHosts }) => {
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
        {pingHosts.map(h => {
          return <NetSchemeItemContainer key={h.id} pingHost={h} isMain />;
        })}
      </div>
    </div>
  );
};

export default memo(NetSchemeComponent);
