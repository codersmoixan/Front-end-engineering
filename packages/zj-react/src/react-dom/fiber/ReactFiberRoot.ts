import { RootTag } from "../../shared/ReactRootTags";
import { FiberRootNode } from "./FiberNode";
import type { FiberRoot } from "../../react-reconciler/ReactInternalTypes";
import { createHostRootFiber } from "./ReactFiber";
import {
	initializeUpdateQueue
} from "../../react-reconciler/ReactFiberClassUpdateQueue";

export function createFiberRoot(
	container: any,
	tag: RootTag,
	hydrate: boolean,
	initialChildren: any,
	hydrationCallbacks: null | Function,
	isStrictMode: boolean,
	concurrentUpdatesByDefaultOverride: null | boolean,
	identifierPrefix: string,
	onRecoverableError: (error: unknown) => void,
): FiberRoot  {
	// todo 创建fiberRoot对象，注意rootTag的传递
	const root = new FiberRootNode(
		container,
		tag,
		hydrate,
		identifierPrefix,
		onRecoverableError
	) as any as FiberRoot

	// todo 1. 这里创建了react应用的首个fiber对象，称为HostRootFiber
	const uninitializedFiber = createHostRootFiber(
		tag,
		isStrictMode,
		concurrentUpdatesByDefaultOverride
	)
	root.current = uninitializedFiber
	uninitializedFiber.stateNode = root

	// todo 2. 初始化HostRootFiber的updateQueue
	initializeUpdateQueue(uninitializedFiber)

	return root
}
