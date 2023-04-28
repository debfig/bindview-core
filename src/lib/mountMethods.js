/**
 * 将 methods 挂载到 h 函数上
 * @param {*} methods methods配置项
 */
export default function (methods) {
  for (let i in methods) {
    this._h[i] = methods[i].bind(this)
  }
  return methods;
}