import { request } from '@/utils/request'

const delOrder = async (id: string) => {
  return await request.POST<null>('/delOrder', { id })
}

export default delOrder
