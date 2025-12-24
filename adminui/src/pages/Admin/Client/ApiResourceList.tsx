import { Link, useNavigate } from "react-router-dom";
import DataGrid from "../../../components/dataGrid/dataGrid";
import { Controller } from "react-hook-form";
import GridFilter from "../../../components/dataGrid/gridFilter";
import { useFilter } from "../../../hooks/useFilter";
import { useEffect, useState } from "react";
import { FilterProps } from "../../../types";
import ComponentCard from "../../../components/common/ComponentCard";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import toaster from "../../../components/toster";
import { useDeleteApiResourceMutation, useGetApiResourcesQuery } from "../../../redux/setting/clientAPI";

interface IFilter {
    Name: any;
}

const FilterApiResource = ({
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
                                        ...prev.filter((f: any) => f.key !== "Name"),
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

export default function ApiResourceList() {
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [apiResources, setApiResources] = useState([]);
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

    const searchQuery = searchText || (filterData as any)?.Name || "";

    const { data, isLoading, refetch } = useGetApiResourcesQuery({ offset: offset, limit: limit, search: searchQuery });
    const [deleteApiResource] = useDeleteApiResourceMutation();

    const columns = [
        {
            key: "name",
            label: "Name",
            render: (item: any) => (
                <Link
                    to={`/admin/openiddict/apiresource/edit?id=${item.id}`}
                    className="flex items-center gap-2 group-hover:text-primary pr-2"
                >
                    <span className="break-words font-medium">{item.name || "N/A"}</span>
                </Link>
            ),
        },
        {
            key: "displayName",
            label: "Display Name",
            render: (item: any) => item.displayName || "N/A",
        },
        {
            key: "description",
            label: "Description",
            render: (item: any) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description || "No description"}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Action",
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        title="Edit"
                        onClick={() => {
                            navigate(`/admin/openiddict/apiresource/edit?id=${row.id}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                    <button
                        title="Delete"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this API resource?")) {
                                handleDelete(row.id);
                            }
                        }}
                        className="border p-2 rounded-md border-gray-300 text-red-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                </div>
            ),
        },
    ];

    const handleDelete = async (id: string) => {
        try {
            const response = await deleteApiResource(id).unwrap();
            toaster.success("API Resource deleted successfully!");
            refetch();
        } catch (error) {
            console.error(error);
            toaster.error("An error occurred while deleting the API resource.");
        }
    };

    useEffect(() => {
        if (data) {
            setApiResources(data.Rows as any);
            setRowTotal(data.RowTotal);
        }
    }, [data]);

    return (
        <div className="space-y-6">
            <ComponentCard title="API Resource Management">
                <>
                    <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <FilterApiResource
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
                                    navigate("/admin/openiddict/apiresource/new");
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
                        data={apiResources || []}
                        text={`Total Records (${rowTotal})`}
                        currentPage={offset}
                        totalPage={Math.ceil(rowTotal / limit) || 1}
                        isLine={true}
                        onPageChange={handlePagination}
                        isShadow
                    />
                </>
            </ComponentCard>
        </div>
    );
}
