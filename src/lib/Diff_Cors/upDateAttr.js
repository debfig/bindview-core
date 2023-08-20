import { warn } from "../../tools";
import { EVENT_HANDLERS } from "../../tools/dict"

/**
 * 更新属性
 * @param {*} key key
 * @param {*} value 要更新的属性
 * @param {*} attr 新值的提供者
 */
export default function (key, value, attr) {
  let _this = this
  let dom = _this._KeyMapDom.get(key);
  switch (value) {
    case 'ref':
      ((ref, el) => {
        if (_this.refs[ref] instanceof HTMLElement) {
          let temp = new Array(_this.refs[ref]);
          temp.push(el)
          _this.refs[ref] = temp;
        } else if (_this.refs[ref] instanceof Array) {
          _this.refs[ref].push(el)
        } else {
          _this.refs[ref] = el;
        }
      })(attr[value], dom);
      warn("动态修改 ref 属性,非常非常不推荐使用");
      break;
    case 'value':
      // if (dom.tagName === "INPUT" || dom.tagName === "TEXTAREA") {
      //   dom.value = attr[value]
      // }
      if ("value" in dom) {
        dom.value = attr[value]
      } else {
        dom.setAttribute(value, attr[value]);
      }
      break
    case 'key':
      break;
    default:
      if (!(value in EVENT_HANDLERS)) {
        dom.setAttribute(value, attr[value]);
      }
      break
  }
}