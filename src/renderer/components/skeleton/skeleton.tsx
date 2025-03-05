import React, { FC } from "react";
import SkeletonNode from "antd/es/skeleton/Node";

export interface SkeletonProps {
  className?: string;
}

const Skeleton: FC<SkeletonProps> = ({ className }) => {
  return <SkeletonNode className={className} children={<div />} active />;
};

export default Skeleton;
