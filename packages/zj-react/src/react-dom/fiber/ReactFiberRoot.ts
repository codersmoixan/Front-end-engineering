import { RootTag } from "../../shared/ReactRootTags";
import { FiberRootNode } from "./FiberNode";

export function createFiberRoot(
	container: any,
	tag: RootTag,
	hydrate: boolean,
	initialChildren: any,
	hydrationCallbacks: null | Function,
	isStrictMode: boolean,
	concurrentUpdatesByDefaultOverride: null | boolean,
	identifierPrefix: string,
	onRecoverableError: (error: unknown) => void,
)  {
	const root = new FiberRootNode(
		container,
		tag,
		hydrate,
		identifierPrefix,
		onRecoverableError
	)

	return root
}
