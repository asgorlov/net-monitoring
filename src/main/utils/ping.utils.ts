import child_process from "child_process";
import { PingHostParams, uuid } from "../../shared/models/host.models";
import { ConfigRequest } from "../../shared/models/config.models";
import ConfigUtils from "./config.utils";
import Logger from "./main-logger.utils";
import {
  DEFAULT_TIMEOUT_ECHO_REPLY_IN_MS,
  defaultConfig,
  MIN_ECHO_REPLY,
} from "../../shared/constants/config.constants";

const pingHostAbortControllers = new Map<uuid, AbortController>();

const getPingSettings = (): ConfigRequest => {
  try {
    return ConfigUtils.get().request;
  } catch (err) {
    Logger.info("Can't get request config. The default request config is used");

    return defaultConfig.request;
  }
};

const isAlive = (stdout: string): boolean | null => {
  const packetsRow = stdout
    .split("\n")
    .map((s) => s.trim())
    .find((s) => s.includes("Packets:")); // Example: Packets: Sent = 1, Received = 1, Lost = 0 (0% loss),
  Logger.debug(`The cmd execution was success with result: \n ${packetsRow}`);

  if (packetsRow) {
    const bracketIndex = packetsRow.indexOf("(");
    const percentIndex = packetsRow.indexOf("%");

    return packetsRow.substring(bracketIndex + 1, percentIndex) === "0";
  }

  return null;
};

const pingHost = (params: PingHostParams): Promise<boolean | null> => {
  return new Promise((resolve) => {
    const { host, pingId } = params;

    const settings = getPingSettings();
    const timeout = settings.timeout
      ? (settings.timeout * 1000) / MIN_ECHO_REPLY
      : DEFAULT_TIMEOUT_ECHO_REPLY_IN_MS;
    const command = `chcp 65001 | ping ${host.host} -n ${MIN_ECHO_REPLY} -w ${timeout}`;

    const controller = new AbortController();
    pingHostAbortControllers.set(pingId, controller);

    child_process.exec(
      command,
      { signal: controller.signal },
      (error, stdout) => {
        pingHostAbortControllers.delete(pingId);

        let alive = null;
        if (error) {
          if (error.name === "AbortError") {
            Logger.debug(`The ping of host '${host.host}' was aborted`);
          } else if (stdout.includes("timed out")) {
            Logger.info(
              `The ping of host '${host.host}' was interrupted by timeout`,
            );
            alive = false;
          } else {
            Logger.error(
              `There is the problem with the execution cmd ping of host '${host.host}'`,
            );
          }
        } else {
          alive = isAlive(stdout);
        }

        resolve(alive);
      },
    );
  });
};

const abortPing = (id: uuid) => {
  pingHostAbortControllers.get(id)?.abort();
};

const PingUtils = {
  ping: pingHost,
  abort: abortPing,
};

export default PingUtils;
