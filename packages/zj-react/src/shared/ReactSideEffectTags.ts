type SideEffectTag = number

enum ReactSideEffectTags {
	NoEffect = 0b000000000000,
	PerformedWork = 0b000000000001,

	Placement = 0b000000000010,
	Update = 0b000000000100,
	PlacementAndUpdate = 0b000000000110,
	Deletion = 0b000000001000,
	ContentReset = 0b000000010000,
	Callback = 0b000000100000,
	DidCapture = 0b000001000000,
	Ref = 0b000010000000,
	Snapshot = 0b000100000000,
	Passive = 0b001000000000,

	// todo Passive & Update & Callback & Ref & Snapshot (被动 & 更新 & 回调 & 参考 & 快照)
	LifecycleEffectMask = 0b001110100100,

	// todo 所有宿主效果的联合
	HostEffectMask = 0b001111111111,

	Incomplete = 0b010000000000,
	ShouldCapture = 0b100000000000
}

export {
	SideEffectTag,
	ReactSideEffectTags
}
