import { err } from "../tools"
/**
 * h 函数,创建Vnode
 * @returns Vnode
 */
export default function () {
  let tempVnode = null;
  function createVnode(a, b, c) {
    return {
      elementName: a,
      attributes: b,
      children: c
    }
  }

  switch (arguments.length) {
    case 1:
      tempVnode = createVnode(arguments[0], {}, []);
      break;
    case 2:
      if (typeof arguments[0] === 'string') {
        if (typeof arguments[1] === 'string' || typeof arguments[1] === 'number') {
          tempVnode = createVnode(arguments[0], {}, [arguments[1]]);
        } else if (typeof arguments[1] === 'object' && arguments[1] instanceof Array) {
          tempVnode = createVnode(arguments[0], {}, arguments[1]);
        } else if (typeof arguments[1] === 'object' && arguments[1] instanceof Object) {
          if (arguments[1].elementName) {
            tempVnode = createVnode(arguments[0], {}, [arguments[1]]);
          } else {
            tempVnode = createVnode(arguments[0], arguments[1], [])
          }
        }
      }
      break;
    case 3:
      if (typeof arguments[0] === 'string') {
        if (typeof arguments[2] === 'object' && arguments[2] instanceof Array) {
          if (typeof arguments[1] === 'string' || typeof arguments[1] === 'number') {
            tempVnode = createVnode(arguments[0], {}, [arguments[1], ...arguments[2]]);
          } else if (typeof arguments[1] === 'object' && arguments[1] instanceof Object) {
            tempVnode = createVnode(arguments[0], arguments[1], arguments[2]);
          }
        }
      }
      break;
    default:
      err('h 函数参数不能超过三个')
      break
  }

  return tempVnode;
}