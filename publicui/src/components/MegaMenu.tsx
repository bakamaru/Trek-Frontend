import React from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

// API Response type based on the provided structure
type ApiMenuItem = {
    MenuId: number;
    Name: string;
    SubTitle: string | null;
    Url: string;
    CssClass: string;
    IsChild: boolean;
    ParentId: number;
    MenuOrder: number;
    MenuGroupId: number;
};

interface MegaMenuProps {
    items?: ApiMenuItem[];
    isLoading?: boolean;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ items, isLoading = false }) => {
    if (isLoading) return <div className="p-8"><LoadingSpinner /></div>;
    if (!items || items.length === 0) return null;

    // Group items by their hierarchy
    const rootGroups = items
        .filter(item => item.ParentId === 0)
        .sort((a, b) => a.MenuOrder - b.MenuOrder);

    const getChildrenByParent = (parentId: number) => {
        return items
            .filter(item => item.ParentId === parentId)
            .sort((a, b) => a.MenuOrder - b.MenuOrder);
    };

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl px-4 md:px-8 pb-4 md:pb-8 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar"
            style={{
                width: rootGroups.length === 1 ? '350px' : rootGroups.length === 2 ? '650px' : 'min(1200px, 95vw)',
                gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`
            }}
        >
            {rootGroups.map((rootGroup) => {
                const subGroups = getChildrenByParent(rootGroup.MenuId);

                return (
                    <div key={rootGroup.MenuId} className="flex flex-col">
                        <h4 className="font-bold text-gray-800 dark:text-gray-100 border-b-2 border-blue-700 sticky top-0 bg-white dark:bg-gray-800 z-10 pt-4 md:pt-8 pb-2 mb-4">
                            {rootGroup.Name}
                        </h4>
                        <div className="space-y-4">
                            {subGroups.map((subGroup) => {
                                const items = getChildrenByParent(subGroup.MenuId);

                                return (
                                    <div key={subGroup.MenuId}>
                                        {subGroup.Url === '#' ? (
                                            <h5 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-2">
                                                {subGroup.Name}
                                            </h5>
                                        ) : (
                                            <a
                                                href={subGroup.Url}
                                                className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-2 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200 block"
                                            >
                                                {subGroup.Name}
                                                {subGroup.SubTitle && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                        {subGroup.SubTitle}
                                                    </span>
                                                )}
                                            </a>
                                        )}
                                        <ul className="space-y-2 ml-2">
                                            {items.map((item) => (
                                                <li key={item.MenuId}>
                                                    <a
                                                        href={item.Url}
                                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200 text-sm block"
                                                    >
                                                        {item.Name}
                                                        {item.SubTitle && (
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                                {item.SubTitle}
                                                            </span>
                                                        )}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MegaMenu;