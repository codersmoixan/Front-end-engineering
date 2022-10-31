(function() {
	let bundleJsHash = ''
	const ws = new WebSocket('ws://localhost:3001/')
	ws.onmessage = function({ data: jsHash }) {
		if (bundleJsHash !== jsHash) {
			location.reload()
		} else {
			bundleJsHash = jsHash
		}
	}
})()
