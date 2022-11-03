import type { Wakeable } from "../shared/ReactTypes";
import type { TracingMarkerInstance } from "./ReactFiberTracingMarkerComponent";

export type OffscreenInstance = {
	isHidden: boolean,
	// @ts-ignore
	pendingMarkers: Set<TracingMarkerInstance> | null,
	// @ts-ignore
	retryCache: WeakSet<Wakeable> | Set<Wakeable> | null,
};
