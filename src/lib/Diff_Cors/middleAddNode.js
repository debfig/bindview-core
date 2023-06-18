/**
 * 在中间添加节点
 * @param {*} fatherNode 父节点
 * @param {*} newVnode 新的子节点数组
 * @param {*} oldVnode 旧的子节点数组 
 */
export default function (fatherNode, newVnode, oldVnode) {
  let _this = this
  let fatheElement = _this._KeyMapDom.get(fatherNode.key);
  for (let i = 0; i < newVnode.length; i++) {
    if (newVnode[i].key !== oldVnode[i].key) {
      if (newVnode[i + 1].key === oldVnode[i].key) {
        let oldElement = _this._KeyMapDom.get(oldVnode[i].key)
        fatheElement.insertBefore(_this._loopCreateNode(newVnode[i]), oldElement)
        break;
      }
    }
  }
}