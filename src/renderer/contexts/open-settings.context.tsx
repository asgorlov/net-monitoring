import React, {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

export interface OpenSettings {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const OpenSettingsContext = createContext<OpenSettings>({
  open: false,
  setOpen: () => {},
});

export const OpenSettingsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <OpenSettingsContext.Provider
      value={{ open, setOpen }}
      children={children}
    />
  );
};

const useOpenSettingsContext = (): OpenSettings =>
  useContext(OpenSettingsContext);

export default useOpenSettingsContext;
