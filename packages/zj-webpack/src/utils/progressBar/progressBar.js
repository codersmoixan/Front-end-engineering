const { stdout } = require('single-line-log')

/**
 * @description 定义终端打印字体颜色
 * @param {string} input
 * @param {number} color
 * @return {string}
 * */
function changeColor(input, color = 95) {
  return `\x1b[${color}m${input}\x1b[0m`
}

class ProgressBar {
  constructor(desc, length) {
    this.desc = desc || 'Progress' // 命令行开头的文字信息
    this.length = length || 25 // 进度条的长度
  }

  /**
   * @description 刷新进度条图案、文字
   * @param {object} options
   * */
  render(options) {
    const percent = (options.completed / options.total).toFixed(4);  // 计算进度(子任务的 完成数 除以 总数)
    const cellNum = Math.floor(percent * this.length);       // 计算需要多少个 █ 符号来拼凑图案

    // 拼接黑色条
    let cell = '';
    for (let i = 0; i < cellNum; i++) {
      cell += '█';
    }

    // 拼接灰色条
    let empty = '';
    for (let i = 0; i < this.length - cellNum; i++) {
      empty += '░';
    }

    // 进度条文本
    const cmdText = `${changeColor(this.desc)}: ${(100 * percent).toFixed(2)}% ${cell}${empty} ${options.completed}/${options.total}`

    // 进度条后文本
    const afterText = options.text

    // 在单行输出文本
    stdout(cmdText + ' ' + afterText + '\n\n');
  };
}

module.exports = ProgressBar
