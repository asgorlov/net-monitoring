import React from "react";
import "./App.scss";
import { Button } from "antd";

function App(): JSX.Element {
  function test(): void {
    window.api
      .sendMessage("toMain", { some: "data" })
      .then((response: any) => console.log(response))
      .catch((error: any) => console.error(error));
  }

  return (
    <div>
      <h1 className="app-layout">Hello from React and Electron!</h1>
      <Button onClick={test}>Test</Button>
    </div>
  );
}

export default App;
