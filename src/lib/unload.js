/**
 * 卸载组件
 */
export default function () {
  // 生命周期调用
  if (this.life.unLoading) { this.life.unLoading.call(this) };
  this.el.remove()
}