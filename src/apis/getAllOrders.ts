import { request } from '@/utils/request'

export type Order = {
  id: string
  inscription: string
  price: number
  amount: number
  type: string
  status: number
  createdAt: string
  updatedAt: string
}

export type Orders = {
  limitBuyOrders: Order[] | null
  limitSellOrders: Order[] | null
  recentOrders: Order[] | null
  pendingOrders: Order[] | null
}

const getAllOrders = async (inscription: string) => {
  return await request.GET<Orders>(`/getAllOrders?inscription=${inscription}`)
}

export default getAllOrders
