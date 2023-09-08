import {lazy} from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Support from '../pages/extra-pages/Support';
import { getAuth } from 'firebase/auth';
import {UserContext} from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import AuthGuard from "../pages/authentication/AuthGuard";
import {StutteredContext, StutteredProvider} from "../context/StutteredContext";

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SupportPage = Loadable(lazy(() => import('pages/extra-pages/Support')));

// render - utilities


// ==============================|| AUTH ROUTING - MAIN ROUTES ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <MainLayout />
    ),
    children: [
        {
            path: '/',
            element:
                // <StutteredProvider>
                    <DashboardDefault/>
                // </StutteredProvider>
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element:
                        // <StutteredProvider>
                            <DashboardDefault/>
                        // </StutteredProvider>
                }
            ]
        },
        {
            path: 'support',
            element: <Support/>
        }
    ]
};


export default MainRoutes;
