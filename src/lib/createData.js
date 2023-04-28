/**
 * 创建data函数
 * @returns data
 */
export default function () {
  let Vobject = new Object();
  Vobject.__proto__ = this._dataProto;
  return Vobject;
}