import React, { FC, useCallback } from "react";
import NetSchemeComponent from "./net-scheme.component";
import { useSchemeFormContext } from "../../contexts/form.context";
import useOpenSettingsContext from "../../contexts/open-settings.context";
import { SchemeFormAction } from "../../constants/form.constants";
import { HostType } from "../../constants/common.constants";

const NetSchemeContainer: FC = () => {
  const { data, setField } = useSchemeFormContext();
  const { open, setOpen } = useOpenSettingsContext();

  const openSettings = useCallback(() => setOpen(true), [setOpen]);

  const addHostViewModel = useCallback(() => {
    setField(
      {
        id: crypto.randomUUID(),
        type: HostType.SW,
        name: "",
        host: "",
        parentId: null,
        childIds: [],
        errors: []
      },
      SchemeFormAction.ADD
    );
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
