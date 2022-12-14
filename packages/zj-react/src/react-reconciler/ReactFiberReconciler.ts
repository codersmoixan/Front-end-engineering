import { createFiberRoot } from "../react-dom/fiber/ReactFiberRoot";
import { ReactWorkTags } from "./ReactWorkTags";
import {
	requestEventTime,
	requestUpdateLane,
	scheduleUpdateOnFiber
} from "./ReactFiberWorkLoop";
import type { DOMContainer } from "../react-dom/interface"
import type { RootTag } from "./ReactRootTags";
import type { FiberRoot } from "./ReactInternalTypes";
import { Lane } from "./ReactFiberLane";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { emptyContextObject } from "./ReactFiberContext";
import { get as getInstance } from "../shared/ReactInstanceMap"
import { findCurrentUnmaskedContext } from "./ReactFiberContext";

type OpaqueRoot = FiberRoot;

export function getContextForSubtree(
	parentComponent?: any
) {
	if (!parentComponent) {
		return emptyContextObject
	}

	const fiber = getInstance(parentComponent)

	// 这里只考虑函数组件
	return findCurrentUnmaskedContext(fiber)
}

export function createContainer(
	containerInfo: DOMContainer,
	tag: RootTag,
	hydrationCallbacks: null | Function,
	isStrictMode: boolean,
	concurrentUpdatesByDefaultOverride: null | boolean,
	identifierPrefix: string,
	onRecoverableError: (error: unknown) => void,
): OpaqueRoot {
	// todo 创建fiberRoot对象
	return createFiberRoot(
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
}

export function updateContainer(
	element: any,
	container: OpaqueRoot,
	parentComponent: any,
	callback?: Function
): Lane {
	const current = container.current
	// todo 1. 获取当前时间戳，计算本次更新的优先级
	const eventTime = requestEventTime()
	// 创建一个优先级变量(车道模型)
	const lane = requestUpdateLane(current)

	const context = getContextForSubtree(parentComponent)
	if (container.context === null) {
		container.context = context
	} else {
		container.pendingContext = context
	}

	// todo 2. 设置fiber updateQueue
	//  根据车道优先级，创建update对象，并加入fiber.updateQueue.pending队列
	const update = createUpdate(eventTime, lane)
	update.payload = { element }
	callback = callback === undefined ? null : callback
	if (callback !== null) {
		update.callback = (callback as () => unknown)
	}

	const root = enqueueUpdate(current, update, lane)

	if (root !== null) {
		// todo 3. 进入reconciler运作流程中的`输入`环节
		scheduleUpdateOnFiber(root, current, lane, eventTime)
	}

	return lane
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
