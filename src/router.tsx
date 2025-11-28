import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import App from './App'

const HomePage = lazy(() => import('./pages/Home'))
const PlanPage = lazy(() => import('./pages/Plan'))
const OfflineFallbackPage = lazy(() => import('./pages/OfflineFallback'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'plan', element: <PlanPage /> },
      { path: 'offline', element: <OfflineFallbackPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
