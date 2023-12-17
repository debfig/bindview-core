import { err, warn } from "../../tools";
import { NAME_SPACE, HTML_TAGS } from "../../tools/dict"


//更新节点函数
import upDateNode from "./upDateNode";

// 更新样式
import upDateStyle from "./upDateNodeStyle"

// 更新属性
import upDataAttr from "./upDateAttr"

// 更新文本节点
import upDateTextNode from "./upDateTextNode"

// 移除节点
import removeNode from "./removeNode"

// 末尾添加节点
import belowAddNode from './belowAddNode'

// 大量添加
import insertMaxNode from "./insertMaxNode"

// 头部添加
import headAddNode from "./headAddNode"

// 中间添加
import middleAddNode from "./middleAddNode"

/**
 * 虚拟DOM对比函数
 * @param {*} oldVnode 旧虚拟节点
 * @param {*} newVnode 新虚拟节点
 */
export default function (oldVnode, newVnode) {
  let _this = this
  // 使用遍历来依次比较差异
  for (let i in newVnode) {
    switch (i) {
      case "elementName":
        if (newVnode[i] in NAME_SPACE || newVnode[i] in HTML_TAGS && oldVnode[i] in NAME_SPACE || oldVnode[i] in HTML_TAGS) {
          if (oldVnode[i] !== newVnode[i]) {
            upDateNode.call(this, oldVnode, newVnode)
            // 此更新会重新创建节点不需要再比较其他的了
            return
          }
        } else {
          if (oldVnode[i] !== newVnode[i]) {
            // 判断旧节点是不是组件

            if (this._Components.get(oldVnode.attributes.id)) {
              upDateNode.call(_this, _this._Components.get(oldVnode.attributes.id).el, newVnode)
              // 卸载组件
              this._Components.get(oldVnode.attributes.id).$unload();
            } else {
              if (!!(newVnode['elementName'] in NAME_SPACE || newVnode['elementName'] in HTML_TAGS || newVnode['elementName'] in NAME_SPACE || newVnode['elementName'] in HTML_TAGS)) {
                upDateNode.call(_this, oldVnode, newVnode)
              }
            }
            // 此更新会重新创建节点不需要再比较其他的了
            return
          }
        }
        break;
      case "attributes":
        // 判断如果是组件不进行操作
        if (!!(newVnode['elementName'] in NAME_SPACE || newVnode['elementName'] in HTML_TAGS || newVnode['elementName'] in NAME_SPACE || newVnode['elementName'] in HTML_TAGS)) {
          // 将对象转换为 string 进行粗略比较
          if (JSON.stringify(oldVnode[i]) !== JSON.stringify(newVnode[i])) {
            for (let j in newVnode[i]) {
              // 对属性中的 style 进行处理
              if (j === 'style') {
                JSON.stringify(oldVnode[i]['style']) !== JSON.stringify(newVnode[i]['style']) ? upDateStyle.call(_this, newVnode.key, newVnode[i]['style'], oldVnode[i]['style']) : true;
              } else {
                // 判断属性，有差异调用 upDataAttr 更新
                oldVnode[i][j] !== newVnode[i][j] ? upDataAttr.call(_this, newVnode.key, j, newVnode[i]) : true;
              }
            }
          }
        }
        break;
      case "key":
        // 判断key是否发生改变一般不会被改变
        oldVnode[i] === newVnode[i] ? true : err('禁止动态的改变Key');
        break;
      case "children":
        if (((newVnode.elementName in HTML_TAGS) !== true || !(newVnode.elementName in NAME_SPACE) !== true) && (newVnode.elementName in _this._module)) {
          //TODO 该节点如果为组件节点不进行操作
          continue
        } else if (
          (newVnode.children.length === oldVnode.children.length) ||
          (newVnode.children.length === 1 && oldVnode.children[0] && oldVnode.children[0].type) ||
          (newVnode.children[0] && newVnode.children[0].type && oldVnode.children.length === 1)
        ) {
          //TODO 子节点长度不变
          for (let j = 0; j < newVnode[i].length; j++) {
            _this._diffUpdateView(oldVnode[i][j], newVnode[i][j]);
          }
        } else if (newVnode.children.length > oldVnode.children.length) {
          //TODO 子节点增加
          if (
            (newVnode[i].length !== 0) &&
            (newVnode[i][0].type || newVnode[i][0].attributes.key === void 0)
          ) {
            //* 通过判断 attributes 中的 key 判断是否是循环创建的还是替换时子节点增加了
            upDateNode.call(this, oldVnode, newVnode)
          } else if (oldVnode[i][0] ? oldVnode[i][0].key !== newVnode[i][0].key : false) {
            //* 判断旧数组中是否有值,如果没有直接false到末尾添加，有的话判断是是否在首位添加的
            // 首位添加节点
            headAddNode.call(_this, oldVnode, newVnode[i], oldVnode[i]);
          } else if (oldVnode[i][0] ? oldVnode[i][0].key === newVnode[i][0].key && oldVnode[i][oldVnode[i].length - 1].key === newVnode[i][newVnode[i].length - 1].key : false) {
            //* 判断旧数组中是否有值,如果没有直接false到末尾添加，有的话判断是是否在中位添加的
            // 中间插入节点
            middleAddNode.call(_this, oldVnode, newVnode[i], oldVnode[i])
          } else if (oldVnode[i].length === 0 ? newVnode[i].length > 1 : false) {
            //* 判断旧的子节点为空，新的子节点添加了大于一的子节点
            // 大量添加
            insertMaxNode.call(_this, oldVnode, newVnode[i]);
          } else if (oldVnode[i][0] ? oldVnode[i][0].key === newVnode[i][0].key && oldVnode[i][oldVnode[i].length - 1].key !== newVnode[i][newVnode[i].length - 1].key : true) {
            //* 判断数组中是否有值,如果没有直接到末尾添加，有的话判断是是否在末尾位添加的
            // 末尾添加节点
            belowAddNode.call(_this, newVnode[i], oldVnode);
          }

          //* 生命周期调用
          if (this.life.domUpdata) { this.life.domUpdata.call(this) };
        } else if (newVnode.children.length < oldVnode.children.length) {
          // TODO 子节点减少
          //* 通过判断 attributes 中的 key 判断是否是循环创建的还是替换时子节点减少了
          if (
            (newVnode[i].length !== 0) &&
            (newVnode[i][0].type || newVnode[i][0].attributes.key === void 0)
          ) {
            upDateNode.call(this, oldVnode, newVnode)
          } else {
            removeNode.call(_this, newVnode[i], oldVnode[i]);
          }
          //* 生命周期调用
          if (this.life.domUpdata) { this.life.domUpdata.call(this) };
        }
        break;
      case "type":
        // 判断文本节点的type是否发生改变一般不会被改变
        oldVnode[i] === newVnode[i] ? true : err('禁止动态的改变文本节点的type');
        break;
      case "value":
        oldVnode[i] !== newVnode[i] ? upDateTextNode.call(_this, newVnode.key, newVnode[i]) : true;
        break;
    }
  }
  // 更新完后将新的Vnode拷贝给_oldVnode
  this._oldVnode = this._deepClone(this.Vnode);
}