import type { Lane } from "../shared/ReactFiberLane";

export type ConcurrentUpdate = {
	next: ConcurrentUpdate,
	lane: Lane,
};
