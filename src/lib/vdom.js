import uuid from "./uuid"

/**
 * Vnode 构造函数 , 元素节点
 * @param {*} elementName elementName
 * @param {*} attributes attributes
 * @param {*} children children
 * @param {*} key key
 */
function Vnode(elementName, attributes, children, key) {
  this.elementName = elementName ? elementName : "div"
  this.attributes = attributes ? attributes : {}
  this.children = children ? children : []
  this.key = key ? key : null
}

/**
 * Vtext 构造函数 , 文本节点
 * @param {*} type type
 * @param {*} key key 
 * @param {*} value value
 */
function Vtext(type, key, value) {
  this.type = type ? type : "text"
  this.key = key ? key : uuid()
  this.value = typeof value === "string" || typeof value === "number" ? value : ""
}


export { Vnode, Vtext }
