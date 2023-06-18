/**
 * 更新文本节点
 * @param {*} key key
 * @param {*} value new Value
*/
export default function (key, value) {
  let _this = this
  let dom = _this._KeyMapDom.get(key);
  dom.nodeValue = value
}