export type GroupsReducerType = {groups: number[]; remainder: number}
export type UpdateType = 'every' | 'batch'
export type useWebWorkersOptions = {
  updateFinished?: boolean
  updateState?: boolean
  updateType?: UpdateType
}
export type WorkerData<I> = {
  data: I[]
  callback: string
  updateType: UpdateType
}

