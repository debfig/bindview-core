/**
 * 克隆 Vnode
 * @param {*} target 新Vnode
 * @returns new Vnode
 */
export default function (target, cache = new Map()) {
  const isObject = (obj) => typeof obj === 'object' && obj !== null

  if (isObject(target)) {
    // 解决循环引用
    const cacheTarget = cache.get(target)

    if (cacheTarget) {
      return cacheTarget
    }

    let cloneTarget = Array.isArray(target) ? [] : {}

    cache.set(target, cloneTarget)

    for (const key in target) {
      const value = target[key]
      cloneTarget[key] = isObject(value) ? this._deepClone(value, cache) : value
    }

    return cloneTarget
  } else {
    return target
  }
}

const deepClone2 = (target, cache = new Map()) => {
  const isObject = (obj) => typeof obj === 'object' && obj !== null
  const forEach = (array, cb) => {
    const leng = array.length
    let i = -1

    while (++i < leng) {
      cb(array[i])
    }
  }

  if (isObject(target)) {
    const cacheObj = cache.get(target)

    if (cacheObj) {
      return cacheObj
    }

    let cloneTarget = Array.isArray(target) ? [] : {}
    let keys = Object.keys(target)

    cache.set(target, cloneTarget)

    forEach(keys, (key) => {
      const value = target[key]
      cloneTarget[key] = isObject(value) ? deepClone2(value, cache) : value
    })

    return cloneTarget
  } else {
    return target
  }
}