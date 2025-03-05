const convertToMb = (bytesValue: number): number => bytesValue / 1024 / 1024;

const convertToBytes = (MbValue: number): number => MbValue * 1024 * 1024;

const convertToSeconds = (msValue: number): number => msValue / 1000;

const convertToMilliseconds = (sValue: number): number => sValue * 1000;

const downloadFile = (data: string, fileName: string, fileType: string) => {
  const blob = new Blob([data], { type: fileType });
  const anchor = document.createElement("a");
  const eventInitDict = {
    view: window,
    bubbles: true,
    cancelable: true
  };

  anchor.download = fileName;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.dispatchEvent(new MouseEvent("click", eventInitDict));
  anchor.remove();
};

const settingsUtil = {
  convertToMb: convertToMb,
  convertToBytes: convertToBytes,
  convertToSeconds: convertToSeconds,
  convertToMilliseconds: convertToMilliseconds,
  downloadFile: downloadFile
};

export default settingsUtil;
