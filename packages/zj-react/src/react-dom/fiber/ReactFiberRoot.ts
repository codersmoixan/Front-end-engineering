import { RootTag } from "../../shared/ReactRootTags";
import { FiberRootNode } from "./FiberNode";
import type { FiberRoot } from "../../react-reconciler/ReactInternalTypes";

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
): FiberRoot  {
	const root = new FiberRootNode(
		container,
		tag,
		hydrate,
		identifierPrefix,
		onRecoverableError
	) as any as FiberRoot

	return root
}
