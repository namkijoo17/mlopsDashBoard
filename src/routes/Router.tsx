// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router'
import Loadable from '../layouts/full/shared/loadable/Loadable'

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')))
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')))

const Overview = Loadable(lazy(() => import('../views/mlops/overview')))
const Equipment = Loadable(lazy(() => import('../views/mlops/equipment')))
const EquipmentDetail = Loadable(lazy(() => import('../views/mlops/equipment/detail')))
const Models = Loadable(lazy(() => import('../views/mlops/models')))
const ModelDetail = Loadable(lazy(() => import('../views/mlops/models/detail')))
const DigitalTwin = Loadable(lazy(() => import('../views/mlops/digital-twin')))
const Training = Loadable(lazy(() => import('../views/mlops/training')))
const Alerts = Loadable(lazy(() => import('../views/mlops/alerts')))

const Error = Loadable(lazy(() => import('../views/auth/error')))
const Login2 = Loadable(lazy(() => import('../views/auth/auth2/login')))
const Register2 = Loadable(lazy(() => import('../views/auth/auth2/register')))
const ForgotPassword2 = Loadable(lazy(() => import('../views/auth/auth2/forgot-password')))
const TwoSteps2 = Loadable(lazy(() => import('../views/auth/auth2/two-steps')))
const Maintainance = Loadable(lazy(() => import('../views/auth/maintenance')))

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Overview /> },
      { path: '/equipment', element: <Equipment /> },
      { path: '/equipment/:id', element: <EquipmentDetail /> },
      { path: '/models', element: <Models /> },
      { path: '/models/:id', element: <ModelDetail /> },
      { path: '/digital-twin', element: <DigitalTwin /> },
      { path: '/training', element: <Training /> },
      { path: '/alerts', element: <Alerts /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/auth2/login', element: <Login2 /> },
      { path: '/auth/auth2/register', element: <Register2 /> },
      { path: '/auth/auth2/forgot-password', element: <ForgotPassword2 /> },
      { path: '/auth/auth2/two-steps', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintainance /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
]

const router = createBrowserRouter(Router)

export default router
