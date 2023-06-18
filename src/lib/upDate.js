/**
 * 更新函数 代理数据发生改变调用
 */
export default function () {

  // 通过node获取最新的虚拟DOM
  let Original = this._handleJSXVonde(this._Original.get('_Original_Vnode').node.call(this.data, this._h));

  /**
   * 处理循环创建的 Vnode, 循环遍历创建的Vnode带有Key属性
   * @param {*} oldChildren 旧的子节点
   * @param {*} newChildren 新的子节点
   */
  function loopNode(oldChildren, newChildren) {
    for (let i = 0; i < oldChildren.length; i++) {
      for (let j = 0; j < newChildren.length; j++) {
        if (oldChildren[i].attributes.key === newChildren[j].attributes.key) {
          newChildren[j].key = oldChildren[i].key;
          if (newChildren[j].children) {
            for (let k = 0; k < newChildren[j].children.length; k++) {
              bianli(newChildren[j].children[k], oldChildren[i].children[k])
            }
          }
          continue;
        }
      }
    }
  }

  /**
   * 将旧的key赋值给新的Vnode
   * @param {*} newValue newVnode
   * @param {*} oldValue oldVnode
   */
  function bianli(newValue, oldValue) {
    // 新获取的Vnode没有key将旧的key 赋值给新的 
    if (oldValue != undefined) {
      if (oldValue.type && oldValue.type === "text") {
        newValue.key = oldValue.key;
      } else {
        newValue.key = oldValue.key;
        if (newValue.children ? newValue.children.length > 0 : false) {
          if (newValue.children[0].attributes ? newValue.children[0].attributes.key !== undefined ? true : false : false) {
            loopNode(oldValue.children, newValue.children);
          } else {
            for (let i = 0; i < newValue.children.length; i++) {
              bianli(newValue.children[i], oldValue.children[i])
            }
          }
        }
      }
    }
  }
  bianli(Original, this._oldVnode);

  // 数据改变后获取新的Vnode 
  this.Vnode = Original;

  // 调用DIFF更新
  this._diffUpdateView(this._oldVnode, this.Vnode)
}