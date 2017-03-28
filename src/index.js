import React from "react";
import { render } from "react-dom";

import { Provider } from "mobx-react";

import App from "./App";
import "./index.css";

import Store from "./store";

// import { useStrict } from "mobx";
// useStrict(true);

const store = new Store();
window.store = store;

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
