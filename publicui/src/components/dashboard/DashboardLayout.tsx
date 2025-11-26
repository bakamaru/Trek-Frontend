import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import theme from "../../theme.css"

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="pt-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="lg:flex lg:gap-8 xl:gap-12">
                    <DashboardSidebar />
                    <main className="flex-1 mt-8 lg:mt-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
