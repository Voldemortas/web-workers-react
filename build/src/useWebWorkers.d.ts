import type { useWebWorkersOptions } from './types.js';
export default function useWebWorkers<I, O>(data: I[], groupCount: number, fn: (item: I) => O, { updateFinished, updateState, updateType, }?: useWebWorkersOptions): {
    result: (O extends readonly (infer InnerArr)[] ? InnerArr : O)[];
    finished: {
        finished: number;
        total: number;
    }[];
};
