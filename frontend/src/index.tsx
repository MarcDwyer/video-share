import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ThemeStore } from "./stores/theme_store";
import { VideoStore } from "./stores/video_store";

const ts = new ThemeStore();
const vs = new VideoStore();

ReactDOM.render(
  <App videoStore={vs} themeStore={ts} />,
  document.querySelector(".root")
);

//@ts-ignore
if (import.meta.hot) {
  //@ts-ignore

  import.meta.hot.accept();
}
