import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Controller } from "react-hook-form";
import { MdDeleteOutline, MdOutlineEdit, MdOutlineCollections } from "react-icons/md";
import DataGrid from "../../../components/dataGrid/dataGrid";
import GridFilter from "../../../components/dataGrid/gridFilter";
import ComponentCard from "../../../components/common/ComponentCard";
import toaster from "../../../components/toster";
import { useFilter } from "../../../hooks/useFilter";
import { FilterProps } from "../../../types";
import { useDeleteBannerMutation, useGetAllBannersQuery } from "../../../redux/trek/bannerAPI";

interface IFilter {
    Name: any;
}

const FilterBanner = ({
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

export default function BannerList() {
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [banners, setBanners] = useState([]);
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

    const { data, isLoading, refetch } = useGetAllBannersQuery({ query: searchText, limit, offset, ...filterData });
    const [deleteBanner] = useDeleteBannerMutation();

    const columns = [
        {
            key: "bannerId",
            label: "#No",
            render: (item: any) => {
                return item?.BannerId ? item?.BannerId : "N/A";
            },
        },
        {
            key: "name",
            label: "Name",
            render: (item: any) => (
                <Link
                    to={`/superadmin/banner/edit?id=${item?.BannerId}`}
                    className="flex items-center gap-2 group-hover:text-primary pr-2"
                >
                    <span className=" break-words">{item.Name}</span>
                </Link>
            ),
        },
        {
            key: "key",
            label: "Key",
            render: (item: any) => (
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 font-mono">
                    {item.Key || "N/A"}
                </span>
            ),
        },
        {
            key: "isActive",
            label: "Is Active",
            render: (item: any) => {
                return item?.IsActive ? (
                    <span className="text-green-500 font-medium">Yes</span>
                ) : (
                    <span className="text-red-500 font-medium">No</span>
                );
            },
        },
        {
            key: "actions",
            label: "Action",
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        title="Edit Metadata"
                        onClick={() => {
                            navigate(`/superadmin/banner/edit?id=${row.BannerId}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:bg-gray-50 text-brand-500"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                    <button
                        title="Manage Slides"
                        onClick={() => {
                            navigate(`/superadmin/banner/slides?id=${row.BannerId}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:bg-gray-50 text-indigo-600"
                    >
                        <MdOutlineCollections size={20} />
                    </button>
                    <button
                        title="Delete"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this banner?")) {
                                handleDelete(row.BannerId);
                            }
                        }}
                        className="border p-2 rounded-md border-gray-300 text-red-500 cursor-pointer hover:bg-red-50"
                    >
                        <MdDeleteOutline size={20} />
                    </button>
                </div>
            ),
        },
    ];

    const handleDelete = async (id: number) => {
        try {
            var response: any = await deleteBanner(id).unwrap();
            if (response.Code == 200) {
                toaster.success("Banner deleted successfully!");
                refetch();
            } else {
                toaster.error("Failed to delete banner!");
            }
        } catch (error) {
            toaster.error("An error occurred while deleting the banner.");
        }
    };

    useEffect(() => {
        if (data != undefined && data.Code == 200) {
            setBanners(data.Data);
            if (data.Data.length > 0) {
                setRowTotal(data.Data[0]?.RowTotal || 0);
            } else {
                setRowTotal(0);
            }
        }
    }, [data]);

    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="Banner Management">
                    <>
                        <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <FilterBanner
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
                                        navigate("/superadmin/trek/banner/new");
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                                >
                                    Add New Banner
                                </button>
                            </div>
                        </div>
                        <DataGrid
                            columns={columns}
                            isLoading={isLoading}
                            data={banners || []}
                            text={`Total Records (${rowTotal})`}
                            currentPage={offset}
                            totalPage={rowTotal}
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
