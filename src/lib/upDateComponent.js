/**
 * 组件更新函数
 */
export default function () {
  //* 生命周期调用
  if (this.life.upDate) { this.life.upDate.call(this) };

  this._Components.forEach(item => {
    if (item._linkage) {
      item._upDate();
      // 当数据发生改变依次调用后代组件的更新函数
      item._upDateComponent();
    }
  })
}