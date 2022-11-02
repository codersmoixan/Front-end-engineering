type TypeOfMode = number

enum ReactTypeOfMode {
	NoContext = 0b000,
	ConcurrentMode= 0b001,
	StrictMode = 0b010,
	ProfileMode = 0b100
}

export {
	TypeOfMode,
	ReactTypeOfMode
}
