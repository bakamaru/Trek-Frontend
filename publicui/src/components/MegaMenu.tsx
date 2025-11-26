import React, { useContext } from 'react';
import { MegaMenuItem } from '../types/types';
import { Link } from 'react-router-dom';


interface MegaMenuProps {
    items: MegaMenuItem[];
}

const MegaMenu: React.FC<MegaMenuProps> = ({ items }) => {
    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-2xl p-8 grid grid-cols-3 gap-8 w-[600px]">
            {items.map((item, index) => (
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