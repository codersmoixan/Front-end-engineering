import { now } from "./Scheduler";
import {
	Lanes,
	Lane,
	ReactFiberLane,
	NoTimestamp,
	pickArbitraryLane
} from "../shared/ReactFiberLane";
import { ReactTypeOfMode } from "../shared/ReactTypeOfMode";
import { deferRenderPhaseUpdateToNextBatch } from "../shared/ReactFeatureFlags";
import type { Fiber, FiberRoot } from "./ReactInternalTypes";

type ExecutionContext = number;

enum WorkContext {
	NoContext = 0b000,
	BatchedContext = 0b001,
	RenderContext = 0b010,
	CommitContext = 0b100
}

type RootExitStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6;
enum RootExit {
	RootInProgress,
	RootFatalErrored,
	RootErrored,
	RootSuspended,
	RootSuspendedWithDelay,
	RootCompleted,
	RootDidNotComplete
}

// 当前React的执行栈(执行上下文)
let executionContext: ExecutionContext = WorkContext.NoContext;
// 当前root节点
let workInProgressRoot: FiberRoot | null = null;
// 正在处理中的fiber节点
let workInProgress: Fiber | null = null;
// 正在渲染的车道(复数)
let workInProgressRootRenderLanes: Lanes = ReactFiberLane.NoLanes;

// fiber构造完后, root节点的状态: completed, errored, suspended等
let workInProgressRootExitStatus: RootExitStatus = RootExit.RootInProgress;
// 重大错误
let workInProgressRootFatalError: unknown = null;
// 在渲染期间更新（在交错事件中）的通道。
let workInProgressRootInterleavedUpdatedLanes: Lanes = ReactFiberLane.NoLanes;
// 整个render期间所使用到的所有lanes
let workInProgressRootIncludedLanes: Lanes = ReactFiberLane.NoLanes;
// 在渲染阶段更新的通道
let workInProgressRootRenderPhaseUpdatedLanes: Lanes = ReactFiberLane.NoLanes;
// 在此渲染期间被 ping 过（在交错事件中）的通道。
let workInProgressRootPingedLanes: Lanes = ReactFiberLane.NoLanes;
// 在render期间被跳过(由于优先级不够)的lanes: 只包括未处理的updates, 不包括被复用的fiber节点
let workInProgressRootSkippedLanes: Lanes = ReactFiberLane.NoLanes;

// 防止无限循环和嵌套更新
const NESTED_UPDATE_LIMIT = 50;
let nestedUpdateCount: number = 0;
let rootWithNestedUpdates: FiberRoot | null = null;
let isFlushingPassiveEffects = false;
let didScheduleUpdateDuringPassiveEffects = false;

const NESTED_PASSIVE_UPDATE_LIMIT = 50;
let nestedPassiveUpdateCount: number = 0;
let rootWithPassiveNestedUpdates: FiberRoot | null = null;

//如果在同一个事件中安排了两个更新，我们应该将它们的事件时间视为同时发生，即使实际时间在第一次和第二次调用之间已经提前。
let currentEventTime: number = NoTimestamp;
let currentEventTransitionLane: Lanes = ReactFiberLane.NoLanes;

let isRunningInsertionEffect = false;

export function requestEventTime() {
	if ((executionContext & (WorkContext.RenderContext | WorkContext.CommitContext)) !== WorkContext.NoContext) {
		return now();
	}
	if (currentEventTime !== NoTimestamp) {
		return currentEventTime;
	}
	currentEventTime = now();
	return currentEventTime;
}

export function requestUpdateLane(fiber: Fiber): Lane {
	const mode = fiber.mode;
	if ((mode & ReactTypeOfMode.ConcurrentMode) === ReactTypeOfMode.NoMode) {
		return (ReactFiberLane.SyncLane as Lane);
	} else if (
		!deferRenderPhaseUpdateToNextBatch &&
		(executionContext & WorkContext.RenderContext) !== WorkContext.NoContext &&
		workInProgressRootRenderLanes !== ReactFiberLane.NoLanes
	) {
		return pickArbitraryLane(workInProgressRootRenderLanes);
	}
}

export function isUnsafeClassRenderPhaseUpdate(fiber: Fiber) {
	return (
		(!deferRenderPhaseUpdateToNextBatch ||
			(fiber.mode & ReactTypeOfMode.ConcurrentMode) === ReactTypeOfMode.NoMode) &&
		(executionContext & WorkContext.RenderContext) !== WorkContext.NoContext
	);
}
