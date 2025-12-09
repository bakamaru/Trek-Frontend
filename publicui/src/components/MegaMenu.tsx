import React from 'react';
import { Link } from 'react-router-dom';
import { useGetMainNavigationQuery } from '../redux/api/menuAPI';
import LoadingSpinner from './LoadingSpinner';
import { MegaMenuItem } from '../types/types';

interface MegaMenuProps {
    items?: MegaMenuItem[]; // Optional now as we fetch if not provided, or can be overridden
}

const MegaMenu: React.FC<MegaMenuProps> = ({ items: propItems }) => {
    const { data: apiItems, isLoading, error } = useGetMainNavigationQuery(undefined, {
        skip: !!propItems, // Skip fetching if items are passed as props
    });

    const items = propItems || apiItems;

    if (isLoading && !propItems) return <div className="p-8"><LoadingSpinner /></div>;
    if (error && !propItems) return <div className="p-8 text-red-500">Failed to load menu</div>;
    if (!items) return null;

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-2xl p-8 grid grid-cols-3 gap-8 w-[600px]">
            {items.map((item: MegaMenuItem, index: number) => (
                <div key={index}>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-4 border-b-2 border-blue-700 pb-2">{item.title}</h4>
                    <ul className="space-y-3">
                        {item.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                                <Link to={link.href} className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default MegaMenu;