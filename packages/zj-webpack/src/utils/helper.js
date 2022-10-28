const UglifyJS = require('uglify-js')

/**
 * @description 添加文件后缀
 * @param {string} path
 * @return {string}
 * */
function addFileSuffix(path) {
	if (path[0] !== '.' && path[1] !== ':') {
		return path
	}

	const index = path.lastIndexOf(".");
	const ext = path.substr(index + 1);

	if (ext.length > 5) {
		path = path + '.js'
	}

	return path
}

/**
 * @description 代码压缩
 * @param {string} codeString
 * */
function compressByUglify(codeString) {
	const { code } = UglifyJS.minify(codeString, {
		compress: {
			evaluate: true, // 计算常量表达式
			booleans: true, //优化布尔运算
			dead_code: true, // 删除死代码
			unused: true,   // 删除未引用的函数和变量
		},
	});

	return code
}

module.exports = {
	addFileSuffix,
	compressByUglify
}
