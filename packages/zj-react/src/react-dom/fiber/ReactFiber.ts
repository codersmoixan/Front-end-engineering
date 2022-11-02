import { RootTag, ReactRootTags } from "../../shared/ReactRootTags";
import { ReactWorkTags, WorkTag } from "../../shared/ReactWorkTags";
import { Lanes, ReactFiberLane } from "../../shared/ReactFiberLane";
import { Flags, ReactFiberFlags } from "../../shared/ReactFiberFlags";
import type { TypeOfMode } from "../../shared/ReactTypeOfMode";
import type { Dependencies, Fiber } from "../../react-reconciler/ReactInternalTypes";

class FiberNode {
	tag: WorkTag;
	pendingProps: any;
	key: null | string;
	mode: TypeOfMode;
	return: Fiber | null;
	elementType: any;
	type: any;
	stateNode: any;
	child: Fiber | null;
	sibling: Fiber | null;
	index: number;
	ref: null | ((handle: unknown) => void) & { _stringRef?: string };
	memoizedProps: any;
	updateQueue: unknown;
	memoizedState: any;
	dependencies: Dependencies;
	flags: Flags;
	subtreeFlags: Flags;
	deletions: Array<Fiber> | null;
	lanes: Lanes;
	childLanes: Lanes;
	alternate: Fiber | null;

	constructor(
		tag: WorkTag,
		pendingProps: unknown,
		key: null | string,
		mode: TypeOfMode
	) {
		// Instance
		this.tag = tag
		this.key = key
		this.elementType = null
		this.type = null
		this.stateNode = null

		// Fiber
		this.return = null;
		this.child = null;
		this.sibling = null;
		this.index = 0;

		this.ref = null;

		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.updateQueue = null;
		this.memoizedState = null;
		this.dependencies = null;

		this.mode = mode;

		// Effects
		this.flags = ReactFiberFlags.NoFlags;
		this.subtreeFlags = ReactFiberFlags.NoFlags;
		this.deletions = null;

		this.lanes = ReactFiberLane.NoLanes;
		this.childLanes = ReactFiberLane.NoLanes;

		this.alternate = null;
	}
}

function createFiber(
	tag: WorkTag,
	pendingProps: unknown,
	key: null | string,
	mode: TypeOfMode
): Fiber {
	return new FiberNode(tag, pendingProps, key, mode) as any as Fiber
}

export function createHostRootFiber(
	tag: RootTag,
	isStrictMode: boolean,
	concurrentUpdatesByDefaultOverride: null | boolean
): Fiber {
	let mode;

	if (tag === ReactRootTags.ConcurrentRoot) {
		mode = ReactRootTags.ConcurrentRoot
	}

	return createFiber(ReactWorkTags.HostRoot, null, null, mode)
}
