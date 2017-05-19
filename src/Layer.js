import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { subtract, normalize, add, length, multiplyScalar } from "./vector";

const intersect = function(origin, radius, otherLineEndPoint) {
  var v = normalize(subtract(otherLineEndPoint, origin));
  return add(origin, multiplyScalar(v, radius));
};

class TextArea extends Component {
  componentDidUpdate() {
    this.resize();
  }

  componentDidMount() {
    this.resize();
  }

  resize() {
    requestAnimationFrame(() => {
      const scrollHeight = this.el.scrollHeight;
    });
  }

  render() {
    const {props} = this;
    return (
      <textarea ref={c => this.el = c} {...props} />
    );
  }
}

const NodeText = inject("store")(
  observer(function({ store, node }) {
    const { radius, stroke, color } = store.style;

    const { p1, p2 } = node;

    let offset = radius + stroke * 2;
    if (p1.x <= p2.x) offset *= -1;

    const left = p1.x + offset;
    const top = p1.y;

    return (
      <textarea
        onMouseDown={e => e.stopPropagation()}
        onBlur={store.stopLabelEdit}
        style={{
          transform: 'translateY(-50%)',
          color,
          left,
          top,
          background: "transparent",
          position: "absolute",
          resize: "none",
          border: "none",
          outline: "none"
        }}
        value={node.label}
        onChange={e => store.setLabel(node, e.target.value)}
      />
    );
  })
);

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

    const { p1, p2 } = node;

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

    return (
      <g>
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
    const text = layer.nodes.map(n => <NodeText key={n.id} node={n} />);

    return (
      <div>
        <svg style={{ width: "100%", height: "100%", position: "absolute" }}>
          {lines}
        </svg>
        {text}
      </div>
    );
  }
}

export default inject("store")(observer(Layer));
