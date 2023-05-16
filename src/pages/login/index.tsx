import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStorage, setStorage } from '@/utils/storage'

import { Input, Form, Button, Message } from '@arco-design/web-react'
import { getFormInstance } from '@arco-design/web-react/es/Form/useForm'

import './index.scss'
import login, { LoginResp, type LoginData } from '@/apis/login'
import { ServerResponse } from '@/types'

const FormItem = Form.Item

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef(getFormInstance())
  const navigate = useNavigate()

  const handleLoginClick = async () => {
    try {
      setLoading(true)

      formRef.current.validate()
      const data = formRef.current.getFields()
      const loginResp = await login(data as LoginData)

      if (loginResp.success) {
        setStorage('token', (loginResp.data as LoginResp).token)
        setLoading(false)
        navigate('/home')
      } else {
        setLoading(false)
        if (loginResp.error) {
          Message.error('请求出错，请重试')
        } else {
          Message.error((loginResp.data as ServerResponse<LoginResp>).message)
        }
      }
    } catch (error) {
      setLoading(false)
      return
    }
  }

  // 检查是否登陆
  useEffect(() => {
    const token = getStorage('token')
    // 未登陆则跳转到登录页面
    if (!token) {
      navigate('/login')
    }
  })

  return (
    <div className="login-wrapper">
      <h1>LTC20 OrderBook Manage</h1>
      <Form ref={formRef} layout="vertical">
        <FormItem field="username" label="账号" rules={[{ required: true }]}>
          <Input placeholder="请输入你的账号" />
        </FormItem>
        <FormItem field="password" label="密码" rules={[{ required: true }]}>
          <Input.Password placeholder="请输入你的密码" />
        </FormItem>
        <Button type="primary" onClick={handleLoginClick} loading={loading}>
          登陆
        </Button>
      </Form>
    </div>
  )
}

export default Login
