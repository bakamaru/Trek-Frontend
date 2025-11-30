import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import { useGetAllTrekQuery, useDeleteTrekMutation } from "../../../../redux/trek/trekAPI";
import ComponentCard from "../../../../components/common/ComponentCard";
import DataGrid from "../../../../components/dataGrid/dataGrid";
import GridFilter from "../../../../components/dataGrid/gridFilter";
import { useFilter } from "../../../../hooks/useFilter";
import { FilterProps } from "../../../../types";
import toaster from "../../../../components/toster";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

interface IFilter {
    Name: any;
}

const FilterTrek = ({
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
                            placeholder="Search by trek name..."
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

const AdminTrekManagement: React.FC = () => {
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [trekList, setTrekList] = useState<any[]>([]);
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
        offset,
        searchText,
        filterData,
    } = useFilter<IFilter>({
        defaultValues: {
            Name: "",
        },
        limit,
        enableFilterList: true,
    });

    // Fetch trek list
    const { data: listData, isLoading: isListLoading, refetch: refetchList } = useGetAllTrekQuery({ query: searchText, limit, offset, ...filterData });

    const [deleteTrek] = useDeleteTrekMutation();

    useEffect(() => {
        if (listData && listData.Code === 200) {
            const treks = listData.Data || [];
            setTrekList(treks);
            if (treks.length > 0) {
                setRowTotal(treks[0]?.RowTotal || treks.length);
            }
        }
    }, [listData]);

    const handleDeleteTrek = async (trekId: number) => {
        if (!confirm("Are you sure you want to delete this trek?")) return;

        try {
            const response: any = await deleteTrek(trekId).unwrap();
            if (response.Code === 200) {
                toaster.success("Trek deleted successfully!");
                refetchList();
            } else {
                toaster.error("Failed to delete trek!");
            }
        } catch (error) {
            toaster.error("An error occurred while deleting the trek.");
        }
    };

    const columns = [
        {
            key: "trekId",
            label: "#No",
            render: (item: any) => {
                return item?.TrekId ? item?.TrekId : "N/A";
            },
        },
        {
            key: "name",
            label: "Trek Name",
            render: (item: any) => (
                <span className="break-words">{item.Name || "N/A"}</span>
            ),
        },
        {
            key: "Region",
            label: "Region",
            render: (item: any) => (
                <>{item.Region || "N/A"}</>
            ),
        },
        {
            key: "Category",
            label: "Category",
            render: (item: any) => (
                <>{item.Category || "N/A"}</>
            ),
        },
        {
            key: "durationDays",
            label: "Duration",
            render: (item: any) => {
                return item?.DurationDays ? `${item.DurationDays} days` : "N/A";
            },
        },
        {
            key: "ActivityLevel",
            label: "Activity Level",
            render: (item: any) => (
                <>{item.ActivityLevel || "N/A"}</>
            ),
        },
        {
            key: "isActive",
            label: "Status",
            render: (item: any) => {
                return item?.IsActive ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Inactive
                    </span>
                );
            },
        },
        {
            key: "actions",
            label: "Action",
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        title="Edit trek"
                        onClick={() => {
                            navigate(`/superadmin/trek/trek/edit?id=${row.TrekId}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                    <button
                        title="Delete trek"
                        onClick={() => handleDeleteTrek(row.TrekId)}
                        className="border p-2 rounded-md border-gray-300 text-red-500 cursor-pointer"
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="Treks">
                    <>
                        <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <FilterTrek
                                control={control}
                                handleSubmit={handleSubmit}
                                onFilterSubmit={onFilterSubmit}
                                handleFilterRemove={handleFilterRemove}
                                handleFilterReset={handleFilterReset}
                                handleFilterSearch={handleFilterSearch}
                                filterList={filterList}
                                setFilter={setFilter}
                            />
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => navigate("/superadmin/trek/trek/new")}
                                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                                >
                                    Add New
                                </button>
                            </div>
                        </div>
                        <DataGrid
                            columns={columns}
                            isLoading={isListLoading}
                            data={trekList || []}
                            text={`Total Treks (${rowTotal})`}
                            currentPage={offset}
                            totalPage={(rowTotal / limit) || 1}
                            isLine={true}
                            onPageChange={handlePagination}
                            isShadow
                        />
                    </>
                </ComponentCard>
            </div>
        </>
    );
};

export default AdminTrekManagement;
