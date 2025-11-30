// import React from "react";

// interface TrekSearchSortProps {
//     searchValue: string;
//     onSearchChange: (value: string) => void;
//     sortValue: string;
//     onSortChange: (value: string) => void;
// }

// const TrekSearchSort: React.FC<TrekSearchSortProps> = ({
//     searchValue,
//     onSearchChange,
//     sortValue,
//     onSortChange,
// }) => {
//     return (
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             {/* Search */}
//             <div className="relative flex-1 max-w-md">
//                 <input
//                     type="text"
//                     placeholder="Search by name, region, or category..."
//                     value={searchValue}
//                     onChange={(e) => onSearchChange(e.target.value)}
//                     className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
//                 />
//                 <svg
//                     className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                 </svg>
//             </div>

//             {/* Sort */}
//             <div className="flex items-center gap-2">
//                 <label htmlFor="sort" className="text-xs font-medium text-gray-500 uppercase">
//                     Sort:
//                 </label>
//                 <select
//                     id="sort"
//                     value={sortValue}
//                     onChange={(e) => onSortChange(e.target.value)}
//                     className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
//                 >
//                     <option value="newest">Newest</option>
//                     <option value="oldest">Oldest</option>
//                     <option value="duration-short">Duration (Shortest)</option>
//                     <option value="duration-long">Duration (Longest)</option>
//                 </select>
//             </div>
//         </div>
//     );
// };

// export default TrekSearchSort;
