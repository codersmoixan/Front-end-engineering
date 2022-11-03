import type { OffscreenInstance } from "./ReactFiberOffscreenComponent";

export type SuspenseInfo = { name: string | null };

// @ts-ignore
export type PendingBoundaries = Map<OffscreenInstance, SuspenseInfo>;

export type TracingMarkerInstance = {
	pendingBoundaries: PendingBoundaries | null,
	name?: string,
};
