import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ThemeStore } from "./stores/theme_store";

const ts = new ThemeStore();

ReactDOM.render(<App themeStore={ts} />, document.querySelector(".root"));

//@ts-ignore
if (import.meta.hot) {
  //@ts-ignore

  import.meta.hot.accept();
}
