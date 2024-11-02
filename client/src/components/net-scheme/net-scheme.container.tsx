import React, { FC } from "react";
import NetSchemeComponent from "./net-scheme.component";
import { useSelector } from "react-redux";
import { selectPingHosts } from "../../store/main.slice";

export interface NetSchemeContainerProps {}

const NetSchemeContainer: FC<NetSchemeContainerProps> = ({}) => {
  const pingHosts = useSelector(selectPingHosts);

  return <NetSchemeComponent pingHosts={pingHosts} />;
};

export default NetSchemeContainer;
