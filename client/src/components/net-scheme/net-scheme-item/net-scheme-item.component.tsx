import "./net-scheme-item.scss";
import React, { forwardRef, memo, useMemo, useState } from "react";
import { PingHost } from "../../../models/common.models";
import NetSchemeHostContainer from "../net-scheme-host/net-scheme-host.container";
import NetSchemeItemContainer from "./net-scheme-item.container";
import NetSchemeLine from "../net-scheme-line/net-scheme-line";
import { LineProperties } from "../../../models/line.models";

export interface NetSchemeItemComponentProps {
  pingHost: PingHost;
  isMain?: boolean;
}

const NetSchemeItemComponent = forwardRef<
  HTMLDivElement,
  NetSchemeItemComponentProps
>(({ pingHost, isMain }, ref) => {
  const [lineProps, setLineProps] = useState<LineProperties>({
    hostBlock: {
      height: 0,
      width: 0
    },
    horizontalLastChildrenWidth: 0
  });

  const mainLineDimensions = useMemo(() => {
    if (isMain && lineProps.hostBlock) {
      const halfHeight = lineProps.hostBlock.height / 2;
      const halfWidth = lineProps.hostBlock.width / 2;

      return {
        width: `${halfHeight}px`,
        height: `${halfWidth}px`
      };
    }
  }, [isMain, lineProps.hostBlock]);

  const setHostBlockDimensions = (element: HTMLDivElement | null) => {
    const canBeUpdated =
      element &&
      (!lineProps.hostBlock ||
        lineProps.hostBlock.height !== element.offsetHeight ||
        lineProps.hostBlock.width !== element.offsetWidth);
    if (canBeUpdated) {
      setLineProps({
        ...lineProps,
        hostBlock: {
          height: element!.offsetHeight,
          width: element!.offsetWidth
        }
      });
    }
  };

  const setLastChildrenWidth = (
    element: HTMLDivElement | null,
    index: number
  ) => {
    const canBeUpdated =
      element &&
      index === pingHost.children.length - 1 &&
      lineProps.horizontalLastChildrenWidth !== element.offsetWidth;
    if (canBeUpdated) {
      setLineProps({
        ...lineProps,
        horizontalLastChildrenWidth: element!.offsetWidth
      });
    }
  };

  return (
    <div className="net-scheme-item" ref={ref}>
      {isMain && <NetSchemeLine dimensions={mainLineDimensions} />}
      <NetSchemeHostContainer
        pingHost={pingHost}
        ref={setHostBlockDimensions}
      />
      {pingHost.children.length > 0 && (
        <div className="net-scheme-item__children-container">
          <NetSchemeLine
            hostBlock={lineProps.hostBlock}
            horizontalLastChildrenWidth={lineProps.horizontalLastChildrenWidth}
          />
          <div className="net-scheme-item__children">
            {pingHost.children.map((h: PingHost, i: number) => {
              return (
                <div
                  key={h.id}
                  className="net-scheme-item__children-element-container"
                >
                  <NetSchemeLine hostBlock={lineProps.hostBlock} />
                  <NetSchemeItemContainer
                    pingHost={h}
                    ref={el => setLastChildrenWidth(el, i)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

export default memo(NetSchemeItemComponent);
