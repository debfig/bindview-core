/**
 * 在末尾添加节点
 * @param {*} newVnode 新的子节点数组
 * @param {*} fatherNode 父节点
 */
export default function (newVnode, fatherNode) {
  let _this = this
  let oldNodeKey = fatherNode.key;
  let oldElement = _this._KeyMapDom.get(oldNodeKey);
  let newNodeKey = newVnode[newVnode.length - 1];
  oldElement.appendChild(_this._loopCreateNode(newNodeKey));
}
