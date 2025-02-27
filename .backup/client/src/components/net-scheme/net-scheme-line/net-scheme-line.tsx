import React, { CSSProperties, FC, memo } from "react";
import { LineDimensions, LineProperties } from "../../../models/line.models";

export interface NetSchemeLineProps extends LineProperties {
  borderWeight?: number;
  dimensions?: LineDimensions;
}

const NetSchemeLine: FC<NetSchemeLineProps> = ({
  borderWeight = 4,
  dimensions,
  hostBlock,
  horizontalLastChildrenWidth
}) => {
  const getStyle = (): CSSProperties => {
    if (dimensions) {
      const style = {
        height: dimensions.height,
        width: dimensions.width
      };
      Object.assign(
        style,
        dimensions.isVertical
          ? { borderRight: `${borderWeight}px solid` }
          : { borderBottom: `${borderWeight}px solid` }
      );

      return style;
    }

    if (hostBlock) {
      const middleOfHostBlockHeight = hostBlock.height / 2;
      const middleOfHostBlockWidth = (hostBlock.width + borderWeight) / 2;
      const isHorizontal = horizontalLastChildrenWidth !== undefined;
      if (isHorizontal) {
        const middleOfLastChildHostBlockWidth =
          horizontalLastChildrenWidth - middleOfHostBlockWidth;

        return {
          width: `calc(100% - ${middleOfLastChildHostBlockWidth}px)`,
          height: `${middleOfHostBlockHeight}px`,
          borderBottom: `${borderWeight}px solid`
        };
      }

      return {
        width: `${middleOfHostBlockWidth}px`,
        height: `${middleOfHostBlockHeight}px`,
        borderRight: `${borderWeight}px solid`
      };
    }

    return {};
  };

  return <div className="net-scheme-line" style={getStyle()} />;
};

export default memo(NetSchemeLine);
