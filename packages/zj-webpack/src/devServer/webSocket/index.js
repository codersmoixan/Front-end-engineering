const { WebSocketServer } = require('ws')

class WebSocket {
	constructor() {
		this.webSocket = null
		this.wsConnection = null

		this.init()
	}

	init() {
		this.webSocket = new WebSocketServer({ port: 3001 })
		this.webSocket.on('connection', (wsConnection) => {
			this.wsConnection = wsConnection
		})
	}

	send(params) {
		console.log(358, params)
		if (this.wsConnection) {
			this.wsConnection.send(params)
		}
	}
}

const webSocket = new WebSocket()

module.exports = webSocket
