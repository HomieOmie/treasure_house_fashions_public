import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import CertificatesPage from './pages/certificates/CertificatesPage';
import CertificatePage from './pages/certificates/CertificatePage';
import AgenciesPage from './pages/agencies/AgenciesPage';
import AgencyPage from './pages/agencies/AgencyPage';
import UsersPage from './pages/users/UsersPage';
import UserPage from './pages/users/UserPage';
import ReportPage from './pages/reports/ReportPage';
import SignIn from './pages/SignIn';
import { UnAuthorizedPage } from './pages/UnAuthorizedAccess';

function App() {
  // TODO: add callback that checks for authorization to view the list of users
  // In principle, only admins should be able to manage all users, while users should only be able to manage themselves
  //TODO: Add proper auth for route access
  const router = createBrowserRouter(
    [{
      path: '/signin',
      element: <SignIn/>
    },
    {
      path: 'redirect',
      element: <UnAuthorizedPage/>
    }
    ,{
      path: '/home',
      element: <Home />,
    },
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/certificates',
      element: <CertificatesPage />
    },
    {
      path: '/certificates/:id',
      element: <CertificatePage />,
    },
    {
      path: '/agencies',
      element: <AgenciesPage />,
    },
    {
      path: '/agencies/:id',
      element: <AgencyPage />,
    },
    {
      path: '/users',
      element: <UsersPage />,
    },
    {
      path: '/users/:id',
      element: <UserPage />,
    },
    {
      path: '/get_reports',
      element: <ReportPage />,
    }
  ]
  );
  
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
