/**
 * send 方法
 * @param {Object|Array} source 数据源 
 * @param {String|Number} item 项
 */
export default function (source, item) {
  return {
    source,
    item,
    get() {
      return this.source[this.item]
    },
    set(newValue) {
      if (this.source instanceof Array) {
        typeof newValue === 'function' ? this.source.splice(this.item, 1, newValue(this.get())) : this.source.splice(this.item, 1, newValue);
      } else if (this.source instanceof Object) {
        typeof newValue === 'function' ? this.source[this.item] = newValue(this.get()) : this.source[this.item] = newValue;
      }
    }
  }
}