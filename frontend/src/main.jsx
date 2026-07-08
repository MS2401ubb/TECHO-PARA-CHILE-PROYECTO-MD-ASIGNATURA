import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Root from './pages/Root'
import Error404 from './pages/Error404'
import Login from './pages/Login'
import Home from './pages/Home'
import EnrollVoluntario from './pages/EnrollVoluntario'
import Logout from './pages/Logout'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import MiCuadrillaVivienda from './pages/MiCuadrillaVivienda'
import EnviarReporte from './pages/EnviarReporte'
import Postulantes from './pages/Postulantes'
import GestionVoluntarios from './pages/GestionVoluntarios'
import GestionarPersonal from './pages/GestionarPersonal'
import GestionarViviendas from './pages/GestionarViviendas'
import Reportes from './pages/Reportes'
import LogisticaTransporte from './pages/LogisticaTransporte'
import LogisticaAlimentacion from './pages/LogisticaAlimentacion'
import IngresarToken from './pages/IngresarToken'
import RegistroDatosEspontaneo from './pages/RegistroEspontaneo'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import { ROLES_VOLUNTARIOS } from './constants/roles' // en vez de 'Voluntario' para allowed roles específicos, este array para incluir voluntarios espontáneos, más que nada, para mantener orden en ProtectedRoutes
import './styles/style.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,  
    errorElement: <Error404 />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: '/login', element: <Login /> },
      { path: '/postulacion-voluntario', element: <EnrollVoluntario /> },
      { path: '/ingresar-token',element: <IngresarToken/>},
      { path: '/registro-datos-express',element: <RegistroDatosEspontaneo/>},
      {
        element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
        children: [
          { path: '/home', element: <Home /> },
          { path: '/logout', element: <Logout /> },
          { path: '/mi-perfil', element: <Profile /> },
          {
            path: '/mi-cuadrilla-vivienda',
            element: (
              <ProtectedRoute allowedRoles={[...ROLES_VOLUNTARIOS, 'Jefe de Cuadrilla']}>
                <MiCuadrillaVivienda />
              </ProtectedRoute>
            ),
          },
          {
            path: '/enviar-reporte',
            element: (
              <ProtectedRoute allowedRoles={['Jefe de Cuadrilla', 'Encargado de Voluntarios']}>
                <EnviarReporte />
              </ProtectedRoute>
            ),
          },
          {
            path: '/postulantes',
            element: (
              <ProtectedRoute allowedRoles={['Encargado de Voluntarios']}>
                <Postulantes />
              </ProtectedRoute>
            ),
          },
          {
            path: '/gestionar-voluntarios',
            element: (
              <ProtectedRoute allowedRoles={['Encargado de Voluntarios', 'Encargado de Central', 'admin']}>
                <GestionVoluntarios />
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard',
            element: (
              <ProtectedRoute allowedRoles={['Encargado de Central', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: '/gestionar-personal',
            element: (
              <ProtectedRoute allowedRoles={['Encargado de Central', 'admin']}>
                <GestionarPersonal />
              </ProtectedRoute>
            ),
          },
          {
            path: '/gestionar-viviendas',
            element: (
              <ProtectedRoute allowedRoles={['Encargado de Central', 'admin']}>
                <GestionarViviendas />
              </ProtectedRoute>
            ),
          },
          {
            path: '/reportes',
            element: (
              <ProtectedRoute allowedRoles={['Encargado de Central', 'admin']}>
                <Reportes />
              </ProtectedRoute>
            ),
          },
          {
            path: '/logistica-transporte',
            element: (
              <ProtectedRoute allowedRoles={['Encargado de Central', 'admin']}>
                <LogisticaTransporte />
              </ProtectedRoute>
            ),
          },
          {
            path: '/logistica-alimentacion',
            element: (
              <ProtectedRoute allowedRoles={['Encargado de Central', 'admin']}>
                <LogisticaAlimentacion />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
