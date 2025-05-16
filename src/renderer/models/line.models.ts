export interface LineDimensions {
  width: string;
  height?: string;
  isVertical?: boolean;
}

export interface BlockDimensions {
  width: number;
  height: number;
}

export interface LineProperties {
  hostBlock?: BlockDimensions;
  horizontalLastChildrenWidth?: number;
}
