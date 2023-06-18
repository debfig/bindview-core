/**
 * 旧子节点为空，新字节数量大于1添加，节点
 * @param {*} fatherNode 父节点
 * @param {*} newVnode 新的子节点数组
 */
export default function (fatherNode, newVnode) {
  let _this = this
  let fatherElement = _this._KeyMapDom.get(fatherNode.key);
  for (let i of newVnode) {
    fatherElement.appendChild(_this._loopCreateNode(i));
  }
}