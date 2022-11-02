type LaneMap<T> = Array<T>
type Lanes = number;
type Lane = number;

enum ReactFiberLane {
	NoLanes = 0b0000000000000000000000000000000,
	NoLane = 0b0000000000000000000000000000000,

	SyncLane = 0b0000000000000000000000000000001,

	InputContinuousHydrationLane = 0b0000000000000000000000000000010,
	InputContinuousLane = 0b0000000000000000000000000000100,

	DefaultHydrationLane = 0b0000000000000000000000000001000,
	DefaultLane = 0b0000000000000000000000000010000
}

export {
	LaneMap,
	Lane,
	Lanes,
	ReactFiberLane
}
