import { FiberRoot } from "./ReactInternalTypes";
import {
	ConcurrentUpdate
} from "./ReactFiberConcurrentUpdates";
import { clz32 } from "./clz32";

type LaneMap<T> = Array<T>
type Lanes = number;
type Lane = number;

const NoTimestamp = -1;

enum ReactFiberLane {
	NoLanes = 0b0000000000000000000000000000000,
	NoLane = 0b0000000000000000000000000000000,

	SyncLane = 0b0000000000000000000000000000001,

	InputContinuousHydrationLane = 0b0000000000000000000000000000010,
	InputContinuousLane = 0b0000000000000000000000000000100,

	DefaultHydrationLane = 0b0000000000000000000000000001000,
	DefaultLane = 0b0000000000000000000000000010000,

	IdleLane = 0b0100000000000000000000000000000
}

function getHighestPriorityLane(lanes: Lanes): Lane {
	return lanes & -lanes;
}

function pickArbitraryLane(lanes: Lanes): Lane {
	return getHighestPriorityLane(lanes);
}

export {
	LaneMap,
	Lane,
	Lanes,
	NoTimestamp,
	ReactFiberLane,
	pickArbitraryLane,
	getHighestPriorityLane
}

export function mergeLanes(a: Lanes | Lane, b: Lanes | Lane): Lanes {
	return a | b;
}

function pickArbitraryLaneIndex(lanes: Lanes) {
	return 31 - clz32(lanes);
}

function laneToIndex(lane: Lane) {
	return pickArbitraryLaneIndex(lane);
}

export function markHiddenUpdate(
	root: FiberRoot,
	update: ConcurrentUpdate,
	lane: Lane
) {
	const index = laneToIndex(lane)
	const hiddenUpdates = root.hiddenUpdates
	const hiddenUpdateForLane = hiddenUpdates[index]

	if (hiddenUpdateForLane === null) {
		hiddenUpdates[index] = [update]
	} else {
		hiddenUpdateForLane.push(update)
	}

	update.lane = lane
}

export function markRootUpdated(
	root: FiberRoot,
	updateLane: Lane,
	eventTime: number
) {
	root.pendingLanes |= updateLane

	if (updateLane !== ReactFiberLane.IdleLane) {
		root.suspendedLanes = ReactFiberLane.NoLanes
		root.pendingLanes = ReactFiberLane.NoLanes
	}

	const eventTimes = root.eventTimes
	const index = laneToIndex(updateLane)

	eventTimes[index] = eventTime
}
