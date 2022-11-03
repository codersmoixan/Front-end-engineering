import { ReactWorkTags } from "./ReactWorkTags";
import {
	Lanes,
	markHiddenUpdate,
	mergeLanes,
	ReactFiberLane
} from "./ReactFiberLane";
import type { Lane } from "./ReactFiberLane";
import type { Fiber, FiberRoot } from "./ReactInternalTypes";
import type { OffscreenInstance } from "./ReactFiberOffscreenComponent";
import type { SharedQueue as ClassQueue, Update as ClassUpdate } from "./ReactFiberClassUpdateQueue";

export type ConcurrentUpdate = {
	next: ConcurrentUpdate,
	lane: Lane,
};

type ConcurrentQueue = {
	pending: ConcurrentUpdate | null,
};

const concurrentQueues: Array<any> = [];
let concurrentQueuesIndex = 0;

let concurrentlyUpdatedLanes: Lanes = ReactFiberLane.NoLanes;

function markUpdateLaneFromFiberToRoot(
	sourceFiber: Fiber,
	update: ConcurrentUpdate | null,
	lane: Lane,
): void {
	// Update the source fiber's lanes
	sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
	let alternate = sourceFiber.alternate;
	if (alternate !== null) {
		alternate.lanes = mergeLanes(alternate.lanes, lane);
	}
	let isHidden = false;
	let parent = sourceFiber.return;
	let node = sourceFiber;
	while (parent !== null) {
		parent.childLanes = mergeLanes(parent.childLanes, lane);
		alternate = parent.alternate;
		if (alternate !== null) {
			alternate.childLanes = mergeLanes(alternate.childLanes, lane);
		}

		// @ts-ignore
		if (parent.tag === ReactWorkTags.OffscreenComponent) {
			const offscreenInstance: OffscreenInstance | null = parent.stateNode;
			if (offscreenInstance !== null && offscreenInstance.isHidden) {
				isHidden = true;
			}
		}

		node = parent;
		parent = parent.return;
	}

	if (isHidden && update !== null && node.tag === ReactWorkTags.HostRoot) {
		const root: FiberRoot = node.stateNode;
		markHiddenUpdate(root, update, lane);
	}
}

function getRootForUpdatedFiber(sourceFiber: Fiber): FiberRoot | null {
	let node = sourceFiber;
	let parent = node.return;

	while (parent !== null) {
		node = parent;
		parent = node.return;
	}

	return node.tag === ReactWorkTags.HostRoot ? (node.stateNode as FiberRoot) : null;
}

export function unsafe_markUpdateLaneFromFiberToRoot(
	sourceFiber: Fiber,
	lane: Lane,
): FiberRoot | null {
	const root = getRootForUpdatedFiber(sourceFiber);
	markUpdateLaneFromFiberToRoot(sourceFiber, null, lane);
	return root;
}

function enqueueUpdate(
	fiber: Fiber,
	queue: ConcurrentQueue | null,
	update: ConcurrentUpdate | null,
	lane: Lane,
) {
	concurrentQueues[concurrentQueuesIndex++] = fiber;
	concurrentQueues[concurrentQueuesIndex++] = queue;
	concurrentQueues[concurrentQueuesIndex++] = update;
	concurrentQueues[concurrentQueuesIndex++] = lane;

	concurrentlyUpdatedLanes = mergeLanes(concurrentlyUpdatedLanes, lane);

	fiber.lanes = mergeLanes(fiber.lanes, lane);
	const alternate = fiber.alternate;
	if (alternate !== null) {
		alternate.lanes = mergeLanes(alternate.lanes, lane);
	}
}

export function enqueueConcurrentClassUpdate<State>(
	fiber: Fiber,
	queue: ClassQueue<State>,
	update: ClassUpdate<State>,
	lane: Lane
): FiberRoot | null {
	enqueueUpdate(fiber, queue, update, lane)

	return getRootForUpdatedFiber(fiber)
}
