import { err } from "../tools"
/**
 * 初始化 bindview
 * @param {*} config 配置项
 */
export default function (config) {

  // name 属性
  if (config.name) this.name = config.name;

  // 父组件data更新后对子组件的更新控制
  this._linkage = config.linkage !== undefined ? config.linkage : true;

  // 创建用于获取原始 Vnode 的Map映射
  this._Original = new Map();
  //映射dom树
  this._Original.set('_Original_Vnode', config);

  this.el = config.el instanceof HTMLElement ? config.el : typeof config.el === "string" ? document.querySelector(config.el) : null;

  // 生命周期
  this.life = config.life !== undefined ? config.life : new Object();

  // 代理数据
  this.data = config.data !== undefined ? this._proxyData(this._createData(), config.data, this._upDate) : this._createData()

  // methods方法对象
  this.methods = typeof config.methods === 'object' ? this._mountMethods(config.methods) : new Object();

  // 获取JSXVnode并对子节点为文本的进行处理
  this.Vnode = config.node ? config.node instanceof Function ? this._handleJSXVonde(config.node.call(this.data, this._h)) : err('config.node 必须是 Function 类型的') : err('config.node 为 null');

  // 记录旧的Vnode, 初始化时没有旧节点直接克隆一份
  this._oldVnode = this._deepClone(this.Vnode);

  // 获取Dom元素
  this.refs = new Object();

  // DOM的键值映射 
  this._KeyMapDom = new Map();

  // 当前对象是不是一个组件
  this.isModule = config.isModule !== undefined ? config.isModule : false;

  // 将子组件的接口挂载在port上
  this.port = new Object();
  // 向外暴露接口
  this._modulePort = config.modulePort ? this._handlePotrThis(config.modulePort) : new Object();

  // 组件key
  this._moduleKey = this.isModule ? this._uuid() : 'Root';

  //Map记录子组件
  this._Components = new Map();

  //组件初始化
  let module = config.module !== undefined ? { ...config.module } : new Object();
  module.__proto__ = this._publicComponents;
  this._module = module;

  //将创建好的节点添加到容器中
  this.isModule ? this.el = this._loopCreateNode.call(this, this.Vnode) : this.el.appendChild(this._loopCreateNode.call(this, this.Vnode))

  // 生命周期调用
  if (this.life.createDom) { this.life.createDom.call(this) };
}