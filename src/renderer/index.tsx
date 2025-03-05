import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// toDo:
//  4) добавить antd + работа с svg

const appElement: HTMLElement = document.getElementById("app");
if (appElement) {
  ReactDOM.createRoot(appElement).render(<App />);
} else {
  throw new Error("#app not found");
}
