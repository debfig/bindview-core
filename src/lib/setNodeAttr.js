/**
 * 设置节点属性
 * @param {String} attrNme 属性名 
 * @param {any} attrValue 属性值
 * @param {HTMLElement} NodeElement 节点元素
 */
export default function setNodeAttr(attrNme, attrValue, NodeElement) {
  if (attrNme[0] === '_') {
    const splitAttrName = attrNme.split("_")[1]
    NodeElement[splitAttrName] = attrValue
  } else {
    NodeElement.setAttribute(attrNme, attrValue)
  }
}