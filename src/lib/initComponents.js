/**
 * 初始化组件对象
 * @param {*} module 组件
 * @param {*} prop 组件参数
 */
export default function (module, prop, slot) {
  let _this = this
  let Component = new Object();
  // 组件函数的this将指向这个对象
  const config = {
    slot: (function () {
      if (slot.length && slot.length > 1) {
        return () => slot;
      } else if (slot.length && slot.length === 1) {
        if (slot[0] instanceof Function) {
          return slot[0];
        } else {
          return () => slot[0];
        }
      } else {
        return null;
      }
    })(),
  }

  Component.__proto__ = this.__proto__;
  if (module instanceof Function) {
    let moduleExample = module.call(config, prop);
    moduleExample.isModule = true;
    Component._Init(moduleExample)
    this._Components.push(Component)
  }
  this._handlePort(Component);
  return Component.el;
}