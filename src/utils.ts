import {GroupsReducerType, UpdateType} from './types.js'

export function getGroupSizes(dataSize: number, groupCount: number): number[] {
  function reducer(
    obj: GroupsReducerType,
    currentIndex: number
  ): GroupsReducerType {
    const size = Math.round(obj.remainder / (groupCount - currentIndex))
    return {groups: [...obj.groups, size], remainder: obj.remainder - size}
  }
  return Array.from({length: groupCount})
    .map((_, i) => i)
    .reduce(reducer, {groups: [], remainder: dataSize}).groups
}

export function makeWorker<I, O>(
  workerFunc: () => void,
  name: string,
  data: I[],
  callback: (item: I) => O,
  onResponse: (response: O) => void,
  updateType: UpdateType
) {
  const code = workerFunc.toString()
  const blob = new Blob([`(${code})()`])
  const createdWorker = new Worker(URL.createObjectURL(blob), {name})
  createdWorker.postMessage({data, callback: callback.toString(), updateType})
  createdWorker.addEventListener('message', (r) =>
    onResponse(updateType === 'every' ? (r.data as O) : (r.data.flat() as O))
  )
  return createdWorker
}

