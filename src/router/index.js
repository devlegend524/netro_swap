import { createBrowserRouter, Navigate } from 'react-router-dom'
import FarmPage from '../Pages/FarmPage/FarmPage'
import StatsPage from '../Pages/StatsPage/StatsPage'
import SwapPage from '../Pages/SwapPage/SwapPage'
import LaunchPad from '../Pages/LaunchPad/LaunchPad'
import Airdrop from '../Pages/Airdrop/Airdrop'

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
    path: '/launchpad',
    element: <LaunchPad />,
  },
  {
    path: '/airdrop',
    element: <Airdrop />,
  },
  {
    path: '*',
    element: <Navigate to='/swap' replace />,
  },
])

export default PageRouter
