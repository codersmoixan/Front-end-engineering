import { createContainer } from "../../react-reconciler/ReactFiberReconciler";
import type { DOMContainer } from "../interface"

class ReactRoot {
	private _internalRoot: any;

	constructor(container: DOMContainer, isConcurrent: boolean) {
		this._internalRoot = createContainer(container, isConcurrent)
	}

	render() {

	}

	unmount() {

	}
}

export default ReactRoot
