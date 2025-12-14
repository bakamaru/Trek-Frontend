import React, { useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import theme from "../../theme.css"
import { Outlet, useNavigate } from 'react-router';
import Header from '../Header';
import AuthHelper from '../../utils/AuthHelper';

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        if (!AuthHelper.isLoggedIn()) {
            // Redirect to signin page if not authenticated
            navigate('/signin', { replace: true });
        }
    }, [navigate]);

    // Don't render dashboard if not logged in
    if (!AuthHelper.isLoggedIn()) {
        return null;
    }

    return (
        <div className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <Header />
            <div className="pt-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    <div className="lg:flex lg:gap-8 xl:gap-12">
                        <DashboardSidebar />
                        <main className="flex-1 mt-8 lg:mt-0">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default DashboardLayout;
