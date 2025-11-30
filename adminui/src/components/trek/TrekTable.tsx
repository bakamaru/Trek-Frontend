// import React from "react";
// import { MdDeleteOutline } from "react-icons/md";

// interface TrekTableProps {
//     treks: any[];
//     onRowClick: (trekId: number) => void;
//     onDelete: (trekId: number) => void;
//     isLoading: boolean;
// }

// const TrekTable: React.FC<TrekTableProps> = ({ treks, onRowClick, onDelete, isLoading }) => {
//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center py-12">
//                 <div className="text-sm text-gray-500">Loading treks...</div>
//             </div>
//         );
//     }

//     if (!treks || treks.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-12">
//                 <p className="text-sm text-gray-500">No treks found.</p>
//                 <p className="mt-1 text-xs text-gray-400">Create your first trek to get started.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="overflow-x-auto">
//             <table className="w-full">
//                 <thead>
//                     <tr className="border-b border-gray-200 bg-gray-50">
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                             Trek Name
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                             Region
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                             Category
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                             Duration
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                             Activity Level
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                             Status
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                             Actions
//                         </th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 bg-white">
//                     {treks.map((trek) => (
//                         <tr
//                             key={trek.trekId}
//                             onClick={() => onRowClick(trek.trekId)}
//                             className="group cursor-pointer transition hover:bg-gray-50"
//                         >
//                             <td className="px-6 py-4">
//                                 <div className="flex flex-col">
//                                     <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
//                                         {trek.name || "Unnamed Trek"}
//                                     </span>
//                                     {trek.url && (
//                                         <span className="mt-0.5 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
//                                             {trek.url}
//                                         </span>
//                                     )}
//                                 </div>
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-600">
//                                 {trek.regionName || trek.trekRegionName || "N/A"}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-600">
//                                 {trek.categoryName || trek.trekCategoryName || "N/A"}
//                             </td>
//                             <td className="px-6 py-4 text-sm text-gray-600">
//                                 {trek.durationDays ? `${trek.durationDays} days` : "N/A"}
//                             </td>
//                             <td className="px-6 py-4">
//                                 {trek.activityLevelName ? (
//                                     <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
//                                         {trek.activityLevelName}
//                                     </span>
//                                 ) : (
//                                     <span className="text-sm text-gray-400">N/A</span>
//                                 )}
//                             </td>
//                             <td className="px-6 py-4">
//                                 {trek.isActive ? (
//                                     <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
//                                         Active
//                                     </span>
//                                 ) : (
//                                     <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
//                                         Inactive
//                                     </span>
//                                 )}
//                             </td>
//                             <td className="px-6 py-4">
//                                 <button
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         onDelete(trek.trekId);
//                                     }}
//                                     className="rounded-md border border-gray-300 p-1.5 text-red-500 transition hover:bg-red-50 hover:border-red-300"
//                                     title="Delete Trek"
//                                 >
//                                     <MdDeleteOutline size={18} />
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
//                 <p className="text-xs text-gray-500">
//                     Total Records: <span className="font-medium text-gray-700">{treks.length}</span>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default TrekTable;
