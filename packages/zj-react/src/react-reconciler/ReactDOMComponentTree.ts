

const randomKey = Math.random()
	.toString(36)
	.slice(2);

const internalContainerInstanceKey = '__reactContainer$' + randomKey;

export function markContainerAsRoot(hostRoot: any, node: any): void {
	node[internalContainerInstanceKey] = hostRoot;
}
