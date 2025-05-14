import "./net-scheme-empty-item.scss";
import React, { FC, memo, useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import NetSchemeLine from "../net-scheme-line/net-scheme-line";
import { LineDimensions } from "../../../models/line.models";
import { HostViewModel } from "../../../../shared/models/host.models";
import { SchemeFormAction } from "../../../constants/form.constants";
import { createEmptyHost } from "../../../utils/host.util";

export interface NetSchemeEmptyProps {
  changeScheme: (value: HostViewModel, action?: SchemeFormAction) => void;
}

const NetSchemeEmptyItem: FC<NetSchemeEmptyProps> = ({ changeScheme }) => {
  const [lineDimensions, setLineDimensions] = useState<LineDimensions>({
    width: "0px",
    height: "0px",
  });

  const handleClick = () =>
    changeScheme(createEmptyHost(), SchemeFormAction.ADD);

  const changeLineDimensions = (element: HTMLDivElement | null) => {
    if (element) {
      const width = `${element.offsetWidth / 2}px`;
      const height = `${element.offsetHeight / 2}px`;
      const canBeUpdated =
        lineDimensions.height !== height || lineDimensions.width !== width;
      if (canBeUpdated) {
        setLineDimensions({ width, height });
      }
    }
  };

  return (
    <div className="net-scheme-empty-item">
      <NetSchemeLine dimensions={lineDimensions} />
      <div className="net-scheme-empty-item__block" ref={changeLineDimensions}>
        <Button title="Добавить подключение" onClick={handleClick}>
          <PlusOutlined />
        </Button>
      </div>
    </div>
  );
};

export default memo(NetSchemeEmptyItem);
