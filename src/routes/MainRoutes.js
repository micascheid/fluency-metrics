import {lazy} from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import {Support} from "@mui/icons-material";
import Terms from "../pages/extra-pages/Terms";

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SupportPage = Loadable(lazy(() => import('pages/extra-pages/Support')));

// render - utilities


// ==============================|| AUTH ROUTING - MAIN ROUTES ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <MainLayout/>
    ),
    children: [
        {
            path: '/',
            element:
                <DashboardDefault/>

        },
        {
            path: '/tool',
            element:
                <DashboardDefault/>

        },
        {
            path: 'support',
            element: <SupportPage/>
        },
        {
            path: 'terms-of-service',
            element: <Terms />
        }
    ]
};


export default MainRoutes;
