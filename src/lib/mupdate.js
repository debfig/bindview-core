/**
 * 手动更新视图
 * @param {*} callback 
 */
export default function (callback) {
  let _this = this
  if (callback && typeof callback === 'function') {
    callback.call(_this)
    Promise.resolve().then(function () {
      _this._upDate();
    })
  } else {
    Promise.resolve().then(function () {
      _this._upDate();
    })
  }
}