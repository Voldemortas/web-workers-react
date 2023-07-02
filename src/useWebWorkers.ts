import {useState, useEffect} from 'react'
import worker from './worker'
import {getGroupSizes, makeWorker} from './utils'
import type {useWebWorkersOptions} from './types.js'

export default function useWebWorkers<I, O>(
  data: I[],
  groupCount: number,
  fn: (item: I) => O,
  {
    updateFinished = true,
    updateState = true,
    updateType = 'every',
  }: useWebWorkersOptions = {}
) {
  const groupsArrays = Array.from({length: groupCount}).map((_, i) => i)
  const groupSizes = getGroupSizes(data.length, groupCount).reduce(
    (a: number[], b, i) => [...a, a[i] + b],
    [0]
  )
  const slicedArrays = groupsArrays.map((id) =>
    data.slice(groupSizes[id], groupSizes[id + 1])
  )
  const [state, setState] = useState<O[]>([])
  const [finished, setFinished] = useState(
    groupSizes
      .slice(1)
      .map((val, id) => ({finished: 0, total: val - groupSizes[id]}))
  )
  let workers: Worker[] = []

  useEffect(() => {
    if (window.Worker) {
      workers = groupsArrays.map((id) =>
        makeWorker<I, O>(
          worker,
          id.toString(),
          slicedArrays[id],
          fn,
          (response) => {
            if (updateState) {
              setState((prev) => [...prev, response])
            }
            if (updateFinished) {
              setFinished((prev) => {
                const newFinished = [...prev]
                newFinished[id] = {
                  ...newFinished[id],
                  finished:
                    updateType === 'every'
                      ? newFinished[id].finished + 1
                      : newFinished[id].total,
                }
                return newFinished
              })
            }
          },
          updateType
        )
      )
    }

    return () => {
      workers.forEach((w) => w.terminate())
    }
  }, [groupCount])
  return {result: state.flat(), finished}
}

