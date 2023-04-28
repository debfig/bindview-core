/**
 * 添加代理对象 data 原型属性和方法
 * @param {*} name 属性名
 * @param {*} value 属性值 
 */
export default function (name, value) {
  Object.defineProperty(this._dataProto, name, {
    value,
    writable: true,
    enumerable: false,
    configurable: true
  });
}