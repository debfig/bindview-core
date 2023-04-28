/**
 * 抛出警告
 * @param {*} warn 警告信息或 error Object
 */
export default function (warn) {
  console.warn(warn instanceof Error ? `[bindview] ${warn}` : `[bindview] ${warn}`);
}