import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { subtract, normalize, add, length, multiplyScalar } from "./vector";

const intersect = function(origin, radius, otherLineEndPoint) {
  var v = normalize(subtract(otherLineEndPoint, origin));
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

    const { p1, p2, label } = node;

    const onMouseDownPoint1 = e => {
      store.startNodeDrag({
        node: p1,
        from: store.mouseEventToCoordinates(e)
      });
      e.stopPropagation();
    };

    const onMouseDownPoint2 = e => {
      store.startNodeDrag({
        node: p2,
        from: store.mouseEventToCoordinates(e)
      });
      e.stopPropagation();
    };

    const anchor = p1.x > p2.x ? "start" : "end"

    const onLabelClick = e => {
      const {top, left, right, height} = e.currentTarget.getBoundingClientRect();

      const rect = {top, height};
      if (anchor === 'start') {
        rect.left = left;
        rect.right = 0;
        rect.width = 'auto';
        rect.textAlign = "left";
      }
      else {
        rect.left = 0;
        rect.width = right;
        rect.textAlign = "right";
      }

      store.startLabelEdit({
        node,
        rect
      });
      e.stopPropagation();
    }

    let offset = radius + (stroke * 2);
    if (p1.x <= p2.x) offset *= -1;

    return (
      <g>
        <g transform={`translate(${p1.x + offset} ${p1.y})`}>
          <text
            onMouseDown={onLabelClick}
            x={0}
            y={0}
            dominant-baseline="central"
            style={{ fill: color, whiteSpace: 'pre' }}
            textAnchor={anchor}
          >
            {label.split('\n').map((l, i) => <tspan x={0} y={`${i * 1.2}em`}>{l}</tspan>)}
          </text>
        </g>
        {line}
        <circle
          onMouseDown={onMouseDownPoint1}
          cx={p1.x}
          cy={p1.y}
          r={radius}
          style={{ stroke: color, strokeWidth: stroke, fill: "transparent" }}
        />
        <circle
          onMouseDown={onMouseDownPoint2}
          cx={p2.x}
          cy={p2.y}
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
