import { createFiberRoot } from "./ReactFiberRoot";
import type { DOMContainer } from "../interface"
import type { RootTag } from "../../shared/ReactRootTags";

export function createContainer(
	containerInfo: DOMContainer,
	tag: RootTag,
	hydrationCallbacks: null | Function,
	isStrictMode: boolean,
	concurrentUpdatesByDefaultOverride: null | boolean,
	identifierPrefix: string,
	onRecoverableError: (error: unknown) => void,
) {
	return createFiberRoot(
		containerInfo,
		tag,
		false,
		null,
		hydrationCallbacks,
		isStrictMode,
		concurrentUpdatesByDefaultOverride,
		identifierPrefix,
		onRecoverableError
		)
}
