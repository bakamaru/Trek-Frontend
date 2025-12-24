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
import { useDeleteGrantMutation, useGetGrantsQuery, useRevokeGrantMutation } from "../../../redux/setting/clientAPI";

interface IFilter {
    Name: any;
}

const FilterGrant = ({
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
                            placeholder="Subject / Application"
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

export default function GrantList() {
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [grants, setGrants] = useState([]);
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

    const { data, isLoading, refetch } = useGetGrantsQuery({ offset: offset, limit: limit, search: searchQuery });
    const [deleteGrant] = useDeleteGrantMutation();
    const [revokeGrant] = useRevokeGrantMutation();

    const columns = [
        {
            key: "subject",
            label: "Subject",
            render: (item: any) => item.subject || "N/A",
        },
        {
            key: "applicationName",
            label: "Application",
            render: (item: any) => item.applicationName || "N/A",
        },
        {
            key: "creationDate",
            label: "Created",
            render: (item: any) => item.creationDate ? new Date(item.creationDate).toLocaleDateString() : "N/A",
        },
        {
            key: "status",
            label: "Status",
            render: (item: any) => (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.status === "valid" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                    {item.status || "N/A"}
                </span>
            ),
        },
        {
            key: "scopes",
            label: "Scopes",
            render: (item: any) => (
                <div className="flex flex-wrap gap-1">
                    {item.scopes?.slice(0, 3).map((scope: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-blue-200">
                            {scope}
                        </span>
                    ))}
                    {item.scopes?.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded dark:bg-gray-700 dark:text-gray-300">
                            +{item.scopes.length - 3}
                        </span>
                    )}
                </div>
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
                            navigate(`/admin/openiddict/grant/edit?id=${row.id}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                    <button
                        title="Revoke"
                        onClick={() => {
                            if (confirm("Are you sure you want to revoke this grant?")) {
                                handleRevoke(row.id);
                            }
                        }}
                        className="border p-2 rounded-md border-gray-300 text-orange-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                    <button
                        title="Delete"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this grant?")) {
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

    const handleRevoke = async (id: string) => {
        try {
            const response = await revokeGrant(id).unwrap();
            toaster.success("Grant revoked successfully!");
            refetch();
        } catch (error) {
            console.error(error);
            toaster.error("An error occurred while revoking the grant.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await deleteGrant(id).unwrap();
            toaster.success("Grant deleted successfully!");
            refetch();
        } catch (error) {
            console.error(error);
            toaster.error("An error occurred while deleting the grant.");
        }
    };

    useEffect(() => {
        if (data) {
            setGrants(data.Rows as any);
            setRowTotal(data.RowTotal);
        }
    }, [data]);

    return (
        <div className="space-y-6">
            <ComponentCard title="Grant Management">
                <>
                    <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <FilterGrant
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
                                    navigate("/admin/openiddict/grant/new");
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
                        data={grants || []}
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
