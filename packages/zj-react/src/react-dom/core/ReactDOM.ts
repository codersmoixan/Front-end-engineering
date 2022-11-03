import {
	getPublicRootInstance
} from "../../react-reconciler/ReactFiberReconciler";
import { createContainer } from "../../react-reconciler/ReactFiberReconciler";
import { ReactRootTags } from "../../shared/ReactRootTags";
import {
	markContainerAsRoot
} from "../../react-reconciler/ReactDOMComponentTree";
import { updateContainer } from "../../react-reconciler/ReactFiberReconciler";
import type { FiberRoot } from "../../react-reconciler/ReactInternalTypes";
import type { DOMContainer } from "../interface"

function legacyCreateRootFromDOMContainer(
	container: DOMContainer,
	initialChildren: any,
	parentComponent: any,
	isHydrationContainer: boolean,
	callback?: Function,
): FiberRoot {
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

		return root
	}
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
		// todo 初次调用，root还未初始化，会进入此分支
		//  创建ReactDOMRoot对象，初始化react应用场景
		root = legacyCreateRootFromDOMContainer(
			container,
			children,
			parentComponent,
			forceHydrate,
			callback
		)
	} else {
		// todo root已经初始化，二次调用render会进入
		//  1. 获取fiberRoot对象
		root = maybeRoot

		// todo 2. 调用更新
		updateContainer(children, root, parentComponent, callback)
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
