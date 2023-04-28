/**
 * 处理对外暴露接口函数的this指向
 * @param {*} modulePort 暴露接口的配置对象
 * @returns 处理后的接口对象
 */
export default function (modulePort) {
  let portTemplate = new Object();
  if (Object.keys(modulePort).length > 0) {
    for (let i in modulePort) {
      if (modulePort[i] instanceof Function) {
        portTemplate[i] = modulePort[i].bind(this)
      }
    }
  }
  return portTemplate;
}