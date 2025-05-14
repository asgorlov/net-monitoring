import "./net-scheme.scss";
import React, { FC, memo } from "react";
import { Button } from "antd";
import NetSchemeItemContainer from "./net-scheme-item/net-scheme-item.container";
import NetSchemeLine from "./net-scheme-line/net-scheme-line";
import { HostViewModel, uuid } from "../../../shared/models/host.models";
import NetSchemeEmptyItem from "./net-scheme-empty-item/net-scheme-empty-item";
import { LineDimensions } from "../../models/line.models";
import { SchemeFormAction } from "../../constants/form.constants";

export interface NetSchemeComponentProps {
  scheme: Record<uuid, HostViewModel>;
  changeScheme: (value: HostViewModel, action?: SchemeFormAction) => void;
  isEditable: boolean;
  openSettings: () => void;
}

const lineDimensions: LineDimensions = {
  width: "12px",
  isVertical: true,
};

const NetSchemeComponent: FC<NetSchemeComponentProps> = ({
  scheme,
  changeScheme,
  isEditable,
  openSettings,
}) => {
  const parentHostViewModels = Object.values(scheme).filter(
    (h) => h.parentId === null,
  );
  const showEmptyMessage = !isEditable && !parentHostViewModels.length;

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
            {parentHostViewModels.map((h) => {
              return (
                <NetSchemeItemContainer
                  key={h.id}
                  hostId={h.id}
                  scheme={scheme}
                  changeScheme={changeScheme}
                />
              );
            })}
            {isEditable && <NetSchemeEmptyItem changeScheme={changeScheme} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(NetSchemeComponent);
