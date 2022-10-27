const fs = require('fs')
const path = require('path')

let step = 0
let totalSteps = 0

/**
 * @description 计算文件夹下所有js文件的数量
 * @param {string} dirPath
 * @return number
 * */
function calculateJSFiles(dirPath) {
  let count = 0

  const findJsFile = (path) => {
    let fileList = fs.readdirSync(path)

    // 判断是否为js文件，如果为文件夹则继续查找
    fileList.forEach(fileName => {
      const isDir = fileName.split('.').length === 1
      const fileSuffix = fileName.split('.').pop().toLowerCase()

      if (fileSuffix === 'js') {
        count += 1
      }

      if (isDir) {
        findJsFile(`${dirPath}/${fileName}`)
      }
    })
  }

  findJsFile(dirPath)

  return count
}

/**
 * @description 进度条总步数
 * @param {string} entry
 * */
function calculateTotalSteps(entry) {
  const dirPath = path.dirname(entry)
  const JSFilePath = calculateJSFiles(dirPath)
  totalSteps = JSFilePath * 10 + 1
}

/**
 * @description 渲染单次进度
 * @param {string} text
 * @param {object} options
 * */
function renderProgress(text, options = {}) {
  step += options.step ?? 1

}

module.exports = {
  renderProgress,
  calculateTotalSteps
}
