import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ComponentCard from '../../../components/common/ComponentCard';
import DataGrid from "../../../components/dataGrid/dataGrid";
import { Controller } from "react-hook-form";
import GridFilter from "../../../components/dataGrid/gridFilter";
import { useFilter } from "../../../hooks/useFilter";
import { FilterProps } from "../../../types";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import {
    useGetRegionsQuery,
    useDeleteRegionMutation,
    useImportLocalizationMutation,
    useLazyExportLocalizationQuery
} from '../../../redux/setting/localizationAPI';
import toaster from '../../../components/toster';
import { LocaleRegion } from '../../../types/settingTypes';

interface IFilter {
    Name: any;
}

const FilterLocalization = ({
    control,
    handleSubmit,
    onFilterSubmit,
    handleFilterReset,
    handleFilterRemove,
    handleFilterSearch,
    filterList,
    setFilter,
}: FilterProps<IFilter>) => {
    return (
        <GridFilter
            onApplyClicked={() => {
                handleSubmit(onFilterSubmit)();
            }}
            onResetClicked={handleFilterReset}
            onSearchClicked={handleFilterSearch}
            filterList={filterList}
            removeFilter={handleFilterRemove}
        >
            <form className="flex flex-col gap-3">
                <Controller
                    name="Name"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder="Search..."
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            onChange={(e: any) => {
                                field.onChange(e.target.value);
                                setFilter &&
                                    setFilter((prev) => [
                                        ...prev.filter((f) => f.key !== "Name"),
                                        {
                                            key: "Name",
                                            value: e.target.value,
                                        },
                                    ]);
                            }}
                        />
                    )}
                />
            </form>
        </GridFilter>
    );
};

const Localization = () => {
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [regions, setRegions] = useState<LocaleRegion[]>([]);
    const [rowTotal, setRowTotal] = useState(0);

    const {
        control,
        handleSubmit,
        onFilterSubmit,
        handleFilterReset,
        handleFilterRemove,
        handleFilterSearch,
        handlePagination,
        filterList,
        setFilter,
        offset, // This is page number in useFilter usually
        searchText,
    } = useFilter<IFilter>({
        defaultValues: {
            Name: "",
        },
        limit,
        enableFilterList: true,
    });

    // API hook
    const { data: regionsData, isLoading, refetch } = useGetRegionsQuery({
        pageNo: offset,
        rowsPerPage: limit,
        query: searchText
    });

    const [deleteRegion] = useDeleteRegionMutation();
    const [importLocalization, { isLoading: isImporting }] = useImportLocalizationMutation();
    const [triggerExport] = useLazyExportLocalizationQuery();

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const cdnPath = import.meta.env.VITE_CDN_PATH || "";

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this region?")) {
            try {
                const res = await deleteRegion(id).unwrap();
                if (res.Code === 200) {
                    toaster.success("Region deleted successfully");
                    refetch();
                } else {
                    toaster.error(res.Message);
                }
            } catch (err: any) {
                toaster.error(err?.data?.Message || "Delete failed");
            }
        }
    };

    const handleExport = async (id: number) => {
        try {
            const blob = await triggerExport({ localRegionId: id }).unwrap();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Localization_${id}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toaster.success("Export successful");
        } catch (err) {
            toaster.error("Export failed");
        }
    };

    const handleImportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) {
            toaster.error("Please select a file first");
            return;
        }

        try {
            const res = await importLocalization({ ImportFile: importFile }).unwrap();
            if (res.Code === 200) {
                toaster.success("Import successful");
                setIsImportModalOpen(false);
                setImportFile(null);
                refetch();
            } else {
                toaster.error(res.Message || "Import failed");
            }
        } catch (err: any) {
            toaster.error(err?.data?.Message || "Import failed");
        }
    };

    useEffect(() => {
        if (regionsData != undefined && regionsData.Code == 200) {
            setRegions(regionsData.Data);
            if (regionsData.Data.length > 0) {
                // Assuming RowTotal is available if PaginatedResponse was updated correctly
                // or if the API returns it in the data array first element (common pattern in this codebase)
                // Let's check common.ts again. I added RowTotal to PaginatedResponse.
                // If the backend puts RowTotal in the response root (which is PaginatedResponse), then:
                // regionsData.RowTotal.
                // The Type I added:
                // export interface PaginatedResponse<T> { ... Data: T[]; RowTotal?: number; ... }
                // So it should be regionsData.RowTotal.
                // However, PostCategoryList uses `data.Data[0]?.RowTotal`. 
                // Let's stick to what I defined in common.ts unless I see otherwise.
                // But wait, the user's codebase pattern seems to contain RowTotal inside the object sometimes?
                // Step 62: setRowTotal(data.Data[0]?.RowTotal || 0);
                // I will try regionsData.RowTotal first if my types match, else fallback.
                // Since I defined PaginatedResponse, I rely on my definition.
                setRowTotal(regionsData.RowTotal || (regionsData.Data[0] as any)?.RowTotal || 0);
            } else {
                setRowTotal(0);
            }
        }
    }, [regionsData]);

    const columns = [
        {
            key: "country",
            label: "Country",
            render: (item: LocaleRegion) => (
                <div className="flex items-center gap-3">
                    {item.Flag && (
                        <img src={`${cdnPath}/country/flags/${item.Flag}`} alt="Flag" className="h-5 w-8 object-cover rounded shadow-sm" />
                    )}
                    <span className="hidden text-black dark:text-white sm:block">{item.CountryName}</span>
                </div>
            ),
        },
        {
            key: "culture",
            label: "Culture",
            render: (item: LocaleRegion) => <span className="text-black dark:text-white">{item.Culture}</span>,
        },
        {
            key: "isDefault",
            label: "Is Default",
            render: (item: LocaleRegion) => (
                <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${item.IsDefault ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                    {item.IsDefault ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            key: "isActive",
            label: "Is Active",
            render: (item: LocaleRegion) => (
                <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${item.IsActive ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                    {item.IsActive ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Action",
            render: (row: LocaleRegion) => (
                <div className="flex items-center gap-2">
                    <button
                        title="Export"
                        onClick={() => handleExport(row.LocaleRegionId)}
                        className="hover:text-primary"
                    >
                        Export
                    </button>
                    <button
                        title="Edit"
                        onClick={() => navigate(`/superadmin/setting/localization/edit/${row.LocaleRegionId}`)}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:bg-gray-100 dark:hover:bg-boxdark"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                    <button
                        title="Delete"
                        onClick={() => handleDelete(row.LocaleRegionId)}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:text-danger hover:bg-gray-100 dark:hover:bg-boxdark"
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <ComponentCard title="Localization">
                <>
                    <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <FilterLocalization
                            control={control}
                            handleSubmit={handleSubmit}
                            onFilterSubmit={onFilterSubmit}
                            handleFilterRemove={handleFilterRemove}
                            handleFilterReset={handleFilterReset}
                            handleFilterSearch={handleFilterSearch}
                            filterList={filterList}
                            setFilter={setFilter}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-warning shadow-theme-xs hover:bg-opacity-90"
                            >
                                Import
                            </button>
                            <button
                                onClick={() => navigate("/superadmin/setting/localization/new")}
                                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                            >
                                Add New
                            </button>
                        </div>
                    </div>

                    <DataGrid
                        columns={columns}
                        isLoading={isLoading}
                        data={regions || []}
                        text={`Total Records (${rowTotal})`}
                        currentPage={offset}
                        totalPage={Math.ceil(rowTotal / limit) || 1}
                        isLine={true}
                        onPageChange={handlePagination}
                        isShadow
                    />
                </>
            </ComponentCard>

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-lg rounded-lg bg-white p-8 dark:bg-boxdark">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-black dark:text-white">Import Localization</h3>
                            <button onClick={() => setIsImportModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                X
                            </button>
                        </div>
                        <form onSubmit={handleImportSubmit}>
                            <div className="mb-5">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">Upload Excel File</label>
                                <input
                                    type="file"
                                    accept=".xls,.xlsx"
                                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsImportModalOpen(false)} className="rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isImporting} className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90">
                                    {isImporting ? 'Importing...' : 'Import'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Localization;
