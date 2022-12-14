const fs = require('fs')
const EventEmitter = require('events')

class FileWatcher extends EventEmitter{
	constructor(directoryWatcher, filePath) {
		super()

		this.directoryWatcher = directoryWatcher
		this.filePath = filePath
		this.ctimeMs = 1
	}

	emitEvent() {
		fs.lstat(this.filePath, (err, stat) => {
			if (!this.ctimeMs && !stat) {
				return console.error(`[ ====== 文件${this.filePath}不存在 ====== ]`)
			}

			const ctimeMs = Math.floor(stat.ctimeMs)

			// todo 如果文件被删除，触发remove时间并且删除Watcher
			if (this.filePath && !stat) {
				this.directoryWatcher.emit('delete', this.filePath, 'delete')
				this.directoryWatcher.watchers.delete(this.filePath)

				return null
			}

			// todo 如果添加文件，触发create事件
			if (this.ctimeMs === 1 && this.directoryWatcher.scanCount > 1) {
				this.directoryWatcher.emit('create', this.filePath, 'create')
			}

			// todo 如果是替换文件，触发change事件
			if (this.ctimeMs !== 1 && ctimeMs !== this.ctimeMs) {
				this.directoryWatcher.emit('change', this.filePath, 'change')
			}

			this.ctimeMs = ctimeMs
		})
	}
}

module.exports = FileWatcher
