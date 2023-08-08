/**
 * 移除节点
 * @param {*} newVnode 新的子节点数组
 * @param {*} oldVnode 旧的子节点数组
 */
export default function (newVnode, oldVnode) {
  let _this = this
  // 筛选出新旧子节点不同的节点的Key
  function getNewArr(a, b) {
    console.log(1);
    const arr = [...a, ...b];
    const newArr = arr.filter(item => {
      return !(a.includes(item) && b.includes(item));
    });
    return newArr;
  }

  /**
   * 删除节点和移除_KeyMapDom中的键值映射
   * @param {*} Vnode 虚拟DOm 
   */
  function deleteELement(Vnode) {
    let DOM = _this._KeyMapDom.get(Vnode.key)
    DOM.remove();
    _this._KeyMapDom.delete(Vnode.key);
    if (!Vnode.type) {
      Vnode.children.forEach(i => {
        deleteELement(i);
      })
    }
  }

  // 获取所有新子节点的Key
  let newKey = newVnode.map(i => {
    return i.key;
  });
  //获取所有旧子节点的Key
  let oldKey = oldVnode.map(i => {
    return i.key
  })

  if (newKey.length === 0) {
    deleteELement(oldVnode[0])
  } else {
    getNewArr(newKey, oldKey).forEach(i => {
      for (let k = 0; k < oldVnode.length; k++) {
        if (oldVnode[k].key === i) {
          deleteELement(oldVnode[k])
        }
      }
    })
  }
}