type WorkTag =
	| 0
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15
	| 16
	| 17
	| 18;

enum ReactWorkTags {
	FunctionComponent = 0,
	ClassComponent,
	IndeterminateComponent,
	HostRoot,
	HostPortal,
	HostComponent,
	HostText,
	Fragment,
	Mode,
	ContextConsumer,
	ContextProvider,
	ForwardRef,
	Profiler,
	SuspenseComponent,
	MemoComponent,
	SimpleMemoComponent,
	LazyComponent,
	IncompleteClassComponent,
	DehydratedFragment,
	SuspenseListComponent,
	ScopeComponent = 21,
	OffscreenComponent,
	LegacyHiddenComponent,
	CacheComponent,
	TracingMarkerComponent
}

export {
	WorkTag,
	ReactWorkTags
}
