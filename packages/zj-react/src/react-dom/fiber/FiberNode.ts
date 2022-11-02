import { ReactSideEffectTags } from "../../shared/ReactSideEffectTags";
import { RootTag } from "../../shared/ReactRootTags";

export const NoWork = 0;

class FiberRootNode {
	tag: RootTag;
	elementType: null;
	type: null;
	stateNode: null;
	return: null;
	child: null;
	sibling: null;
	index: number;
	ref: null;
	memoizedProps: null;
	updateQueue: null;
	memoizedState: null;
	contextDependencies: null;
	effectTag: number;
	nextEffect: null;
	firstEffect: null;
	lastEffect: null;
	expirationTime: number;
	childExpirationTime: number;
	stateQueueTimer: null;
	containerInfo: any;
	identifierPrefix: any;

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
