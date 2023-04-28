/**
 * 使用 _createElement 函数 将所有虚拟节点创建为真实节点 
 * @param {*} Vnode Vnode
 * @returns 虚拟节点创建的真实节点
 */
export default function (Vnode) {
  let _this = this;
  let Element = null;
  if (Vnode.children.length > 0) {
    function bianli(Vnode) {
      let temp = [];
      Vnode.children.forEach(i => {
        //typeof i === 'string' || typeof i === 'number'
        // 如果子节点为文本节点在此直接创建
        if (i.type ? i.type === 'text' : false) {
          let textNode = document.createTextNode(i.value);
          textNode.key = i.key;
          _this._KeyMapDom.set(i.key, textNode);
          temp.push(textNode)
        } else if (typeof i === 'object') {
          if (i.children ? i.children.length > 0 : false) {
            temp.push(_this._createElement(i.elementName, i.attributes, i.key, ...bianli(i)))
          } else {
            temp.push(_this._createElement(i.elementName, i.attributes, i.key, ...i.children))
          }
        }
      })
      return temp;
    }
    Element = _this._createElement(Vnode.elementName, Vnode.attributes, Vnode.key, ...bianli(Vnode))
  } else {
    Element = _this._createElement(Vnode.elementName, Vnode.attributes, Vnode.key, ...Vnode.children)
  }
  return Element;
}