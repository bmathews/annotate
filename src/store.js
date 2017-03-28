import { observable, action, extendObservable } from "mobx";
import uniqueId from "lodash/uniqueId";

class Store {
  constructor() {
    extendObservable(this, {
      layers: [],
      selectedLayer: null,
      draggingNode: null,
      style: {
        radius: 10,
        stroke: 2,
        color: '#fff'
      }
    });

    // Create default layer
    this.addLayer();
  }

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
      p1: { ...position },
      p2: { ...position }
    });

    this.selectedLayer.nodes.push(label);
    this.startNodeDrag(label.p2);
  });

  startNodeDrag = action(node => {
    this.draggingNode = node;
  });

  dragTo = action(position => {
    const node = this.draggingNode;
    Object.assign(node, position);
  });

  dragEnd = action(() => {
    this.draggingNode = null;
  });
}

export default Store;
