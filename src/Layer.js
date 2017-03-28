import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { subtract, length, normalize, add, multiplyScalar } from "./vector";

const intersect = function(origin, radius, otherLineEndPoint) {
  var v = subtract(otherLineEndPoint, origin);
  var lineLength = length(length);
  if (lineLength === 0) throw new Error("Length has to be positive");
  v = normalize(v);
  return add(origin, multiplyScalar(v, radius));
};

const Node = inject("store")(
  observer(function({ store, node }) {
    let line = null;
    const l = length(subtract(node.p1, node.p2));

    const { radius, stroke, color } = store.style;
    const LINE_DISTANCE = radius + stroke * 2;

    if (l > LINE_DISTANCE * 2) {
      const p1 = intersect(node.p1, LINE_DISTANCE, node.p2);
      const p2 = intersect(node.p2, LINE_DISTANCE, node.p1);
      line = (
        <line
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          style={{ stroke: color, strokeWidth: stroke }}
        />
      );
    }

    const onMouseDownPoint1 = e => {
      store.startNodeDrag(node.p1);
      e.stopPropagation();
    }

    const onMouseDownPoint2 = e => {
      store.startNodeDrag(node.p2);
      e.stopPropagation();
    }

    return (
      <g>
        {line}
        <circle
          onMouseDown={onMouseDownPoint1}
          cx={node.p1.x}
          cy={node.p1.y}
          r={radius}
          style={{ stroke: color, strokeWidth: stroke, fill: "transparent" }}
        />
        <circle
          onMouseDown={onMouseDownPoint2}
          cx={node.p2.x}
          cy={node.p2.y}
          r={radius}
          style={{ stroke: color, strokeWidth: stroke, fill: "transparent" }}
        />
      </g>
    );
  })
);

class Layer extends Component {
  static displayName = "Layer";

  render() {
    const { layer } = this.props;

    const lines = layer.nodes.map(n => <Node key={n.id} node={n} />);

    return (
      <svg style={{ width: "100%", height: "100%" }}>
        {lines}
      </svg>
    );
  }
}

export default inject("store")(observer(Layer));
