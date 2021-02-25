import React from "react";
import { ThemeStore } from "./stores/theme_store";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.scss";
import { Homepage } from "./components/Homepage/homepage";

type Props = {
  themeStore: ThemeStore;
};
export const App = observer(({ themeStore }: Props) => {
  const { theme } = themeStore;
  return (
    <div
      className="app"
      style={{ backgroundColor: theme.bgColor, color: theme.color }}
    >
      <Router>
        <Switch>
          <Route component={() => <Homepage theme={theme} />} path="/" />
        </Switch>
      </Router>
    </div>
  );
});
