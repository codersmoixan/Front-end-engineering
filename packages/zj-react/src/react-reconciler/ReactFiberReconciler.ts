import { createFiberRoot } from "../react-dom/fiber/ReactFiberRoot";
import { createHostRootFiber } from "../react-dom/fiber/ReactFiber";
import { ReactWorkTags } from "../shared/ReactWorkTags";
import { initializeUpdateQueue } from "./ReactFiberClassUpdateQueue";
import type { DOMContainer } from "../react-dom/interface"
import type { RootTag } from "../shared/ReactRootTags";
import type { FiberRoot } from "./ReactInternalTypes";

type OpaqueRoot = FiberRoot;

export function createContainer(
	containerInfo: DOMContainer,
	tag: RootTag,
	hydrationCallbacks: null | Function,
	isStrictMode: boolean,
	concurrentUpdatesByDefaultOverride: null | boolean,
	identifierPrefix: string,
	onRecoverableError: (error: unknown) => void,
): OpaqueRoot {
	const root = createFiberRoot(
		containerInfo,
		tag,
		false,
		null,
		hydrationCallbacks,
		isStrictMode,
		concurrentUpdatesByDefaultOverride,
		identifierPrefix,
		onRecoverableError
		)

	const uninitializedFiber = createHostRootFiber(
		tag,
		isStrictMode,
		concurrentUpdatesByDefaultOverride
	)
	root.current = uninitializedFiber
	uninitializedFiber.stateNode = root

	initializeUpdateQueue(uninitializedFiber)

	return root
}

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
