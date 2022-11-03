import { RootTag } from "../../shared/ReactRootTags";
import { Lane, Lanes, ReactFiberLane } from "../../shared/ReactFiberLane";

class FiberRootNode {
	tag: RootTag;
	type: any;
	stateNode: any;
	return: any;
	child: any;
	index: number;
	containerInfo: any;
	identifierPrefix: any;
	pendingChildren: any;
	current: any;
	pingCache: any;
	finishedWork: any;
	timeoutHandle: any;
	context: any;
	pendingContext: any;
	callbackNode: any;
	callbackPriority: Lane;
	onRecoverableError: any;
	pendingLanes: Lanes;
	suspendedLanes: Lanes;
	pingedLanes: Lanes;
	expiredLanes: Lanes;
	mutableReadLanes: Lanes;
	finishedLanes: Lanes;
	entangledLanes: Lanes;

	constructor(
		containerInfo,
		tag: RootTag,
		hydrate,
		identifierPrefix,
		onRecoverableError
	) {
		// Instance
		this.tag = tag
		this.containerInfo = containerInfo
		this.pendingChildren =null
		this.current = null
		this.pingCache = null
		this.finishedWork = null
		this.timeoutHandle = null
		this.context = null
		this.pendingContext = null
		this.callbackNode = null
		this.callbackPriority = ReactFiberLane.NoLane

		this.pendingLanes = ReactFiberLane.NoLanes
		this.suspendedLanes = ReactFiberLane.NoLanes;
		this.pingedLanes = ReactFiberLane.NoLanes;
		this.expiredLanes = ReactFiberLane.NoLanes;
		this.mutableReadLanes = ReactFiberLane.NoLanes;
		this.finishedLanes = ReactFiberLane.NoLanes;

		this.entangledLanes = ReactFiberLane.NoLanes;

		this.identifierPrefix = identifierPrefix;
		this.onRecoverableError = onRecoverableError;
	}
}

export {
	FiberRootNode
}
