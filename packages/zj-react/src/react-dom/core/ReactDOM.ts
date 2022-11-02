import ReactRoot from "./ReactRoot";
import {
	getPublicRootInstance
} from "../../react-reconciler/ReactFiberReconciler";
import { createContainer } from "../fiber/ReactFiberReconciler";
import { ReactRootTags } from "../../shared/ReactRootTags";
import type { Root, DOMContainer } from "../interface"
import {
	markContainerAsRoot
} from "../../react-reconciler/ReactDOMComponentTree";

function legacyCreateRootFromDOMContainer(
	container: DOMContainer,
	initialChildren: any,
	parentComponent: any,
	isHydrationContainer: boolean,
	callback?: Function,
): Root {
	if (isHydrationContainer) {} else {
		// todo 首先清除所有现有的内容。
		let rootSibling;

		while (rootSibling === container.lastChild) {
			container.removeChild(rootSibling)
		}

		if (typeof callback === 'function') {}

		const root = createContainer(
			container,
			ReactRootTags.LegacyRoot,
			null,
			false,
			false,
			'',
			null,
		)

		container._reactRootContainer = root
		markContainerAsRoot(root.current, container)

	}

	return (new ReactRoot(container, isConcurrent) as any as Root)
}

/**
 * @description 将子树渲染到容器中
 * */
function legacyRenderSubtreeIntoContainer(
	parentComponent: any,
	children: any,
	container: DOMContainer,
	forceHydrate: boolean,
	callback?: Function
) {
	const maybeRoot = container._reactRootContainer
	let root;
	if (!maybeRoot) {
		root = legacyCreateRootFromDOMContainer(
			container,
			children,
			parentComponent,
			forceHydrate,
			callback
		)
	} else {
		root = maybeRoot
	}

	return getPublicRootInstance(root)
}

export function render(
	element: any,
	container: DOMContainer,
	callback?: Function
) {
	return legacyRenderSubtreeIntoContainer(
		null,
		element,
		container,
		false,
		callback
	)
}
