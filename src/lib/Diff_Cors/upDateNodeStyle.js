/**
  * 更新 DOM style
  * @param {*} key key 
  * @param {*} style style
  */
export default function (key, style, oldstyle) {
  let _this = this;
  let dom = _this._KeyMapDom.get(key);
  for (let i in style) {
    if (style[i] !== oldstyle[i]) {
      if (typeof style[i] === 'number') {
        dom.style[i] = `${style[i]}px`;
      }
      if (typeof style[i] === 'string') {
        dom.style[i] = style[i];
      }
    }
  }
}