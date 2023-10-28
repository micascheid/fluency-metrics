import {Fragment, lazy} from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import {Support} from "@mui/icons-material";
import Terms from "../pages/extra-pages/Terms";
import Pricing from "../pages/extra-pages/Pricing";
import ProfileError from "../pages/extra-pages/ProfileError";
import {DashboardProvider, ToolProvider} from "../context/ToolContext";
// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SupportPage = Loadable(lazy(() => import('pages/extra-pages/Support')));
const PricingPage = Loadable(lazy(() => import('pages/extra-pages/Pricing')));
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
            element: <Terms/>
        },
        {
            path: 'pricing',
            element: <Pricing/>
        },
        {
            path: 'profile-error',
            element: <ProfileError/>
        }
    ]
};


export default MainRoutes;
