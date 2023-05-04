/**
 * 添加代理对象
 * @param {*} data 新添加数据
 */
export default function (data) {
  this._proxyData(this.data, data, this._upDate);
  // 添加后调用更新函数
  this._upDate()
}