import {lazy} from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import {Support} from "@mui/icons-material";

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
        }
    ]
};


export default MainRoutes;
