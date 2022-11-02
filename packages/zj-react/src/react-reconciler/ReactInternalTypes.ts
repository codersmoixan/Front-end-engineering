import type { WorkTag } from "../shared/ReactWorkTags";
import type {Lane, LaneMap, Lanes} from "../shared/ReactFiberLane";
import type { ReactContext, Wakeable, MutableSourceVersion, MutableSource } from "../shared/ReactTypes";
import type { TypeOfMode } from "../shared/ReactTypeOfMode";
import type { Flags } from "../shared/ReactFiberFlags";
import type { RootTag } from "../shared/ReactRootTags";
import {ConcurrentUpdate} from "./ReactFiberConcurrentUpdates";

export type ContextDependency<T> = {
	context: ReactContext<T>,
	next: ContextDependency<unknown> | null,
	memoizedValue: T,
};

export type Dependencies = {
	lanes: Lanes,
	firstContext: ContextDependency<unknown> | null
}

export type Fiber = {
	tag: WorkTag, // fiber的类型标签
	key: null | string, // 唯一标识符
	elementType: any, // 元素的值
	type: any, // 与此相关fiber的解析函数/类
	stateNode: any, // 对应的函数组件,或者Dom节点

	return: Fiber | null,

	// 单链表树结构
	child: Fiber | null,
	sibling: Fiber | null,
	index: number,

	// 上次用于附加此节点的引用
	// 将避免为prod和model添加所有者字段作为函数
	ref: null | ((handle: unknown) => void) & { _stringRef?: string },

	pendingProps: any,
	memoizedProps: any, // 用于创建输出的状态

	updateQueue: unknown, // Effect的更新链表

	dependencies: Dependencies, // fiber的依赖关系

	mode: TypeOfMode,

	// Effect
	flags: Flags,
	subtreeFlags: Flags,
	deletions: Array<Fiber> | null,

	// 单链表连接到下一个fiber，且具有副作用
	nextEffect: Fiber | null,

	/**
	 * 此子树中具有副作用的第一个和最后一个fiber。
	 * 允许当我们重用内部完成的工作时，我们需要重用链表的一部分这种fiber。
	 * */
	firstEffect: Fiber | null,
	lastEffect: Fiber | null,

	lanes: Lanes,
	childLanes: Lanes,

	// fiber池。更新的每个fiber都有一对。有些情况下，我们可以清理成对的fiber来节省内存
	alternate: Fiber | null
}

export type BaseFiberRootProperties = {
	tag: RootTag,

	containerInfo: any,
	// 持久更新使用
	pendingChildren: any,
	current: Fiber, // 当前的根fiber

	// @ts-ignore
	pingCache: WeakMap<Wakeable, Set<unknown>> | Map<Wakeable, Set<unknown>> | null,

	// 已完成的正在进行的工作HostRoot，准备提交。
	finishedWork: Fiber | null,

	// 顶部上下文对象，由renderSubtreeIntoContainer使用
	context: object | null,
	pendingContext: object | null,

	// 由useMutableSource挂钩使用，以避免hydration过程中撕裂。
	mutableSourceEagerHydrationData?: Array<MutableSource<any> | MutableSourceVersion> | null,

	// Scheduler.scheduleCallback返回的节点。表示根用户将处理的下一个渲染任务。
	callbackNode: any,
	callbackPriority: Lane,
	eventTimes: LaneMap<number>,
	expirationTimes: LaneMap<number>,
	hiddenUpdates: LaneMap<Array<ConcurrentUpdate> | null>,

	pendingLanes: Lanes,
	suspendedLanes: Lanes,
	pingedLanes: Lanes,
	expiredLanes: Lanes,
	mutableReadLanes: Lanes,

	finishedLanes: Lanes,

	entangledLanes: Lanes,
	entanglements: LaneMap<Lanes>,

	pooledCache: Cache | null,
	pooledCacheLanes: Lanes,

	/**
	 * TODO：在Fizz中，id生成特定于每个服务器配置。
	 *  我们也应该在fiber中这样做吗？暂时推迟此决定，因为除了上的内部字段之外，没有其他地方可以存储前缀，公共createRoot对象，fiber树当前没有对的引用。
	 * */
	identifierPrefix: string,

	onRecoverableError: (
		error: unknown,
		errorInfo: {digest?: string, componentStack?: string},
	) => void,
}

export type SuspenseHydrationCallbacks = {
	onHydrated?: (suspenseInstance: any) => void,
	onDeleted?: (suspenseInstance: any) => void,
};

type SuspenseCallbackOnlyFiberRootProperties = {
	hydrationCallbacks: null | SuspenseHydrationCallbacks,
	};

export interface FiberRoot extends BaseFiberRootProperties,
	SuspenseCallbackOnlyFiberRootProperties{}
