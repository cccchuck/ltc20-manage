import { useEffect, useState } from 'react'
import './index.scss'

import {
  Tabs,
  Select,
  Button,
  Message,
  Table,
  Space,
  TableColumnProps,
} from '@arco-design/web-react'
import getAllOrders, { Order } from '@/apis/getAllOrders'
const TabPane = Tabs.TabPane
const Option = Select.Option

import { type Orders } from '@/apis/getAllOrders'
import { ServerResponse } from '@/types'
import { getStorage, removeStorage } from '@/utils/storage'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/utils'
import delOrder from '@/apis/delOrder'
import updateOrder from '@/apis/updateOrder'

const OrderManage = ({
  orderData,
  tableLoading,
  updateOrderData,
}: {
  orderData: Order[]
  tableLoading: boolean
  updateOrderData: () => void
}) => {
  const [loading, setLoading] = useState(false)

  const handleDoneOrderClick = async (id: string) => {
    setLoading(true)
    const updateOrderResp = await updateOrder(id, 1, 'done')
    if (updateOrderResp.success) {
      Message.success('操作成功')
    } else {
      if (updateOrderResp.error) {
        Message.error('操作失败，请重试')
      } else {
        Message.error(updateOrderResp.data?.message as string)
      }
    }
    setLoading(false)
    updateOrderData()
  }

  const handleCancleOrderClick = async (id: string) => {
    setLoading(true)
    const delOrderResp = await delOrder(id)
    if (delOrderResp.success) {
      Message.success('撤单成功')
    } else {
      if (delOrderResp.error) {
        Message.error('撤单失败，请重试')
      } else {
        Message.error(delOrderResp.data?.message as string)
      }
    }
    setLoading(false)
    updateOrderData()
  }

  const columns: TableColumnProps<Order>[] = [
    {
      title: '订单 ID',
      dataIndex: 'id',
    },
    {
      title: '铭文',
      dataIndex: 'inscription',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '数量',
      dataIndex: 'amount',
    },
    {
      title: '时间',
      dataIndex: 'updatedAt',
      render: (_: unknown, record) => (
        <span>{formatDate(record.createdAt)}</span>
      ),
    },
    {
      title: '微信',
      dataIndex: 'WeChatID',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (_: unknown, record) => (
        <span className={record.type}>
          {record.type === 'buy' ? '买入' : '卖出'}
        </span>
      ),
    },
    {
      title: '操作',
      render: (_: unknown, record) => (
        <Space>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              handleDoneOrderClick(record.id)
            }}
          >
            完成
          </Button>
          <Button
            type="primary"
            status="danger"
            loading={loading}
            onClick={() => {
              handleCancleOrderClick(record.id)
            }}
          >
            撤单
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="order-manager-wrapper">
      <Table
        loading={tableLoading}
        data={orderData || []}
        columns={columns}
        rowKey={(record) => record.id}
      />
    </div>
  )
}

const OrderCheck = ({
  orderData,
  tableLoading,
  updateOrderData,
}: {
  orderData: Order[]
  tableLoading: boolean
  updateOrderData: () => void
}) => {
  const [loading, setLoading] = useState(false)

  const handleConfirmOrderClick = async (id: string, type: string) => {
    setLoading(true)
    const updateOrderResp = await updateOrder(id, 1, type)
    if (updateOrderResp.success) {
      Message.success('操作成功')
    } else {
      if (updateOrderResp.error) {
        Message.error('操作失败，请重试')
      } else {
        Message.error(updateOrderResp.data?.message as string)
      }
    }
    setLoading(false)
    updateOrderData()
  }

  const handleRejectOrderClick = async (id: string) => {
    setLoading(true)
    const delOrderResp = await delOrder(id)
    if (delOrderResp.success) {
      Message.success('拒绝成功')
    } else {
      if (delOrderResp.error) {
        Message.error('拒绝失败，请重试')
      } else {
        Message.error(delOrderResp.data?.message as string)
      }
    }
    setLoading(false)
    updateOrderData()
  }
  const columns: TableColumnProps<Order>[] = [
    {
      title: '订单 ID',
      dataIndex: 'id',
    },
    {
      title: '铭文',
      dataIndex: 'inscription',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '数量',
      dataIndex: 'amount',
    },
    {
      title: '时间',
      dataIndex: 'updatedAt',
      render: (_: unknown, record) => (
        <span>{formatDate(record.createdAt)}</span>
      ),
    },
    {
      title: '微信',
      dataIndex: 'WeChatID',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (_: unknown, record) => (
        <span className={record.type}>
          {record.type === 'buy' ? '买入' : '卖出'}
        </span>
      ),
    },
    {
      title: '操作',
      render: (_: unknown, record) => (
        <Space>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              handleConfirmOrderClick(record.id, record.type)
            }}
          >
            通过
          </Button>
          <Button
            type="primary"
            status="danger"
            loading={loading}
            onClick={() => {
              handleRejectOrderClick(record.id)
            }}
          >
            拒绝
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="order-check-wrapper">
      <Table
        loading={tableLoading}
        data={orderData || []}
        columns={columns}
        rowKey={(record) => record.id}
      />
    </div>
  )
}

const inscriptions = [
  {
    key: '1',
    value: 'LITE',
  },
]

const Home = () => {
  const navigate = useNavigate()
  const [allOrders, setAllOrders] = useState<Orders>()
  const [tableLoading, setTableLoading] = useState<boolean>(true)
  const [defaultInscription, setDefaultInscription] = useState(
    inscriptions[0].value
  )

  const handleFetchOrders = async () => {
    setTableLoading(true)
    const allOrdersResp = await getAllOrders(defaultInscription)
    setTableLoading(false)
    if (allOrdersResp.success) {
      setAllOrders(allOrdersResp.data as Orders)
    } else {
      if (allOrdersResp.error) {
        Message.error('请求数据失败，请刷新网页重试')
      } else if (allOrdersResp.data) {
        const { code, message } = allOrdersResp.data as ServerResponse<Orders>
        if (code === 401) {
          removeStorage('token')
          navigate('/login')
        } else {
          Message.error(message)
        }
      }
    }
  }

  useEffect(() => {
    const token = getStorage('token')
    console.log(token)
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    const _handleFetchOrders = async () => {
      const allOrdersResp = await getAllOrders(defaultInscription)
      setTableLoading(false)
      if (allOrdersResp.success) {
        setAllOrders(allOrdersResp.data as Orders)
      } else {
        if (allOrdersResp.error) {
          Message.error('请求数据失败，请刷新网页重试')
        } else if (allOrdersResp.data) {
          const { code, message } = allOrdersResp.data as ServerResponse<Orders>
          if (code === 401) {
            removeStorage('token')
            navigate('/login')
          } else {
            Message.error(message)
          }
        }
      }
    }
    _handleFetchOrders()
  }, [defaultInscription, navigate])

  return (
    <div className="home-wrapper">
      <h1>LTC20 OrderBook Manager</h1>
      <div className="header">
        <div className="info">
          <h2>当前铭文：</h2>
          <Select
            defaultValue="LITE"
            style={{ width: 150 }}
            onChange={(value) => setDefaultInscription(value)}
          >
            {inscriptions.map(({ key, value }) => (
              <Option key={key} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <Button type="primary" onClick={() => handleFetchOrders()}>
            查询
          </Button>
        </div>
      </div>

      <div className="content">
        <Tabs defaultActiveTab="1">
          <TabPane key="1" title="订单管理">
            <OrderManage
              tableLoading={tableLoading}
              orderData={(allOrders?.limitBuyOrders || []).concat(
                allOrders?.limitSellOrders || []
              )}
              updateOrderData={handleFetchOrders}
            />
          </TabPane>
          <TabPane key="2" title="订单审核">
            <OrderCheck
              tableLoading={tableLoading}
              orderData={allOrders?.pendingOrders || []}
              updateOrderData={handleFetchOrders}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default Home
