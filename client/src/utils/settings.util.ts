const convertToMb = (bytesValue: number): number => bytesValue / 1024 / 1024;

const convertToBytes = (MbValue: number): number => MbValue * 1024 * 1024;

const convertToSeconds = (msValue: number): number => msValue / 1000;

const convertToMilliseconds = (sValue: number): number => sValue * 1000;

const settingsUtil = {
  convertToMb: convertToMb,
  convertToBytes: convertToBytes,
  convertToSeconds: convertToSeconds,
  convertToMilliseconds: convertToMilliseconds
};

export default settingsUtil;
