import { request } from '@/utils/request'

export type LoginData = {
  username: string
  password: string
}

export type LoginResp = {
  token: string
}

const login = async (data: LoginData) => {
  return await request.POST<LoginResp>('/login', data)
}

export default login
