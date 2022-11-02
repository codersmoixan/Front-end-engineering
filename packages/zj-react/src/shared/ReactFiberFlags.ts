type Flags = number;

enum ReactFiberFlags {
	NoFlags = 0b00000000000000000000000000,
	PerformedWork = 0b00000000000000000000000001
}

export {
	Flags,
	ReactFiberFlags
}
