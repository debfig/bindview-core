import { Bindview } from "..";
import uuid from "../lib/uuid";

/**
 * 创建应用
 * @param {Function} module 组件
 * @param {*} props props
 */
export default function createApp(module, props) {
  let App = new Object();
  App.__proto__ = Bindview.prototype
  let NewModule = module.call({ uuid }, Object.prototype.toString.call(props) === '[object Object]' ? props : {})
  NewModule.isModule = true
  return App._Init(NewModule)
}