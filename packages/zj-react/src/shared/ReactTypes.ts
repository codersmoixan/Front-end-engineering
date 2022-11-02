import type { Fiber } from "../react-reconciler/ReactInternalTypes";

export type ReactProviderType<T> = {
	$$typeof: Symbol | number,
	_context: ReactContext<T>,
};

export type ReactContext<T> = {
	$$typeof: Symbol | number,
	Consumer: ReactContext<T>,
	Provider: ReactProviderType<T>,
	_currentValue: T,
	_currentValue2: T,
	_threadCount: number,
	_currentRenderer?: Object | null,
	_currentRenderer2?: Object | null,
	displayName?: string,
	_defaultValue: T,
	_globalName: string
}

/**
 * Suspense抛出的东西所需的Thenable的子集。
 * 这不需要将值传递给任何一个处理程序。
 * */
export interface Wakeable {
	then(onFulfill: () => unknown, onReject: () => unknown): void | Wakeable;
}

export type MutableSourceVersion = NonNullable<unknown>;

export type MutableSourceGetVersionFn = (
	source: NonNullable<unknown>,
) => MutableSourceVersion;

export type MutableSource<Source extends NonNullable<unknown>> = {
	_source: Source,

	_getVersion: MutableSourceGetVersionFn,

	/**
	 * 跟踪此源在最近读取时的版本。
	 * 用于确定在订阅源之前是否可以安全读取源。
	 * 版本号仅在安装期间使用，
	 * 因为用于确定订阅后的安全性的机制是过期时间。
	 * 作为支持多个并发渲染器的解决方案，
	 * 我们将一些渲染器归类为主要渲染器，而另一些渲染器则归类为次要渲染器。
	 * 我们只希望最多有两个并发渲染器：
	 * React Native（主要）和Fabric（次要）；
	 * 反应DOM（初级）和反应ART（次级）。
	 * 二级渲染器将其上下文值存储在单独的字段中。
	 * 我们对上下文使用相同的方法。
	 * */
	_workInProgressVersionPrimary: null | MutableSourceVersion,
	_workInProgressVersionSecondary: null | MutableSourceVersion,
};
