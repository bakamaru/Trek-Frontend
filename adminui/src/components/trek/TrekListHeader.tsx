import React from "react";

interface TrekListHeaderProps {
    onNewTrek: () => void;
}

const TrekListHeader: React.FC<TrekListHeaderProps> = ({ onNewTrek }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Trek Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Admin panel to create, edit and curate trekking products.
                </p>
            </div>
            <button
                onClick={onNewTrek}
                className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
                New Trek
            </button>
        </div>
    );
};

export default TrekListHeader;
