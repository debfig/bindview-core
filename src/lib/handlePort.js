/**
  * 处理子组件向外暴露的接口，挂载到父组件的port属性上
  * @param {Object} Components 子组件实例
  */
export default function (Components) {
  if (Object.keys(Components._modulePort).length > 0) {
    for (let port in Components._modulePort) {
      this.port[port] = Components._modulePort[port];
    }
  }
}