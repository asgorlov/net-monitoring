import fs from "fs";
import Path from "../constants/path.constants";
import { defaultConfig, freeze } from "../../shared/constants/config.constants";
import { Config } from "../../shared/models/config.models";
import {
  LoggerLevel,
  LoggerType,
} from "../../shared/constants/logger.constants";
import { ConfigValidationError } from "../constants/config-validation-error.constants";

let configCache: Config | null = null;

const setConfigCache = (config: Config) => (configCache = freeze(config));

const getActualConfig = (path: string): Config => {
  return JSON.parse(fs.readFileSync(path, "utf8"));
};

const getConfig = (): Config => {
  if (!configCache) {
    setConfigCache(getActualConfig(Path.config));
  }

  return configCache;
};

const createDefaultConfig = (): Config => {
  fs.writeFileSync(Path.config, JSON.stringify(defaultConfig));
  setConfigCache(defaultConfig);
  return configCache;
};

const validateConfig = (config: Config | null | undefined) => {
  if (!config) {
    throw new Error(ConfigValidationError.EmptyConfig);
  }

  const isPortValid = isFinite(config.port);
  if (!isPortValid) {
    throw new Error(ConfigValidationError.InvalidPort);
  }

  if (config.logger) {
    const isLevelValid = Object.values(LoggerLevel).includes(
      config.logger.level,
    );
    if (!isLevelValid) {
      throw new Error(ConfigValidationError.InvalidLoggerLevel);
    }

    const isTypeValid = Object.values(LoggerType).includes(config.logger.type);
    if (!isTypeValid) {
      throw new Error(ConfigValidationError.InvalidLoggerType);
    }

    const isNumberOfLogFilesValid = isFinite(config.logger.numberOfLogFiles);
    if (!isNumberOfLogFilesValid) {
      throw new Error(ConfigValidationError.InvalidNumberOfLogFiles);
    }
  } else {
    throw new Error(ConfigValidationError.InvalidLoggerConfig);
  }

  if (config.request) {
    const isIntervalValid = isFinite(config.request.interval);
    if (!isIntervalValid) {
      throw new Error(ConfigValidationError.InvalidRequestInterval);
    }

    const isTimeoutValid = isFinite(config.request.timeout);
    if (!isTimeoutValid) {
      throw new Error(ConfigValidationError.InvalidRequestTimeout);
    }
  } else {
    throw new Error(ConfigValidationError.InvalidRequestConfig);
  }

  const isPingHostsValid =
    Array.isArray(config.pingHosts) && config.pingHosts.every((h) => h.id);
  if (!isPingHostsValid) {
    throw new Error(ConfigValidationError.InvalidPingHosts);
  }
};

const updateConfig = (config: Config): Config => {
  validateConfig(config);

  try {
    fs.writeFileSync(Path.config, JSON.stringify(config));
    setConfigCache(config);
    return configCache;
  } catch (e) {
    throw new Error(ConfigValidationError.ConfigUpdatingFailed);
  }
};

const ConfigUtils = {
  get: getConfig,
  update: updateConfig,
  createDefault: createDefaultConfig,
};

export default ConfigUtils;
