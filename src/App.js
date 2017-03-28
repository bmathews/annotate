import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import Canvas from "./Canvas";

class App extends Component {
  render() {
    return (
      <div style={{ height: "100%" }}>
        <Canvas />
      </div>
    );
  }
}

export default inject("store")(observer(App));
