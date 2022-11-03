import { RootTag, ReactRootTags } from "../../react-reconciler/ReactRootTags";
import { ReactWorkTags, WorkTag } from "../../react-reconciler/ReactWorkTags";
import { Lanes, ReactFiberLane } from "../../react-reconciler/ReactFiberLane";
import { Flags, ReactFiberFlags } from "../../react-reconciler/ReactFiberFlags";
import type { TypeOfMode } from "../../react-reconciler/ReactTypeOfMode";
import type { Dependencies, Fiber } from "../../react-reconciler/ReactInternalTypes";
import {ReactTypeOfMode} from "../../react-reconciler/ReactTypeOfMode";

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
	} else {
		mode = ReactTypeOfMode.NoMode
	}

	// todo 注意这里设置的mode属性是有RootTag决定的
	return createFiber(ReactWorkTags.HostRoot, null, null, mode)
}
