/**
 * 初始化组件对象
 * @param {*} module 组件
 * @param {*} prop 组件参数
 */
export default function (module, prop) {
  let Component = new Object();
  Component.__proto__ = this.__proto__;
  if (module instanceof Function) {
    let moduleExample = prop !== undefined ? prop instanceof Array ? module(...prop) : module(prop) : module();
    moduleExample.isModule = true;
    Component._Init(moduleExample)
    this._Components.push(Component)
  }
  this._handlePort(Component);
  return Component.el;
}