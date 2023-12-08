/// <reference types="node" resolution-mode="require"/>
import { ExecOptions } from 'child_process';
export declare function execCapture(command: string | string[], options?: ExecOptions): Promise<string>;
export declare function execLive(command: string | string[], options?: ExecOptions): Promise<void>;
export declare function execSilent(command: string | string[], options?: ExecOptions): Promise<void>;
export declare function spawnLive(command: string | string[], options?: ExecOptions): () => void;
export declare function spawnSilent(command: string | string[], options?: ExecOptions): () => void;
export declare class SpawnError extends Error {
    command: string | string[];
    exitCode: number | null;
    constructor(command: string | string[], exitCode: number | null);
}
//# sourceMappingURL=exec.d.ts.map