import { warn } from "../tools";

/**
 * 向原型对象上挂载属性或方法
 * @param {*} name 属性名或Object
 * @param {*} value 属性值
 */
export default function (name, value) {
  switch (arguments.length) {
    case 1:
      if (name instanceof Object && typeof name === 'object') {
        if (Object.keys(name).length > 0) {
          for (let i in name) {
            this.prototype[i] = name[i]
          }
        }
      } else {
        warn('参数应为 Object 类型');
      }
      break;
    case 2:
      if (typeof name === 'string') {
        this.prototype[name] = value;
      } else {
        warn('属性名不正确');
      }
      break;
    default:
      warn('传入参数数量不正确')
      break;
  }
}