import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AppLayoutContainer from "./components/app-layout/app-layout.container";
import "./index.scss";
import { OpenSettingsContextProvider } from "./contexts/open-settings.context";
import { FormsContextProvider } from "./contexts/form.context";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <OpenSettingsContextProvider>
        <FormsContextProvider>
          <AppLayoutContainer />
        </FormsContextProvider>
      </OpenSettingsContextProvider>
    </Provider>
  </React.StrictMode>
);
