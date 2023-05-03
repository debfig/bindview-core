import { NAME_SPACE, HTML_TAGS } from "../tools/dict"
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
            // 判断tagName是不是组件是组件的话，组件中的子节点不会被创建为DOM,传递给 _createElement 函数，为啥直接将虚拟DOM传递给 _createElement 函数
            if ((i.elementName in HTML_TAGS) || (i.elementName in NAME_SPACE)) {
              temp.push(_this._createElement(i.elementName, i.attributes, i.key, ...bianli(i)))
            } else {
              temp.push(_this._createElement(i.elementName, i.attributes, i.key, ...i.children))
            }
            // console.log(i.elementName, i.children);
            // temp.push(_this._createElement(i.elementName, i.attributes, i.key, ...bianli(i)))
          } else {
            temp.push(_this._createElement(i.elementName, i.attributes, i.key, ...i.children))
          }
        }
      })
      return temp;
    }

    // 判断tagName是不是组件是组件的话，组件中的子节点不会被创建为DOM,传递给 _createElement 函数，为啥直接将虚拟DOM传递给 _createElement 函数
    if ((Vnode.elementName in NAME_SPACE) || (Vnode.elementName in HTML_TAGS)) {
      Element = _this._createElement(Vnode.elementName, Vnode.attributes, Vnode.key, ...bianli(Vnode))
    } else {
      Element = _this._createElement(Vnode.elementName, Vnode.attributes, Vnode.key, ...Vnode.children)
    }
    // Element = _this._createElement(Vnode.elementName, Vnode.attributes, Vnode.key, ...bianli(Vnode))
  } else {
    Element = _this._createElement(Vnode.elementName, Vnode.attributes, Vnode.key, ...Vnode.children)
  }
  return Element;
}