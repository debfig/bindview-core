// tools 
import send from "./tools/send"

// 导入构造函数
import bindview from "./lib/bindview";

// 向外暴构造函数
export default bindview

const Bindview = bindview
// 工具
export {
  Bindview,
  send
}