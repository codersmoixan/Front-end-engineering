type ReactEmpty = null | void | boolean;

type ReactNodeList = ReactEmpty;

type Work = {
	then(onCommit: () => unknown): void,
	_onCommit: () => void,
	_callbacks: Array<() => unknown> | null,
	_didCommit: boolean
}

type Root = {
	render(children: any, callback?: () => unknown): Work,
	unmount(callback?: () => unknown): Work,
}

type DOMContainer =
	| (Element & {
	_reactRootContainer?: any,
	_reactHashBeenPassedToCreateRootDEV?: boolean
})
	| (Document & {
	_reactRootContainer?: any,
	_reactHashBeenPassedToCreateRootDEV?: boolean
})

export {
	Work,
	Root,
	DOMContainer,
}
