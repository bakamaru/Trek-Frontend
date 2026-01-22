
import { Link, useNavigate } from "react-router";
import DataGrid from "../../../../components/dataGrid/dataGrid";
import { Controller } from "react-hook-form";
import GridFilter from "../../../../components/dataGrid/gridFilter";
import { useFilter } from "../../../../hooks/useFilter";
import { useEffect, useState } from "react";
import { FilterProps } from "../../../../types";
import ComponentCard from "../../../../components/common/ComponentCard";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import toaster from "../../../../components/toster";
import { useDeleteDestinationMutation, useGetDestinationsQuery, Destination } from "../../../../redux/trek/destinationAPI";

interface IFilter {
    Name: any;
}

const FilterDestination = ({
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
                            placeholder="Name"
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

export default function DestinationList() {
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [destinations, setDestinations] = useState<Destination[]>([]);
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

    const { data, isLoading, refetch } = useGetDestinationsQuery({ offset, limit, query: searchText });
    const [deleteDestination] = useDeleteDestinationMutation();

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this destination?")) {
            try {
                const res = await deleteDestination(id).unwrap();
                if (res.Code === 200) {
                    toaster.success("Destination deleted successfully");
                    refetch();
                } else {
                    toaster.error(res.Message || "Failed to delete destination");
                }
            } catch (error: any) {
                toaster.error(error?.data?.Message || "An error occurred");
            }
        }
    };

    const columns = [
        {
            key: "destinationId",
            label: "#No",
            render: (item: Destination) => {
                return item?.DestinationId ? item?.DestinationId : "N/A";
            },
        },
        {
            key: "name",
            label: "Name",
            render: (item: Destination) => (
                <Link
                    to={`/admin/destination/edit?id=${item?.DestinationId}`}
                    className="flex items-center gap-2 group-hover:text-primary pr-2"
                >
                    <span className="break-words">{item.Name}</span>
                </Link>
            ),
        },

        {
            key: "isTopDestination",
            label: "Is Top Destination",
            render: (item: Destination) => {
                return item?.IsTopDestination ? (
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                        Yes
                    </span>
                ) : (
                    <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-900 dark:text-gray-300">
                        No
                    </span>
                );
            },
        },
        {
            key: "IsActive",
            label: "Is Active",
            render: (item: Destination) => {
                return item?.IsActive ? (
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                        Yes
                    </span>
                ) : (
                    <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-900 dark:text-gray-300">
                        No
                    </span>
                );
            },
        },
        {
            key: "actions",
            label: "Action",
            render: (row: Destination) => (
                <div className="flex items-center gap-2">
                    <button
                        title="Edit"
                        onClick={() => {
                            navigate(`/admin/destination/edit?id=${row.DestinationId}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                    <button
                        title="Delete"
                        onClick={() => handleDelete(row.DestinationId)}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer text-red-500 hover:text-red-700"
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        if (data != undefined && data.Code == 200) {
            setDestinations(data.Data);
            if (data.Data.length > 0) {
                // Assuming API returns row total in first item or separately. 
                // Based on PostCategoryList, it seems to be in the first item of Data array if structure is consistent.
                setRowTotal(data.Data[0]?.RowTotal || 0);
            }
        }
    }, [data]);

    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="Destinations">
                    <>
                        <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <FilterDestination
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
                                    onClick={() => {
                                        navigate("/admin/destination/new");
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                                >
                                    Add New
                                </button>
                            </div>
                        </div>
                        <DataGrid
                            columns={columns}
                            isLoading={isLoading}
                            data={destinations || []}
                            text={`Total Records (${rowTotal})`}
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
}
