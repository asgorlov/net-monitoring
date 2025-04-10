import { notification } from "antd";
import {
  FlattedPingHost,
  HostBase,
  HostResponseBody,
  HostViewModel,
  PingHost,
  uuid,
} from "../../shared/models/host.models";
import { HostFieldError } from "../constants/form.constants";
import { HostType } from "../constants/common.constants";
import Path from "../constants/path.constants";

export const getFlattedPingHosts = (
  hosts: PingHost[],
  parentId: uuid | null = null,
): FlattedPingHost[] => {
  const result: FlattedPingHost[] = [];

  hosts.forEach((h) => {
    result.push({
      id: h.id,
      type: h.type,
      name: h.name,
      host: h.host,
      parentId,
      childIds: h.children.map((c) => c.id),
    });
    if (h.children.length) {
      result.push(...getFlattedPingHosts(h.children, h.id));
    }
  });

  return result;
};

export const initializePingHostViewModel = (
  hosts: PingHost[],
): Record<uuid, HostViewModel> => {
  const result: Record<uuid, HostViewModel> = {};

  getFlattedPingHosts(hosts).forEach((h) => {
    result[h.id] = {
      ...h,
      errors: [],
    };
  });

  return result;
};

export const getUpdatedHostViewModels = (
  hosts: PingHost[],
  hostViewModels: Record<uuid, HostViewModel>,
): Record<uuid, HostViewModel> => {
  if (Object.keys(hostViewModels).length) {
    const result: Record<uuid, HostViewModel> = {};

    getFlattedPingHosts(hosts).forEach((h) => {
      const model = hostViewModels[h.id];
      result[h.id] = model
        ? { ...model, ...h }
        : {
            ...h,
            errors: [],
          };
    });

    return result;
  }

  return initializePingHostViewModel(hosts);
};

export const convertHostViewModelsToPingHosts = (
  hostViewModels: Record<uuid, HostViewModel>,
  parentId: uuid | null = null,
): PingHost[] => {
  return Object.values(hostViewModels)
    .filter((model) => model.parentId === parentId)
    .map((m) => {
      const pingHost: PingHost = {
        id: m.id,
        type: m.type,
        name: m.name,
        host: m.host,
        children: convertHostViewModelsToPingHosts(hostViewModels, m.id),
      };

      return pingHost;
    });
};

export const modifyHostViewModel = (
  models: Record<uuid, HostViewModel>,
  modifiedModel: HostViewModel,
) => {
  models[modifiedModel.id] = modifiedModel;
};

export const addHostViewModel = (
  models: Record<uuid, HostViewModel>,
  addedModel: HostViewModel,
) => {
  const addedId = addedModel.id;
  models[addedId] = addedModel;

  const parentId = addedModel.parentId;
  if (parentId) {
    const parent = models[parentId];
    if (parent) {
      models[parentId] = {
        ...parent,
        childIds: parent.childIds.concat(addedId),
      };
    }
  }
};

export const getFlattedChildHostViewModels = (
  models: Record<uuid, HostViewModel>,
  model: HostViewModel,
): HostViewModel[] => {
  const result: HostViewModel[] = [];

  model.childIds.forEach((id) => {
    const current = models[id];
    if (current) {
      result.push(current);

      if (current.childIds.length) {
        result.push(...getFlattedChildHostViewModels(models, current));
      }
    }
  });

  return result;
};

export const removeHostViewModel = (
  models: Record<uuid, HostViewModel>,
  removedModel: HostViewModel,
) => {
  const removedId = removedModel.id;
  delete models[removedId];

  const children = getFlattedChildHostViewModels(models, removedModel);
  children.forEach((c) => delete models[c.id]);

  const parentId = removedModel.parentId;
  if (parentId) {
    const parent = models[parentId];
    if (parent) {
      const newChildIds = parent.childIds.filter((id) => id !== removedId);
      if (newChildIds.length !== parent.childIds.length) {
        models[parentId] = {
          ...parent,
          childIds: newChildIds,
        };
      }
    }
  }
};

export const getOnlyValidHostViewModels = (
  hostViewModels: Record<uuid, HostViewModel>,
) => {
  const newHostViewModel = { ...hostViewModels };

  Object.values(newHostViewModel)
    .filter((m) => m.errors.length)
    .forEach((m) => removeHostViewModel(newHostViewModel, m));

  return newHostViewModel;
};

export const validateAndChangeHostViewModels = (
  hostViewModels: Record<uuid, HostViewModel>,
): Record<uuid, HostViewModel> => {
  const schemeFormErrors: Record<uuid, HostFieldError[]> = {};

  Object.values(hostViewModels).forEach((m) => {
    const errors: HostFieldError[] = [];

    if (!m.name) {
      errors.push(HostFieldError.NAME);
    }

    if (!m.host) {
      errors.push(HostFieldError.HOST);
    }

    if (errors.length) {
      schemeFormErrors[m.id] = errors;
    }
  });

  const resultEntries = Object.entries(schemeFormErrors);
  if (resultEntries.length > 0) {
    const newHostViewModels = { ...hostViewModels };
    resultEntries.forEach(
      ([id, errors]) =>
        (newHostViewModels[id] = { ...newHostViewModels[id], errors }),
    );

    return newHostViewModels;
  }

  return hostViewModels;
};

export const pingHostAsync = async (
  host: HostBase,
  controller: AbortController,
): Promise<boolean | null> => {
  // toDo: Исправить логику
  // try {
  //   const options: RequestInit = {
  //     method: "POST",
  //     headers: [["Content-Type", "application/json"]],
  //     body: JSON.stringify({ hosts: [host] }),
  //     signal: controller.signal,
  //   };
  //   const response = await fetch(Path.ping, options);
  //   const data: HostResponseBody = await response.json();
  //
  //   return data.hostStatuses[0].isAlive;
  // } catch (e) {
  //   const error = e as Error;
  //   if (error.name !== "AbortError") {
  //     notification.error({
  //       message: `Не удалось выполнить пинг подключения с адресом: ${host.host}`,
  //     });
  //     console.error(error);
  //   }
  // }

  return null;
};

export const createEmptyHost = (
  parentId: uuid | null = null,
): HostViewModel => {
  return {
    id: crypto.randomUUID(),
    type: HostType.SW,
    name: "",
    host: "",
    parentId,
    childIds: [],
    errors: [],
  };
};
