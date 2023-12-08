export declare function unpromisify<Res>(func: (successCallback: (res: Res) => void, failureCallback: (error: Error) => void) => Promise<Res> | void, normalizedSuccessCallback: (res: Res) => void, normalizedFailureCallback: (error: Error) => void): void;
//# sourceMappingURL=promise.d.ts.map