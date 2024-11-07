import React, { FC } from "react";
import NetSchemeComponent from "./net-scheme.component";
import { useSchemeFormContext } from "../../contexts/form.context";

const NetSchemeContainer: FC = () => {
  const { data } = useSchemeFormContext();

  return <NetSchemeComponent hostViewModels={data} />;
};

export default NetSchemeContainer;
