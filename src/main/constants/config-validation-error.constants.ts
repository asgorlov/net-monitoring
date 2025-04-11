export enum ConfigValidationError {
  EmptyConfig = "EmptyConfig",
  InvalidPort = "InvalidPort",
  InvalidLoggerConfig = "InvalidLoggerConfig",
  InvalidLoggerLevel = "InvalidLoggerLevel",
  InvalidLoggerType = "InvalidLoggerType",
  InvalidNumberOfLogFiles = "InvalidNumberOfLogFiles",
  InvalidRequestConfig = "InvalidRequestConfig",
  InvalidRequestInterval = "InvalidRequestInterval",
  InvalidRequestTimeout = "InvalidRequestTimeout",
  InvalidPingHosts = "InvalidPingHosts",
  ConfigUpdatingFailed = "ConfigUpdatingFailed",
}
