import {WorkerData} from './types'

export default function worker<I>() {
  self.onmessage = ({data}: MessageEvent<WorkerData<I>>) => {
    const actualCallback = new Function('return ' + data.callback)()
    if (data.updateType === 'every') {
      data.data.forEach((item) => {
        self.postMessage(actualCallback(item))
      })
    }
    if (data.updateType === 'batch') {
      self.postMessage(data.data.map(actualCallback))
    }
  }
}

