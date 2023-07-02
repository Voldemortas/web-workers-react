import { UpdateType } from './types.js';
export declare function getGroupSizes(dataSize: number, groupCount: number): number[];
export declare function makeWorker<I, O>(workerFunc: () => void, name: string, data: I[], callback: (item: I) => O, onResponse: (response: O) => void, updateType: UpdateType): Worker;
