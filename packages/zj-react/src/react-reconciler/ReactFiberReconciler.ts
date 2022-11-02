import { ReactWorkTags } from "../shared/ReactWorkTags";

export function getPublicRootInstance(container: any) {
	const containerFiber = container.current

	if (!containerFiber.child) {
		return null
	}

	switch (containerFiber.child.tag) {
		case ReactWorkTags.HostComponent:
			return getPublicRootInstance(containerFiber.child.stateNode)
		default:
			return containerFiber.child.stateNode
	}
}
