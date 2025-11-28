import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import App from './App'

const HomePage = lazy(() => import('./pages/Home'))
const AboutPage = lazy(() => import('./pages/About'))
const GamesHubPage = lazy(() => import('./pages/GamesHub'))
const GameDetailPage = lazy(() => import('./pages/GameDetail'))
const LettersHubPage = lazy(() => import('./pages/LettersHub'))
const LetterDetailPage = lazy(() => import('./pages/LetterDetail'))
const OfflineFallbackPage = lazy(() => import('./pages/OfflineFallback'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'games', element: <GamesHubPage /> },
      { path: 'games/:gameId', element: <GameDetailPage /> },
      { path: 'letters', element: <LettersHubPage /> },
      { path: 'letters/:letterId', element: <LetterDetailPage /> },
      { path: 'offline', element: <OfflineFallbackPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
