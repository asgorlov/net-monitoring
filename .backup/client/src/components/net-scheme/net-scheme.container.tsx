import React, { FC, useCallback } from "react";
import NetSchemeComponent from "./net-scheme.component";
import { useSchemeFormContext } from "../../contexts/form.context";
import useOpenSettingsContext from "../../contexts/open-settings.context";
import { SchemeFormAction } from "../../constants/form.constants";
import { createEmptyHost } from "../../utils/host.util";

const NetSchemeContainer: FC = () => {
  const { data, setField } = useSchemeFormContext();
  const { open, setOpen } = useOpenSettingsContext();

  const openSettings = useCallback(() => setOpen(true), [setOpen]);

  const addHostViewModel = useCallback(() => {
    setField(createEmptyHost(), SchemeFormAction.ADD);
  }, [setField]);

  return (
    <NetSchemeComponent
      hostViewModels={data}
      addHostViewModel={addHostViewModel}
      isEditable={open}
      openSettings={openSettings}
    />
  );
};

export default NetSchemeContainer;
