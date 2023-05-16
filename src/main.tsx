import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import '@arco-design/web-react/dist/css/arco.css'

import './index.scss'
import router from './router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
)
