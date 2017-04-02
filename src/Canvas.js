import React, { Component } from "react";
import { reaction } from "mobx";
import { observer, inject } from "mobx-react";
import Layer from "./Layer";

class Canvas extends Component {
  static displayName = "Canvas";

  componentWillMount() {
    const { store } = this.props;
    this.disposer = reaction(
      () => store.dragging,
      dragging => {
        dragging ? this._addListeners() : this._removeListeners();
      }
    );
  }

  componentDidMount() {
    const { store } = this.props;
    const el = this.$root;
    store.setDimensions({
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight
    });
  }

  componentWillUnmount() {
    this.disposer();
  }

  _handleMouseDown = e => {
    const { store } = this.props;
    store.addLabel(store.mouseEventToCoordinates(e));
    e.preventDefault();
  };

  _handleMouseMove = e => {
    const { store } = this.props;
    store.dragTo(store.mouseEventToCoordinates(e));
    e.preventDefault();
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
    
    let editor;
    if (store.editingLabel) {
      const value = store.editingLabel.node.label;
      const {top, left, bottom, right, width, textAlign} = store.editingLabel.rect; 

      const inputStyle = {
        padding: 0,
        border: 'none',
        background: 'none',
        font: 'inherit',
        width: '100%',
        textAlign,
        whiteSpace: 'pre',
        overflow: 'hidden',
        height: '100%'
      };
      const style = {
        position: 'fixed',
        top,
        left,
        bottom,
        right,
        width,
        height: (value.split('\n').length + 1) * 1.2 + 'em'
      };
      editor = (
        <div style={style}>
          <textarea autoFocus ref={el => el ? el.focus() : null} key={store.editingLabel.node.id} onMouseDown={e => e.stopPropagation()} style={inputStyle} onChange={e => store.editingLabel.node.label = e.target.value} value={value} />
        </div>
      );
    }

    return (
      <div
        ref={this._setRef}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1485846753954-dff2171ddb2b?dpr=2&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=')",
          backgroundSize: "cover",
          height: "100%"
        }}
        onMouseDown={this._handleMouseDown}
      >
        {store.layers.map(l => <Layer layer={l} key={l.id} />)}
        {editor}
      </div>
    );
  }
}

export default inject("store")(observer(Canvas));
