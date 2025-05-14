import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import NetSchemeComponent from "./net-scheme.component";
import { SchemeFormAction } from "../../constants/form.constants";
import {
  addHostViewModel,
  modifyHostViewModel,
  removeHostViewModel,
} from "../../utils/host.util";
import { useSelector } from "react-redux";
import {
  selectHostViewModels,
  selectIsSettingsOpened,
  setIsSchemeTouched,
  setIsSettingsOpened,
} from "../../store/main.slice";
import { useAppDispatch } from "../../hooks/store.hooks";
import { HostViewModel } from "../../../shared/models/host.models";
import { SchemeForm } from "../../models/settings.models";

const NetSchemeContainer = forwardRef<SchemeForm>((_props, ref) => {
  const open = useSelector(selectIsSettingsOpened);
  const hostViewModels = useSelector(selectHostViewModels);

  const [scheme, setScheme] = useState(hostViewModels);

  const dispatch = useAppDispatch();

  const openSettings = useCallback(
    () => dispatch(setIsSettingsOpened(true)),
    [dispatch],
  );

  const changeScheme = useCallback(
    (
      value: HostViewModel,
      action: SchemeFormAction = SchemeFormAction.MODIFY,
    ) =>
      setScheme((prevState) => {
        if (action === SchemeFormAction.MODIFY) {
          const newScheme = { ...prevState };
          modifyHostViewModel(newScheme, value);
          dispatch(setIsSchemeTouched(true));

          return newScheme;
        }

        if (action === SchemeFormAction.ADD) {
          const newScheme = { ...prevState };
          addHostViewModel(newScheme, value);
          dispatch(setIsSchemeTouched(true));

          return newScheme;
        }

        if (action === SchemeFormAction.REMOVE) {
          const newScheme = { ...prevState };
          removeHostViewModel(newScheme, value);
          dispatch(setIsSchemeTouched(true));

          return newScheme;
        }

        return prevState;
      }),
    [dispatch],
  );

  useEffect(() => {
    if (!open) {
      setScheme(hostViewModels);
      dispatch(setIsSchemeTouched(false));
    }
  }, [open, hostViewModels, dispatch]);

  useImperativeHandle(ref, () => ({ data: scheme, setData: setScheme }), [
    scheme,
  ]);

  return (
    <NetSchemeComponent
      scheme={scheme}
      changeScheme={changeScheme}
      isEditable={open}
      openSettings={openSettings}
    />
  );
});

export default NetSchemeContainer;
