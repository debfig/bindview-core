import { err, warn } from "../../tools";
/**
 * 更新节点
 * @param {*} oldVnode 旧虚拟节点
 * @param {*} newVnode 新虚拟节点
 */
export default function (oldVnode, newVnode) {
  let _this = this
  // replaceChild 替换节点
  let oldDom = oldVnode instanceof HTMLElement ? oldVnode : this._KeyMapDom.get(oldVnode.key);
  let newDom = _this._loopCreateNode(newVnode);
  try {
    oldDom.parentNode.replaceChild(newDom, oldDom)
  } catch (err) {
    warn(err)
  }


  // 清除KeyMapDom中的映射
  function deleteELement(Vnode) {
    if (Vnode.children && Vnode.children.length > 0) {
      for (let item in oldVnode) {
        _this._KeyMapDom.delete(item.key)
        if (item.children && item.children.length > 0) {
          deleteELement(item)
        }
      }
    } else {
      _this._KeyMapDom.delete(Vnode.key)
    }
  }
  oldDom instanceof HTMLElement ? true : deleteELement(oldDom)
}