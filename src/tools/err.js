/**
 * 抛出错误
 * @param {*} error 错误信息或 error Object
 */
export default function (error) {
  throw error instanceof Error ? `[bindview] ${error}` : `[bindview] ${error}`
}