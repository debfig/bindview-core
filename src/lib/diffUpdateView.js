import { err, warn } from "../tools";
import { NAME_SPACE, HTML_TAGS, EVENT_HANDLERS } from "../tools/dict"
/**
 * 新旧虚拟DOM对比差异,调用对应函数更新视图
 * @param {*} oldVnode 旧虚拟DOM
 * @param {*} newVnode 新虚拟DOM
 */
export default function (oldVnode, newVnode) {
  let _this = this;

  /**
   * 更新 DOM style
   * @param {*} key key 
   * @param {*} style style
   */
  function upDateStyle(key, style) {
    let dom = _this._KeyMapDom.get(key);
    for (let i in style) {
      dom.style[i] = style[i];
    }
  }

  /**
   * 更新属性
   * @param {*} key key
   * @param {*} value 要更新的属性
   * @param {*} attr 新值的提供者
   */
  function upDataAttr(key, value, attr) {
    let dom = _this._KeyMapDom.get(key);
    switch (value) {
      case 'ref':
        ((ref, el) => {
          if (_this.refs[ref] instanceof HTMLElement) {
            let temp = new Array(_this.refs[ref]);
            temp.push(el)
            _this.refs[ref] = temp;
          } else if (_this.refs[ref] instanceof Array) {
            _this.refs[ref].push(el)
          } else {
            _this.refs[ref] = el;
          }
        })(attr[value], dom);
        warn("动态修改 ref 属性,非常非常不推荐使用");
        break;
      case 'key':
        break;
      default:
        if (!(value in EVENT_HANDLERS)) {
          dom.setAttribute(value, attr[value]);
        }
        break
    }
  }

  /**
   * 更新文本节点
   * @param {*} key key
   * @param {*} value new Value
   */
  function upDateTextNode(key, value) {
    let dom = _this._KeyMapDom.get(key);
    dom.nodeValue = value
  }

  /**
   * 在首位添加节点
   * @param {*} fatherNode 父节点
   * @param {*} newVnode 新的子节点数组
   * @param {*} oldVnode 旧的子节点数组
   */
  function headAddNode(fatherNode, newVnode, oldVnode) {
    let fatheElement = _this._KeyMapDom.get(fatherNode.key);
    let oldElement = _this._KeyMapDom.get(oldVnode[0].key)
    fatheElement.insertBefore(_this._loopCreateNode(newVnode[0]), oldElement)
  }

  /**
   * 在中间添加节点
   * @param {*} fatherNode 父节点
   * @param {*} newVnode 新的子节点数组
   * @param {*} oldVnode 旧的子节点数组 
   */
  function middleAddNode(fatherNode, newVnode, oldVnode) {
    let fatheElement = _this._KeyMapDom.get(fatherNode.key);
    for (let i = 0; i < newVnode.length; i++) {
      if (newVnode[i].key !== oldVnode[i].key) {
        if (newVnode[i + 1].key === oldVnode[i].key) {
          let oldElement = _this._KeyMapDom.get(oldVnode[i].key)
          fatheElement.insertBefore(_this._loopCreateNode(newVnode[i]), oldElement)
          break;
        }
      }
    }
  }

  /**
   * 在末尾添加节点
   * @param {*} newVnode 新的子节点数组
   * @param {*} fatherNode 父节点
   */
  function belowAddNode(newVnode, fatherNode) {
    let oldNodeKey = fatherNode.key;
    let oldElement = _this._KeyMapDom.get(oldNodeKey);
    let newNodeKey = newVnode[newVnode.length - 1];
    oldElement.appendChild(_this._loopCreateNode(newNodeKey));
  }


  /**
   * 旧子节点为空，新字节数量大于1添加，节点
   * @param {*} fatherNode 父节点
   * @param {*} newVnode 新的子节点数组
   */
  function insertMaxNode(fatherNode, newVnode) {
    let fatherElement = _this._KeyMapDom.get(fatherNode.key);
    for (let i of newVnode) {
      fatherElement.appendChild(_this._loopCreateNode(i));
    }
  }

  /**
   * 移除节点
   * @param {*} newVnode 新的子节点数组
   * @param {*} oldVnode 旧的子节点数组
   */
  function removeNode(newVnode, oldVnode) {
    // 筛选出新旧子节点不同的节点的Key
    function getNewArr(a, b) {
      const arr = [...a, ...b];
      const newArr = arr.filter(item => {
        return !(a.includes(item) && b.includes(item));
      });
      return newArr;
    }

    /**
     * 删除节点和移除_KeyMapDom中的键值映射
     * @param {*} Vnode 虚拟DOm 
     */
    function deleteELement(Vnode) {
      let DOM = _this._KeyMapDom.get(Vnode.key)
      DOM.remove();
      _this._KeyMapDom.delete(Vnode.key);
      if (!Vnode.type) {
        Vnode.children.forEach(i => {
          deleteELement(i);
        })
      }
    }

    // 获取所有新子节点的Key
    let newKey = newVnode.map(i => {
      return i.key;
    });
    //获取所有旧子节点的Key
    let oldKey = oldVnode.map(i => {
      return i.key
    })

    if (newKey.length === 0) {
      deleteELement(oldVnode[0])
    } else {
      getNewArr(newKey, oldKey).forEach(i => {
        for (let k = 0; k < oldVnode.length; k++) {
          if (oldVnode[k].key === i) {
            deleteELement(oldVnode[k])
          }
        }
      })
    }
  }

  // 使用遍历来依次比较差异
  for (let i in newVnode) {
    switch (i) {
      case "elementName":
        if (newVnode[i] in NAME_SPACE || newVnode[i] in HTML_TAGS) {
          oldVnode[i] === newVnode[i] ? true : err('不能动态的改变标签');
        } else {
          // 如果是组件停不进行比较
          return;
        }
        break;
      case "attributes":
        // 将对象转换为 string 进行粗略比较
        if (JSON.stringify(oldVnode[i]) !== JSON.stringify(newVnode[i])) {
          for (let j in newVnode[i]) {
            // 对属性中的 style 进行处理
            if (j === 'style') {
              JSON.stringify(oldVnode[i]['style']) !== JSON.stringify(newVnode[i]['style']) ? upDateStyle(newVnode.key, newVnode[i]['style']) : true;
            } else {
              // 判断属性，有差异调用 upDataAttr 更新
              oldVnode[i][j] !== newVnode[i][j] ? upDataAttr(newVnode.key, j, newVnode[i]) : true;
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

        } else if (oldVnode[i].length === newVnode[i].length) {
          // 子节点长度不变
          for (let j = 0; j < newVnode[i].length; j++) {
            _this._diffUpdateView(oldVnode[i][j], newVnode[i][j]);
          }
        } else if (oldVnode[i].length > newVnode[i].length) {
          // 子节点减少
          removeNode(newVnode[i], oldVnode[i]);

          //* 生命周期调用
          if (this.life.domUpdata) { this.life.domUpdata.call(this) };
        } else {
          // 子节点增加
          if (oldVnode[i][0] ? oldVnode[i][0].key !== newVnode[i][0].key : false) {
            //* 判断数组中是否有值,如果没有直接false到末尾添加，有的话判断是是否在首位添加的
            // 首位添加节点
            headAddNode(oldVnode, newVnode[i], oldVnode[i]);
          } else if (oldVnode[i][0] ? oldVnode[i][0].key === newVnode[i][0].key && oldVnode[i][oldVnode[i].length - 1].key === newVnode[i][newVnode[i].length - 1].key : false) {
            //* 判断数组中是否有值,如果没有直接false到末尾添加，有的话判断是是否在中位添加的
            // 中间插入节点
            middleAddNode(oldVnode, newVnode[i], oldVnode[i])
          } else if (oldVnode[i].length === 0 ? newVnode[i].length > 1 : false) {
            //* 判断旧的子节点为空，新的子节点添加了大于一的子节点
            // 大量添加
            insertMaxNode(oldVnode, newVnode[i]);
          } else if (oldVnode[i][0] ? oldVnode[i][0].key === newVnode[i][0].key && oldVnode[i][oldVnode[i].length - 1].key !== newVnode[i][newVnode[i].length - 1].key : true) {
            //* 判断数组中是否有值,如果没有直接到末尾添加，有的话判断是是否在末尾位添加的
            // 末尾添加节点
            belowAddNode(newVnode[i], oldVnode);
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
        oldVnode[i] !== newVnode[i] ? upDateTextNode(newVnode.key, newVnode[i]) : true;
        break;
    }
  }

  // 更新完后将新的Vnode拷贝给_oldVnode
  this._oldVnode = this._deepClone(this.Vnode);
}