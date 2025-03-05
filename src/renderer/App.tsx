import React from "react";
import "./App.scss";

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
      <button onClick={test}>Test</button>
    </div>
  );
}

export default App;
