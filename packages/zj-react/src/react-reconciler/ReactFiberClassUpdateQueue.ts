import type { Fiber, FiberRoot } from "./ReactInternalTypes";
import type { Lane, Lanes } from "./ReactFiberLane";
import {isUnsafeClassRenderPhaseUpdate} from "./ReactFiberWorkLoop";
import {
	enqueueConcurrentClassUpdate,
	unsafe_markUpdateLaneFromFiberToRoot
} from "./ReactFiberConcurrentUpdates";

export type Update<State> = {
	eventTime: number,
	lane: Lane,
	tag: 0 | 1 | 2 | 3,
	payload: any,
	callback: (() => unknown) | null,
	next: Update<State> | null
}

export type SharedQueue<State> = {
	pending: Update<State> | null,
	lanes: Lanes,
	hiddenCallbacks: Array<() => unknown> | null,
	};

export enum UpdateQueueState {
	UpdateState,
	ReplaceState,
	ForceUpdate,
	CaptureUpdate
}

export function initializeUpdateQueue<State>(fiber: Fiber) {

}

export function createUpdate(eventTime: number, lane: Lane): Update<any> {
	return {
		eventTime,
		lane,
		tag: UpdateQueueState.UpdateState,
		payload: null,
		callback: null,
		next: null
	}
}

export function enqueueUpdate<State>(
	fiber: Fiber,
	update: Update<State>,
	lane: Lane
): FiberRoot | null {
	const updateQueue = fiber.updateQueue
	if (updateQueue === null) {
		return null
	}

	const sharedQueue: SharedQueue<any> = (updateQueue as any).shared

	if (isUnsafeClassRenderPhaseUpdate(fiber)) {
		const pending = sharedQueue.pending
		if (pending === null) {
			update.next = update
		} else {
			update.next = pending.next
		}

		sharedQueue.pending = update

		return unsafe_markUpdateLaneFromFiberToRoot(fiber, lane)
	} else {
		return enqueueConcurrentClassUpdate(fiber, sharedQueue, update, lane)
	}
}
