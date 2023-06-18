/**
 * 在首位添加节点
 * @param {*} fatherNode 父节点
 * @param {*} newVnode 新的子节点数组
 * @param {*} oldVnode 旧的子节点数组
 */
export default function (fatherNode, newVnode, oldVnode) {
  let _this = this
  let fatheElement = _this._KeyMapDom.get(fatherNode.key);
  let oldElement = _this._KeyMapDom.get(oldVnode[0].key)
  fatheElement.insertBefore(_this._loopCreateNode(newVnode[0]), oldElement)
}