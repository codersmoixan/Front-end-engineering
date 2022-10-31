const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const FileWatcher = require('./FileWatcher')

function getDifferenceFiles(files, newFiles) {
	return files.concat(newFiles).filter((file, index, concatFiles) => concatFiles.indexOf(file) === concatFiles.lastIndexOf(file))
}

class DirectoryWatcher extends EventEmitter{
	constructor(options = {}) {
		const { directoryList, poll = 1000 } = options
		super();

		this.directoryList = directoryList ?? []
		this.watchers = new Map() // 文件监听器
		this.fileList = []
		this.poll = typeof poll === 'number' ? poll : 1000
		this.scanCount = 0
	}

	/**
	 * @description 收集目录下的所有文件
	 * */
	collectFiles() {
		const fileList = []

		function cycleCollectFiles(pathList = []) {
			for (let i = 0; i < pathList.length; i++) {
				const filePath = pathList[i]
				const stat = fs.statSync(filePath)

				if (stat.isFile()) {
					fileList.push(filePath)
				}

				if (stat.isDirectory()) {
					const childPathList = fs.readdirSync(filePath).map(childPath => path.join(filePath, childPath))
					cycleCollectFiles(childPathList)
				}
			}
		}

		cycleCollectFiles(this.directoryList)

		return fileList
	}

	/**
	 * @description 收集给需要添加watcher的文件
	 * */
	collectNeedFilesWatcher() {
		const fileList = this.collectFiles()
		const needWatcherFiles = getDifferenceFiles(this.fileList, fileList)
		this.fileList = fileList

		return needWatcherFiles
	}

	/**
	 * @description 更新文件watcher
	 * */
	updateWatchers() {
		const needFiles = this.collectNeedFilesWatcher()
		needFiles.forEach(path => {
			this.watchers.set(path, new FileWatcher(this, path))
		})
	}

	/**
	 * @description 遍历文件watchers
	 * */
	ergodicWatchers() {
		this.watchers.forEach(watcher => {
			watcher.emitEvent()
		})
	}

	/**
	 * @description 扫描全部文件监视文件是否变动
	 * */
	scanFiles() {
		this.updateWatchers()
		this.ergodicWatchers()
		this.scanCount++
	}

	/**
	 * @description 监视文件的变动
	 * */
	watch() {
		console.log('[ ================= 正在监视文件变动 ================= ]')
		console.log(this.directoryList)
		this.scanIntervaler = setInterval(() => {
			this.scanFiles()
		}, this.poll)
	}

	/**
	 * @description 停止监听
	 * */
	stopWatch() {
		console.log('[ ================= 停止监视文件变动 ================= ]')
		clearInterval(this.scanIntervaler)
	}
}

module.exports = DirectoryWatcher
