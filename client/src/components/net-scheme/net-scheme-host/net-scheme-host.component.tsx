import "./net-scheme-host.scss";
import React, { forwardRef, memo } from "react";

export interface NetSchemeHostComponentProps {
  name: string;
}

const NetSchemeHostComponent = forwardRef<
  HTMLDivElement,
  NetSchemeHostComponentProps
>(({ name }, ref) => {
  return (
    <div className="net-scheme-host" ref={ref}>
      {name}
    </div>
  );
});

export default memo(NetSchemeHostComponent);
