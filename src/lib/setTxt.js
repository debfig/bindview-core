/**
 * 设置dom下文本节点的值
 * @param {*} dom dom
 * @param {*} value 值
 * @returns 修改的值
 */
export default function (dom, value) {
  return dom['childNodes'][0].nodeValue = value;
}