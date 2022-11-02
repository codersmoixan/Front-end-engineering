import { ReactSideEffectTags } from "../../shared/ReactSideEffectTags";
import { RootTag } from "../../shared/ReactRootTags";
import { Lane, ReactFiberLane } from "../../shared/ReactFiberLane";

export const NoWork = 0;

class FiberRootNode {
	tag: RootTag;
	elementType: any;
	type: any;
	stateNode: any;
	return: any;
	child: any;
	sibling: any;
	index: number;
	ref: any;
	memoizedProps: any;
	updateQueue: any;
	memoizedState: any;
	contextDependencies: any;
	effectTag: number;
	nextEffect: any;
	firstEffect: any;
	lastEffect: any;
	expirationTime: number;
	childExpirationTime: number;
	stateQueueTimer: any;
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

		this.elementType = null
		this.type = null
		this.stateNode = null // 对应的函数组件或者dom节点
		this.stateQueueTimer = null // 用于state的合并更新(setTimeout)

		this.return = null
		this.child = null
		this.sibling = null
		this.index = 0

		this.ref = null

		this.memoizedProps = null
		this.updateQueue = null // Effect的更新链表
		this.memoizedState = null
		this.contextDependencies = null

		this.effectTag = ReactSideEffectTags.NoEffect
		this.nextEffect = null

		this.firstEffect = null
		this.lastEffect = null

		this.expirationTime = NoWork
		this.childExpirationTime = NoWork;

		this.identifierPrefix = identifierPrefix;
	}
}

export {
	FiberRootNode
}
