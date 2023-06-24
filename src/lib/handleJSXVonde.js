/**
 * 对JSX的虚拟DOM进行处理,并在Vnode上添加UUID
 * @param {*} JSXVonde JsxVnode
 */
export default function (JSXVonde) {
  let newVnode = new Object();
  newVnode.elementName = JSXVonde.elementName;
  newVnode.attributes = JSXVonde.attributes;
  newVnode.key = this._uuid()
  if (typeof JSXVonde === "string" || typeof JSXVonde === "number") {
    return {
      type: 'text',
      key: this._uuid(),
      value: JSXVonde
    }
  }
  if (JSXVonde.children && JSXVonde.children.length && JSXVonde.children.length > 1) {
    newVnode.children = [];
    for (let i = 0; i < JSXVonde.children.length; i++) {
      newVnode.children[i] = (() => {
        if (typeof JSXVonde.children[i] === 'string' || typeof JSXVonde.children[i] === "number") {
          return {
            type: 'text',
            key: this._uuid(),
            value: JSXVonde.children[i]
          }
        } else if (JSXVonde.children[i].type && JSXVonde.children[i].type === 'text') {
          return JSXVonde.children[i];
        } else {
          return this._handleJSXVonde(JSXVonde.children[i])
        }
      })()
    }
  } else if (JSXVonde.children === null || JSXVonde.children[0] === undefined) {
    newVnode.children = [];
  } else if (typeof JSXVonde.children[0] === 'string' || typeof JSXVonde.children[0] === 'number') {
    newVnode.children = [];
    newVnode.children.push({
      type: 'text',
      key: this._uuid(),
      value: JSXVonde.children[0]
    });
  } else if (JSXVonde.children[0] instanceof Array) {
    newVnode.children = [];
    for (let i = 0; i < JSXVonde.children[0].length; i++) {
      newVnode.children.push(this._handleJSXVonde(JSXVonde.children[0][i]))
    }
  } else if (JSXVonde.children[0] instanceof Function) {
    newVnode.children = [];
    newVnode.children.push(JSXVonde.children[0]);
  } else if (JSXVonde.children[0] instanceof Object) {
    newVnode.children = [];
    newVnode.children[0] = (JSXVonde.children[0].type && JSXVonde.children[0].type === 'text') ? JSXVonde.children[0] : this._handleJSXVonde(JSXVonde.children[0]);
  }

  return newVnode;
}