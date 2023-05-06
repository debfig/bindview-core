/**
 * 获取 dom 节点下文本节点文本
 * @param {*} dom 
 * @returns 
 */
export default function (dom) {
  return dom['childNodes'][0].nodeValue
}