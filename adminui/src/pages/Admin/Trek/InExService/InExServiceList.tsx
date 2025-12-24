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
import { useDeleteInExServiceMutation, useGetAllInExServiceQuery } from "../../../../redux/trek/inExServiceAPI";

interface IFilter {
    Name: any;
}

const FilterInExService = ({
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

export default function InExServiceList() {
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [inExServices, setInExServices] = useState([]);
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

    const { data, isLoading, refetch } = useGetAllInExServiceQuery({ query: searchText, limit, offset, ...filterData });
    const [deleteInExService] = useDeleteInExServiceMutation();


    const columns = [
        {
            key: "inExServiceId",
            label: "#No",
            render: (item: any) => {
                return item?.InExServiceId ? item?.InExServiceId : "N/A";
            },
        },
        {
            key: "name",
            label: "Name",
            render: (item: any) => (
                <Link
                    to={`/superadmin/trek/inexservice/edit?id=${item?.InExServiceId}`}
                    className="flex items-center gap-2 group-hover:text-primary pr-2"
                >
                    <span className=" break-words">{item.Name}</span>
                </Link>
            ),
        },
        {
            key: "isIncluded",
            label: "Type",
            render: (item: any) => (
                <>
                    {item.IsIncluded ? "Included" : "Excluded"}
                </>
            ),
        },
        {
            key: "isActive",
            label: "Is Active",
            render: (item: any) => {
                return item?.IsActive ? "Yes" : "No";
            },
        },
        {
            key: "actions",
            label: "Action",
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        title="Edit"
                        onClick={() => {
                            navigate(`/superadmin/trek/inexservice/edit?id=${row.InExServiceId}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                    <button
                        title="Delete"
                        onClick={() => {
                            if (confirm("Are you sure?")) {
                                handleDelete(row.InExServiceId);
                            }
                        }}
                        className="border p-2 rounded-md border-gray-300 text-red-500 cursor-pointer"
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                </div>
            ),
        },
    ];

    const handleDelete = async (id: number) => {
        try {
            var response: any = await deleteInExService(id).unwrap();
            if (response.Code == 200) {
                toaster.success("Service deleted successfully!");
                refetch();
            } else {
                toaster.error("Failed to delete service!");
            }
        } catch (error) {
            toaster.error("An error occurred while deleting the service.");
        }
    };

    useEffect(() => {
        if (data != undefined && data.Code == 200) {
            setInExServices(data.Data);
            if (data.Data.length > 0) {
                setRowTotal(data.Data[0]?.RowTotal || 0);
            }
        }
    }, [data]);

    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="Inclusion/Exclusion Services">
                    <>
                        <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <FilterInExService
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
                                        navigate("/superadmin/trek/inexservice/new");
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
                            data={inExServices || []}
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
