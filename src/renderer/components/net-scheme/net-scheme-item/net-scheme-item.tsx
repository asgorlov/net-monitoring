import "./net-scheme-item.scss";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import NetSchemeHostContainer from "../net-scheme-host/net-scheme-host.container";
import NetSchemeLine from "../net-scheme-line/net-scheme-line";
import { LineProperties } from "../../../models/line.models";
import { HostViewModel, uuid } from "../../../../shared/models/host.models";
import { SchemeFormAction } from "../../../constants/form.constants";
import { createEmptyHost } from "../../../utils/host.util";

export interface NetSchemeItemProps {
  hostId: uuid;
  parentId?: uuid | null;
  scheme: Record<uuid, HostViewModel>;
  changeScheme: (value: HostViewModel, action?: SchemeFormAction) => void;
}

const initialLineProps: LineProperties = {
  hostBlock: {
    height: 0,
    width: 0,
  },
  horizontalLastChildrenWidth: 0,
};

const NetSchemeItem = forwardRef<HTMLDivElement, NetSchemeItemProps>(
  ({ hostId, parentId = null, scheme, changeScheme }, ref) => {
    const [lineProps, setLineProps] =
      useState<LineProperties>(initialLineProps);

    const mainLineDimensions = useMemo(() => {
      if (parentId === null && lineProps.hostBlock) {
        const halfHeight = lineProps.hostBlock.height / 2;
        const halfWidth = lineProps.hostBlock.width / 2;

        return {
          width: `${halfHeight}px`,
          height: `${halfWidth}px`,
        };
      }
    }, [parentId, lineProps.hostBlock]);

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
    }, [changeScheme, hostId]);

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
            width: element!.offsetWidth,
          },
        });
      }
    };

    const setLastChildrenWidth = (
      element: HTMLDivElement | null,
      index: number,
    ) => {
      const canBeUpdated =
        element &&
        index === hostViewModel.childIds.length - 1 &&
        lineProps.horizontalLastChildrenWidth !== element.offsetWidth;
      if (canBeUpdated) {
        setLineProps({
          ...lineProps,
          horizontalLastChildrenWidth: element!.offsetWidth,
        });
      }
    };

    return (
      <div className="net-scheme-item" ref={ref}>
        {parentId === null && <NetSchemeLine dimensions={mainLineDimensions} />}
        <NetSchemeHostContainer
          ref={setHostBlockDimensions}
          hostViewModel={hostViewModel}
          changeHostViewModel={changeHostViewModel}
          addChildHostViewModel={addChildHostViewModel}
        />
        {hostViewModel.childIds.length > 0 && (
          <div className="net-scheme-item__children-container">
            <NetSchemeLine
              hostBlock={lineProps.hostBlock}
              horizontalLastChildrenWidth={
                lineProps.horizontalLastChildrenWidth
              }
            />
            <div className="net-scheme-item__children">
              {hostViewModel.childIds.map((id: uuid, i: number) => {
                return (
                  <div
                    key={id}
                    className="net-scheme-item__children-element-container"
                  >
                    <NetSchemeLine hostBlock={lineProps.hostBlock} />
                    <NetSchemeItem
                      hostId={id}
                      parentId={hostViewModel.id}
                      scheme={scheme}
                      changeScheme={changeScheme}
                      ref={(el) => setLastChildrenWidth(el, i)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default NetSchemeItem;
