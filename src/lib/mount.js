/**
 * 安装组件
 * @param {HTMLElement|String} container 容器
 * @param {Function} module 组件
 */
export default function (container, module) {
  const Container = container instanceof HTMLElement ? container : typeof container === "string" ? document.querySelector(container) : null;
  switch (arguments.length) {
    case 1:
      Container.appendChild(this.el)
      break;
    case 2:
      const component = new Object();
      component.__proto__ = this.__proto__
      if (!module.isModule) module.isModule = true;
      component._Init(module)
      Container.appendChild(component.el)
      return component;
  }
}