import { createBrowserRouter, Navigate } from 'react-router-dom'
import FarmPage from '../Pages/FarmPage/FarmPage'
import StatsPage from '../Pages/StatsPage/StatsPage'
import SwapPage from '../Pages/SwapPage/SwapPage'

const PageRouter = createBrowserRouter([
  {
    path: '/swap',
    element: <SwapPage />,
  },
  {
    path: '/stats',
    element: <StatsPage />,
  },
  {
    path: '/farm',
    element: <FarmPage />,
  },
  {
    path: '*',
    element: <Navigate to='/swap' replace />,
  },
])

export default PageRouter
