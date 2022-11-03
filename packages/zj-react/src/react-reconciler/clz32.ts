const log = Math.log;
const LN2 = Math.LN2;
function clz32Fallback(x: number): number {
	const asUint = x >>> 0;
	if (asUint === 0) {
		return 32;
	}
	return (31 - ((log(asUint) / LN2) | 0)) | 0;
}

// @ts-ignore
export const clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
