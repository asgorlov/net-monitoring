import "./net-scheme-empty-item.scss";
import React, { FC, memo, useState } from "react";
import { Button } from "antd";
import NetSchemeLine from "../net-scheme-line/net-scheme-line";
import { LineDimensions } from "../../../models/line.models";
import { PlusOutlined } from "@ant-design/icons";

export interface NetSchemeEmptyProps {
  add: () => void;
}

const NetSchemeEmptyItem: FC<NetSchemeEmptyProps> = ({ add }) => {
  const [lineDimensions, setLineDimensions] = useState<LineDimensions>({
    width: "0px",
    height: "0px"
  });

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
        <Button title="Добавить подключение" onClick={add}>
          <PlusOutlined />
        </Button>
      </div>
    </div>
  );
};

export default memo(NetSchemeEmptyItem);
