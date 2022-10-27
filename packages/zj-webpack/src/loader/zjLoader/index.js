const jsx = require('@babel/core')

function zjLoader(source) {
  // todo 将所有<zj-template>标签替换为div标签
  const newSource = source
    .replace(/<zj-template>/g, '<div>')
    .replace(/<\/zj-template>/g, '</div>')

  const { code } = jsx.transformSync(newSource, {
    presets: ["@babel/preset-react"]
  })

  // todo 将React.createElement替换为自己的createElement函数
  const newCode = code.replace(/React.createElement/, 'ZJReact.createElement')

  return newCode
}

module.exports = zjLoader
