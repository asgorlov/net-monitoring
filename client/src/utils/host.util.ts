import {
  FlattedPingHost,
  HostViewModel,
  PingHost,
  uuid
} from "../models/host.models";

export const getFlattedPingHosts = (
  hosts: PingHost[],
  parentId: uuid | null = null
): FlattedPingHost[] => {
  const result: FlattedPingHost[] = [];

  hosts.forEach(h => {
    result.push({
      id: h.id,
      type: h.type,
      name: h.name,
      host: h.host,
      parentId,
      childIds: h.children.map(c => c.id)
    });
    if (h.children.length) {
      result.push(...getFlattedPingHosts(h.children, h.id));
    }
  });

  return result;
};

export const initializePingHostViewModel = (
  hosts: PingHost[]
): Record<uuid, HostViewModel> => {
  const result: Record<uuid, HostViewModel> = {};

  getFlattedPingHosts(hosts).forEach(h => {
    result[h.id] = {
      ...h,
      pinging: false,
      isAlive: null
    };
  });

  return result;
};

export const getUpdatedHostViewModels = (
  hosts: PingHost[],
  hostViewModels: Record<uuid, HostViewModel>
): Record<uuid, HostViewModel> => {
  if (Object.keys(hostViewModels).length) {
    const result: Record<uuid, HostViewModel> = {};

    getFlattedPingHosts(hosts).forEach(h => {
      const model = hostViewModels[h.id];
      result[h.id] = model
        ? { ...model, ...h }
        : {
            ...h,
            pinging: false,
            isAlive: null
          };
    });

    return result;
  }

  return initializePingHostViewModel(hosts);
};

export const convertHostViewModelsToPingHosts = (
  hostViewModels: Record<uuid, HostViewModel>,
  parentId: uuid | null = null
): PingHost[] => {
  return Object.values(hostViewModels)
    .filter(model => model.parentId === parentId)
    .map(m => {
      const pingHost: PingHost = {
        id: m.id,
        type: m.type,
        name: m.name,
        host: m.host,
        children: convertHostViewModelsToPingHosts(hostViewModels, m.id)
      };

      return pingHost;
    });
};

export const modifyHostViewModel = (
  models: Record<uuid, HostViewModel>,
  modifiedModel: HostViewModel
) => {
  models[modifiedModel.id] = modifiedModel;
};

export const addHostViewModel = (
  models: Record<uuid, HostViewModel>,
  addedModel: HostViewModel
) => {
  const addedId = addedModel.id;
  models[addedId] = addedModel;

  const parentId = addedModel.parentId;
  if (parentId) {
    const parent = models[parentId];
    if (parent) {
      models[parentId] = {
        ...parent,
        childIds: parent.childIds.concat(addedId)
      };
    }
  }
};

export const removeHostViewModel = (
  models: Record<uuid, HostViewModel>,
  removedModel: HostViewModel
) => {
  const removedId = removedModel.id;
  delete models[removedId];

  const parentId = removedModel.parentId;
  if (parentId) {
    const parent = models[parentId];
    if (parent) {
      const newChildIds = parent.childIds.filter(id => id !== removedId);
      if (newChildIds.length !== parent.childIds.length) {
        models[parentId] = {
          ...parent,
          childIds: newChildIds
        };
      }
    }
  }
};
