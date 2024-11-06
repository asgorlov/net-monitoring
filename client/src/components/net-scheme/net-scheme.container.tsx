import React, { FC, useMemo } from "react";
import NetSchemeComponent from "./net-scheme.component";
import { useSelector } from "react-redux";
import { selectPingHosts } from "../../store/main.slice";
import { HostType } from "../../constants/common.constants";

export interface NetSchemeContainerProps {}

const NetSchemeContainer: FC<NetSchemeContainerProps> = ({}) => {
  // const pingHosts = useSelector(selectPingHosts);

  // toDo: удалить после тестов
  const pingHosts = useMemo(() => {
    return [
      {
        id: crypto.randomUUID(),
        host: "www.google.com",
        name: "sw-1",
        type: HostType.SW,
        children: [
          {
            id: crypto.randomUUID(),
            host: "www.google.com",
            name: "gw-1.1",
            type: HostType.GW,
            children: []
          },
          {
            id: crypto.randomUUID(),
            host: "www.google.com",
            name: "plc-1.2",
            type: HostType.PLC,
            children: []
          },
          {
            id: crypto.randomUUID(),
            host: "www.google.com",
            name: "sw-1.3",
            type: HostType.SW,
            children: [
              {
                id: crypto.randomUUID(),
                host: "www.google.com",
                name: "gw-1.3.1",
                type: HostType.GW,
                children: []
              },
              {
                id: crypto.randomUUID(),
                host: "www.google.com",
                name: "plc-1.3.2",
                type: HostType.PLC,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        host: "www.google.com",
        name: "sw-2",
        type: HostType.SW,
        children: [
          {
            id: crypto.randomUUID(),
            host: "www.google.com",
            name: "sw-2.1",
            type: HostType.SW,
            children: [
              {
                id: crypto.randomUUID(),
                host: "www.google.com",
                name: "gw-2.1.1",
                type: HostType.GW,
                children: []
              },
              {
                id: crypto.randomUUID(),
                host: "www.google.com",
                name: "plc-2.1.2",
                type: HostType.PLC,
                children: []
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            host: "www.google.com",
            name: "gw-2.2",
            type: HostType.GW,
            children: []
          },
          {
            id: crypto.randomUUID(),
            host: "www.google.com",
            name: "plc-2.3",
            type: HostType.PLC,
            children: []
          }
        ]
      }
    ];
  }, []);

  return <NetSchemeComponent pingHosts={pingHosts} />;
};

export default NetSchemeContainer;
