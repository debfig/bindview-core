import { warn } from "../tools";

/**
 * 挂载公共组件
 * @param {*} ComponentsName 组件名
 * @param {*} Components 组件
 */
export default function (ComponentsName, Components) {
  switch (arguments.length) {
    case 1:
      if (arguments[0] instanceof Object && typeof arguments[0] === 'object') {
        for (let i in arguments[0]) {
          Object.defineProperty(this._publicComponents, i, {
            value: arguments[0][i],
            writable: true,
            enumerable: false,
            configurable: true
          });
        }
      } else {
        warn('$addModule 传递一个参数时只能为 Obiect');
      }
      break;
    case 2:
      if (typeof ComponentsName === 'string' && Components instanceof Function) {
        Object.defineProperty(this._publicComponents, ComponentsName, {
          value: Components,
          writable: true,
          enumerable: false,
          configurable: true
        });
      } else {
        warn(`组件或者组件名不正确`);
      }
      break
    default:
      warn('$addModule 传入的参数不正确');
      break;
  }
}