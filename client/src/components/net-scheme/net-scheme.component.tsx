import "./net-scheme.scss";
import React, { FC, memo, useMemo } from "react";
import NetSchemeItemContainer from "./net-scheme-item/net-scheme-item.container";
import NetSchemeLine from "./net-scheme-line/net-scheme-line";
import { HostViewModel, uuid } from "../../models/host.models";
import NetSchemeEmptyItem from "./net-scheme-empty-item/net-scheme-empty-item";
import { Button } from "antd";

export interface NetSchemeComponentProps {
  hostViewModels: Record<uuid, HostViewModel>;
  addHostViewModel: () => void;
  isEditable: boolean;
  openSettings: () => void;
}

const NetSchemeComponent: FC<NetSchemeComponentProps> = ({
  hostViewModels,
  addHostViewModel,
  isEditable,
  openSettings
}) => {
  const parentHostViewModels = Object.values(hostViewModels).filter(
    h => h.parentId === null
  );
  const showEmptyMessage = !isEditable && !parentHostViewModels.length;

  const lineDimensions = useMemo(
    () => ({
      width: "12px",
      isVertical: true
    }),
    []
  );

  return (
    <div className="net-scheme__wrapper">
      {showEmptyMessage ? (
        <div className="net-scheme__empty">
          <div className="net-scheme__empty__message">
            <span>Нет подключений для отображения.</span>
            <span>
              Для редактирования схемы перейдите в{" "}
              <Button type="link" onClick={openSettings}>
                настройки
              </Button>
              .
            </span>
          </div>
        </div>
      ) : (
        <div className="net-scheme">
          <NetSchemeLine dimensions={lineDimensions} />
          <div className="net-scheme__hosts">
            {parentHostViewModels.map(h => {
              return <NetSchemeItemContainer key={h.id} hostId={h.id} />;
            })}
            {isEditable && <NetSchemeEmptyItem add={addHostViewModel} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(NetSchemeComponent);
