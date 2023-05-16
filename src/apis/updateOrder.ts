import { request } from '@/utils/request'

const updateOrder = async (id: string, status: number, type: string) => {
  return await request.POST<null>('/updateOrder', { id, status, type })
}

export default updateOrder
