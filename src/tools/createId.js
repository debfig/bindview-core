import err from "./err"
import uuid from "../lib/uuid"
/**
 * 创建多个id
 * @param {Number} num 生成多少个id
 * @returns id数组
 */
export default function (num) {
  const setOf = new Array()
  num = typeof num === "number" ? num : err("createId 需要 Number 类型的参数")
  for (let i = 0; i < num; i++) {
    setOf.push(uuid())
  }
  return setOf
}