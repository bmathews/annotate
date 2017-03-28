import React, { Component } from "react";
import { reaction } from "mobx";
import { observer, inject } from "mobx-react";
import Layer from "./Layer";

class Canvas extends Component {
  static displayName = "Canvas";

  componentWillMount() {
    const { store } = this.props;
    this.disposer = reaction(
      () => store.draggingNode,
      node => {
        node ? this._addListeners() : this._removeListeners();
      }
    );
  }

  componentWillUnmount() {
    this.disposer();
  }

  _coordsFromEvent = e => {
    return {
      x: e.pageX - this.$root.offsetLeft,
      y: e.pageY - this.$root.offsetTop
    };
  };

  _handleMouseDown = e => {
    const { store } = this.props;
    store.addLabel(this._coordsFromEvent(e));
  };

  _handleMouseMove = e => {
    const { store } = this.props;
    store.dragTo(this._coordsFromEvent(e));
  };

  _handleMouseUp = e => {
    const { store } = this.props;
    store.dragEnd();
  };

  // Stop listening to mouse move/up events.
  _removeListeners = () => {
    document.removeEventListener("mousemove", this._handleMouseMove);
    document.removeEventListener("mouseup", this._handleMouseUp);
  };

  // Start listening to mouse move/up, send events back to store.
  _addListeners = () => {
    document.addEventListener("mousemove", this._handleMouseMove);
    document.addEventListener("mouseup", this._handleMouseUp);
  };

  _setRef = el => {
    this.$root = el;
  };

  render() {
    const { store } = this.props;
    return (
      <div
        ref={this._setRef}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1485846753954-dff2171ddb2b?dpr=2&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=')",
          backgroundSize: 'cover',
          height: "100%"
        }}
        onMouseDown={this._handleMouseDown}
      >
        {store.layers.map(l => <Layer layer={l} key={l.id} />)}
      </div>
    );
  }
}

export default inject("store")(observer(Canvas));
