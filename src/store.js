import { observable, action, extendObservable } from "mobx";
import uniqueId from "lodash/uniqueId";

class Store {
  constructor() {
    extendObservable(this, {
      layers: [],
      selectedLayer: null,
      dragging: null,
      style: {
        radius: 10,
        stroke: 2,
        color: "#fff"
      },
      dimensions: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
    });

    // Create default layer
    this.addLayer();
  }

  mouseEventToCoordinates = e => {
    return {
      x: e.pageX - this.dimensions.left,
      y: e.pageY - this.dimensions.top
    };
  }

  setDimensions = action(dims => {
    this.dimensions = dims;
  });

  addLayer = action(() => {
    const layer = observable({
      id: uniqueId(),
      nodes: []
    });

    this.layers.push(layer);
    this.selectedLayer = layer;
  });

  addLabel = action(position => {
    const label = observable({
      id: uniqueId(),
      label: 'New label',
      p1: { ...position },
      p2: { ...position }
    });

    this.selectedLayer.nodes.push(label);
    this.startNodeDrag({
      node: label.p2,
      from: { ...position }
    });
  });

  startNodeDrag = action(opts => {
    this.dragging = {
      node: opts.node,
      from: opts.from
    };
  });

  dragTo = action(position => {
    const { node, from } = this.dragging;
    node.x = node.x + position.x - from.x;
    node.y = node.y + position.y - from.y;
    this.dragging.from = position;
  });

  dragEnd = action(() => {
    this.dragging = null;
  });
}

export default Store;
