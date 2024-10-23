import React, { useState } from "react";
import AppLayoutComponent from "./app-layout.component";

const AppLayoutContainer = () => {
  const [open, setOpen] = useState(false);

  return <AppLayoutComponent open={open} setOpen={setOpen} />;
};

export default AppLayoutContainer;
