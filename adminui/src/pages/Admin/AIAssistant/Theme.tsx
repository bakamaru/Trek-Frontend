import { Link, useNavigate } from "react-router-dom";
import DataGrid from "../../../components/dataGrid/dataGrid";
import { Controller } from "react-hook-form";
import GridFilter from "../../../components/dataGrid/gridFilter";
import { useFilter } from "../../../hooks/useFilter";
import { useEffect, useState } from "react";
import { FilterProps } from "../../../types";
import ComponentCard from "../../../components/common/ComponentCard";
import {
    useGetAllThemesQuery,
    useDeleteThemeMutation,
} from "../../../redux/aibot/themeAPI";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import toaster from "../../../components/toster";

interface IFilter {
    Name: string;
}

const FilterTheme = ({
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
                            placeholder="Theme Name"
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

export default function Theme() {
    const Navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [Themes, setThemes] = useState([]);
    const [RowTotal, setRowTotal] = useState(0);

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
        query,
        offset,
    } = useFilter<IFilter>({
        defaultValues: {
            Name: "",
        },
        limit,
        enableFilterList: true,
    });

    const { data, isLoading, refetch } = useGetAllThemesQuery(`?${query}`);
    const [DeleteTheme, { isLoading: IsDeleting }] = useDeleteThemeMutation();

    const Columns = [
        {
            key: "AIAssistantThemeId",
            label: "#No",
            render: (item: any) => (item?.AIAssistantThemeId ? item?.AIAssistantThemeId : "N/A"),
        },
        {
            key: "Name",
            label: "Name",
            render: (item: any) => (
                <Link
                    to={`/superadmin/assistant/theme/edit?id=${item?.AIAssistantThemeId}`}
                    className="flex items-center gap-2 group-hover:text-primary pr-2"
                >
                    <span className=" break-words">{item.Name}</span>
                </Link>
            ),
        },
        {
            key: "actions",
            label: "Action",
            render: (Row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        title="Edit Theme"
                        onClick={() => {
                            const NewParams = new URLSearchParams();
                            NewParams.set("id", Row.AIAssistantThemeId.toString());
                            Navigate(`/superadmin/assistant/theme/edit?${NewParams.toString()}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                    <button
                        title="Delete Theme"
                        onClick={() => {
                            if (confirm("Are you sure?")) {
                                handleDelete(Row.AIAssistantThemeId);
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

    const handleDelete = async (Id: number) => {
        try {
            const Response: any = await DeleteTheme({ AIAssistantThemeId: Id }).unwrap();
            if (Response.Code === 200) {
                toaster.success("Theme deleted successfully!");
                refetch();
            } else {
                toaster.error("Failed to delete theme!");
            }
        } catch (error) {
            console.error(error);
            toaster.error("An error occurred while deleting the theme.");
        }
    };

    useEffect(() => {
        if (data && data.Code === 200) {
            setThemes(data.Data);
            setRowTotal(data.RowTotal || 0);
        }
    }, [data]);

    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="Themes">
                    <>
                        <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <FilterTheme
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
                                        Navigate("/superadmin/assistant/theme/new");
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                                >
                                    Add New
                                </button>
                            </div>
                        </div>
                        <DataGrid
                            columns={Columns}
                            isLoading={isLoading}
                            data={Themes || []}
                            text={`Total Themes (${RowTotal})`}
                            currentPage={offset}
                            totalPage={RowTotal}
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