import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ThemeStore } from "./stores/theme_store";
import { VideoStore } from "./stores/video_store";
import { BrowserRouter as Router } from "react-router-dom";

const ts = new ThemeStore();
const vs = new VideoStore();

//@ts-ignore
export const IS_DEV: string = import.meta.env.NODE_ENV;

ReactDOM.render(
  <Router>
    <App videoStore={vs} themeStore={ts} />,
  </Router>,
  document.querySelector(".root")
);

//@ts-ignore
if (import.meta.hot) {
  //@ts-ignore

  import.meta.hot.accept();
}
