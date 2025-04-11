export interface ConsoleLoggerRow {
  row: string;
  settings: string[];
}

export type MainLogsHandlerType = (loggerRow: ConsoleLoggerRow) => void;
