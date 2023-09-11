import { err } from "../tools"
/**
 * bindview构造函数
 * @param {*} config 配置项
 */
function Bindview(config) {
  if (!(this instanceof Bindview)) {
    err(new Error('bindview is a constructor and should be called with the `new` keyword'));
  } else {
    if (typeof config !== undefined && config instanceof Object) {
      this._Init(config);
      if (Bindview.dispalyVer) {
        console.log(`%c bindview.js %c v${Bindview.version} `,
          'background: #35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
          'background: #41b883; padding: 1px; border-radius: 0 3px 3px 0; color: #fff',);
      }
    }
  }
}

// 构造函数版本属性
Bindview.version = '2.1.4';

// 是否显示版本配置属性
Bindview.dispalyVer = true

// 导入挂载原型对象函数
import proto from "./proto";
Bindview.proto = proto;

// 导入和挂载初始化函数
import Init from "./Init";
Bindview.prototype._Init = Init;

// 代理数据的原型对象
Bindview.prototype._dataProto = Object.create(Object.prototype);

// 导入和挂载代理属性原型方法(属性)添加函数
import dataProto from "./dataProto";
Bindview.prototype.$dataProto = dataProto;

// 导入和挂载卸载组件函数
import unload from "./unload";
Bindview.prototype.$unload = unload;

// 导入和挂载安装组件函数
import mount from "./mount";
Bindview.prototype.$mount = mount;

// 导入创建data函数
import createData from "./createData";
Bindview.prototype._createData = createData;

// 导入和挂载新增响应数据的函数
import add from "./add"
Bindview.prototype.$add = add;

// 导入和挂载数据代理函数
import proxyData from "./proxyData";
Bindview.prototype._proxyData = proxyData;

// 导入和挂载 upDate 函数
import upDate from "./upDate"
Bindview.prototype._upDate = upDate;

// 导入和挂载UUID
import uuid from "./uuid"
Bindview.prototype._uuid = uuid;

// 导入和挂载h函数
import h from "./h";
Bindview.prototype._h = h;

// 导入JSX虚拟DOM处理函数
import handleJSXVonde from "./handleJSXVonde";
Bindview.prototype._handleJSXVonde = handleJSXVonde;

// 导入和挂载虚拟节点创建函数
import createElement from "./createElement"
Bindview.prototype._createElement = createElement

// 导入循环创建节点函数
import loopCreateNode from "./loopCreateNode";
Bindview.prototype._loopCreateNode = loopCreateNode

// 导入和挂载获取节点下的文本
import getTxt from "./getTxt"
Bindview.prototype.$getTxt = getTxt;

// 导入和挂载设置节点下的文本
import setTxt from "./setTxt";
Bindview.prototype.$setTxt = setTxt;

// 导入 Vnode 克隆函数
import deepClone from "./deepClone"
Bindview.prototype._deepClone = deepClone;

// 导入和挂载DIFF更新函数
// 旧的 DIFF 更新函数,已弃用
// import diffUpdateView from "./diffUpdateView";
import main from "./Diff_Cors/main"
Bindview.prototype._diffUpdateView = main;

// 全局组件
Bindview.prototype._publicComponents = Object.create(Object.prototype);

// 导入和挂载获初始化组件函数
import initComponents from "./initComponents";
Bindview.prototype._initComponents = initComponents;

// 导入和挂载获公共组件函数
import addModule from "./addModule";
Bindview.prototype.$addModule = addModule;

// 导入组件更新函数
import upDateComponent from "./upDateComponent"
Bindview.prototype._upDateComponent = upDateComponent;

// 导入组件接口处理函数
import handlePotrThis from "./handlePotrThis";
Bindview.prototype._handlePotrThis = handlePotrThis;

// 导入加载组件接口函数
import handlePort from "./handlePort";
Bindview.prototype._handlePort = handlePort;

// 清除组件实例
import clearModule from "./clearModule";
Bindview.prototype._clearModule = clearModule;

// 手动更新视图
import mupdate from './mupdate'
Bindview.prototype.$mupdate = mupdate;


// 向外暴露构造函数
export default Bindview;