import "./index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { OpenSettingsContextProvider } from "./contexts/open-settings.context";
import { FormsContextProvider } from "./contexts/form.context";
import AppLayoutContainer from "./components/app-layout/app-layout.container";
import Logger from "./utils/renderer-logger.utils";

const appElement: HTMLElement = document.getElementById("app");
if (appElement) {
  window.api.listenMainLogs(Logger.log);

  ReactDOM.createRoot(appElement).render(
    <Provider store={store}>
      <OpenSettingsContextProvider>
        <FormsContextProvider>
          <AppLayoutContainer />
        </FormsContextProvider>
      </OpenSettingsContextProvider>
    </Provider>,
  );
} else {
  throw new Error("#app not found");
}
