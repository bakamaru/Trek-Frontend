import { Link, useNavigate } from "react-router";
import DataGrid from "../../../components/dataGrid/dataGrid";
import { Controller } from "react-hook-form";
import GridFilter from "../../../components/dataGrid/gridFilter";
import { useFilter } from "../../../hooks/useFilter";
import { useEffect, useState } from "react";
import { FilterProps } from "../../../types";
import ComponentCard from "../../../components/common/ComponentCard";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import toaster from "../../../components/toster";
import { useDeleteSeoMutation, useGetSeoAllQuery } from "../../../redux/seo/seoAPI";
import { SeoResponse } from "../../../types/seoTypes";

interface IFilter {
    Search: any;
}

const FilterSeo = ({
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
                    name="Search"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder="Search by URL or Type"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            onChange={(e: any) => {
                                field.onChange(e.target.value);
                                setFilter &&
                                    setFilter((prev) => [
                                        ...prev.filter((f) => f.key !== "Search"),
                                        {
                                            key: "Search",
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

export default function SEOList() {
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [seoList, setSeoList] = useState<SeoResponse[]>([]);
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
            Search: "",
        },
        limit,
        enableFilterList: true,
    });

    const searchQuery = filterList.find((f) => f.key === "Search")?.value || "";

    const { data, isLoading, refetch } = useGetSeoAllQuery({
        offset: offset,
        limit,
        query: searchQuery,
    });

    const [deleteSeo] = useDeleteSeoMutation();

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this SEO entry?")) {
            try {
                await deleteSeo(id).unwrap();
                toaster.success("SEO entry deleted successfully");
                refetch();
            } catch (error) {
                toaster.error("Failed to delete SEO entry");
            }
        }
    };

    const columns = [
        {
            key: "seoId",
            label: "#No",
            render: (item: SeoResponse) => {
                return item?.SEOId || "N/A";
            },
        },
        {
            key: "url",
            label: "URL",
            render: (item: SeoResponse) => (
                <Link
                    to={`/admin/seo/edit?id=${item?.SEOId}`}
                    className="flex items-center gap-2 group-hover:text-primary pr-2"
                >
                    <span className="break-words">{item.Url}</span>
                </Link>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (item: SeoResponse) => (
                <>
                    {item.SeoType || "N/A"}
                </>
            ),
        },
        {
            key: "metaTitle",
            label: "Meta Title",
            render: (item: SeoResponse) => (
                <span className="truncate max-w-xs block" title={item.MetaTitle}>
                    {item.MetaTitle || "N/A"}
                </span>
            ),
        },
        {
            key: "isActive",
            label: "Status",
            render: (item: SeoResponse) => {
                return item?.IsActive ? (
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                        Active
                    </span>
                ) : (
                    <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-900 dark:text-gray-300">
                        Inactive
                    </span>
                );
            },
        },
        {
            key: "actions",
            label: "Action",
            render: (row: SeoResponse) => (
                <div className="flex items-center gap-2">
                    <button
                        title="Edit"
                        onClick={() => {
                            navigate(`/admin/seo/edit?id=${row.SEOId}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                    <button
                        title="Delete"
                        onClick={() => handleDelete(row.SEOId)}
                        className="border p-2 rounded-md border-red-300 text-red-500 text-base cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        if (data != undefined && data.Code == 200) {
            setSeoList(data.Data);
            if (data.Data.length > 0) {
                // Assuming the API returns RowTotal on the first item or similar structure
                setRowTotal(data.Data[0]?.RowTotal || 0);
            } else {
                setRowTotal(0);
            }
        }
    }, [data]);

    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="SEO Management">
                    <>
                        <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <FilterSeo
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
                                        navigate("/admin/seo/new");
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
                            data={seoList || []}
                            text={`Total Records (${rowTotal})`}
                            currentPage={offset}
                            totalPage={Math.ceil((rowTotal || 0) / limit) || 1}
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
