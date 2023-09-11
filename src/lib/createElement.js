import { err } from "../tools"
// 导入字典
import { NAME_SPACE, CUSTOM_ATTR, GLOBAL_ATTRIBUTES, EVENT_HANDLERS, HTML_TAGS } from "../tools/dict"

/**
 * 将虚拟节点创建为真实节点
 * @param {*} tagName 标签名
 * @param {*} props 标签属性
 * @param {*} key key 唯一ID
 * @param  {...any} childNodes 子节点
 * @returns 
 */
export default function createElement(tagName, props = {}, key, ...childNodes) {

  if (props === null) {
    props = {}
  }
  const tag = HTML_TAGS[tagName]
  const object = typeof tag === 'object'
  const localAttrs = object ? tag.attributes || {} : {}
  const attrs = Object.assign({}, GLOBAL_ATTRIBUTES, localAttrs)
  const tagType = object ? tag.name : tag

  // 创建DOM元素并添加Key值
  let el = null;
  if (tagType === undefined) {
    // 判断是不是命名空间标签
    if (tagName in NAME_SPACE) {
      el = NAME_SPACE[tagName]();
    } else if (tagName in this._module) {
      // 判断是不是组件标签 是组件标签的创造组件传递组件参数后 return 
      // 给组件添加唯一id
      let newProps = props.id ? props : { ...props, id: this._uuid() }
      return this._initComponents(this._module[tagName], newProps, childNodes);
    } else {
      err(`没有注册 ${tagName} 这个组件`)
    }
  } else {
    el = document.createElement(tagType);
  }
  this._KeyMapDom.set(key, el);

  // 对属性进行操作
  Object.keys(props).forEach(prop => {
    if (prop in attrs) {
      switch (prop) {
        case "xlink:href":
          el.setAttributeNS('http://www.w3.org/1999/xlink', prop, props[prop]);
          break;
        case "value":
          if ("value" in el) {
            if (el.tagName === "SELECT") {
              Promise.resolve().then(function () {
                el.value = props[prop]
              })
            } else {
              el.value = props[prop]
            }
          } else {
            el.setAttribute(attrs[prop], props[prop]);
          }
          break
        default:
          el.setAttribute(attrs[prop], props[prop]);
          break;
      }
    }
    if (prop in EVENT_HANDLERS) {
      if (props[prop] instanceof Array && props[prop].length > 1) {
        let callbackData = [];
        for (let i = 1; i <= props[prop].length - 1; i++) {
          callbackData.push(props[prop][i])
        }
        el.addEventListener(EVENT_HANDLERS[prop], function (e) {
          props[prop][0](this, e, ...callbackData);
        })
      } else if (props[prop] instanceof Array && props[prop].length == 1) {
        props[prop][0] instanceof Function ? true : err(`${JSON.stringify(props[prop])} 应为 Function`)
        el.addEventListener(EVENT_HANDLERS[prop], function (e) {
          props[prop][0](this, e);
        })
      } else if (props[prop] instanceof Function) {
        el.addEventListener(EVENT_HANDLERS[prop], function (e) {
          props[prop](this, e);
        })
      } else {
        err(`${JSON.stringify(props[prop])} 不正确`)
      }

    }
    if (prop in CUSTOM_ATTR) {
      switch (prop) {
        case 'ref':
          CUSTOM_ATTR[prop].call(this, props[prop], el)
          break;
      }
    }
    // 标签上自定义属性的添加
    if (!(prop in attrs || prop in EVENT_HANDLERS || prop in CUSTOM_ATTR)) {
      el.setAttribute(prop, props[prop])
    }
  })
  if ('style' in props) {
    const styles = props.style
    Object.keys(styles).forEach(prop => {
      const value = styles[prop]
      if (typeof value === 'number') {
        el.style[prop] = `${value}px`
      } else if (typeof value === 'string') {
        el.style[prop] = value
      } else {
        throw new Error(`[bindview] 应为 number 或 string ，但收到 "${typeof value}"`)
      }
    })
  }
  childNodes.forEach(childNode => {
    if (typeof childNode === 'object') {
      el.appendChild(childNode)
    } else if (typeof childNode === 'string' || typeof childNode === "number") {
      el.appendChild(document.createTextNode(childNode))
    } else {
      throw new Error(`[bindview] 应为 object 或 string ，但收到 "${typeof value}"`)
    }
  })
  return el;
}