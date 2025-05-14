import React, { FC, useCallback } from "react";
import NetSchemeComponent from "./net-scheme.component";
import { useSchemeFormContext } from "../../contexts/form.context";
import { SchemeFormAction } from "../../constants/form.constants";
import { createEmptyHost } from "../../utils/host.util";
import { useSelector } from "react-redux";
import {
  selectIsSettingsOpened,
  setIsSettingsOpened,
} from "../../store/main.slice";
import { useAppDispatch } from "../../hooks/store.hooks";

const NetSchemeContainer: FC = () => {
  const open = useSelector(selectIsSettingsOpened);

  const dispatch = useAppDispatch();
  const { data, setField } = useSchemeFormContext();

  const openSettings = useCallback(
    () => dispatch(setIsSettingsOpened(true)),
    [dispatch],
  );

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
