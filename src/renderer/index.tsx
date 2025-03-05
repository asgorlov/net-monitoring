import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// toDo:
//  2) добавить redux-toolkit
//  3) добавить sass

const appElement: HTMLElement = document.getElementById("app");
if (appElement) {
  ReactDOM.createRoot(appElement).render(<App />);
} else {
  throw new Error("#app not found");
}
