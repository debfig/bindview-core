/**
 * 删除组件实例
 * @returns function
 */
export default function () {
  let _this = this;
  return (moduleKey) => {
    _this._Components.delete(moduleKey)
  }
}