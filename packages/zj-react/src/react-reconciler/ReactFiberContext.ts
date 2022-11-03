import { ReactWorkTags } from "../react-reconciler/ReactWorkTags"
import type { Fiber } from "./ReactInternalTypes";

export const emptyContextObject = {}

export function findCurrentUnmaskedContext(fiber: Fiber): Object {
	let node = fiber
	do {
		switch (node.tag) {
			case ReactWorkTags.HostRoot:
				return node.stateNode.context
			// 不考虑类组件
		}

		node = node.return
	} while (node !== null)

	return node
}
