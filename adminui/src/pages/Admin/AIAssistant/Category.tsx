import { Link, useNavigate } from "react-router";
import DataGrid from "../../../components/dataGrid/dataGrid";
import { Controller } from "react-hook-form";
import GridFilter from "../../../components/dataGrid/gridFilter";
import { useFilter } from "../../../hooks/useFilter";
import { useEffect, useState } from "react";
import { FilterProps } from "../../../types";
import ComponentCard from "../../../components/common/ComponentCard";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useSaveCategoryMutation,
} from "../../../redux/aibot/categoryAPI";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import toaster from "../../../components/toster";

interface IFilter {
  Name: string;
}

const FilterCategory = ({
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
              placeholder="Category Name"
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

export default function Category() {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [categories, setCategories] = useState([]);
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
    query,
    offset,
  } = useFilter<IFilter>({
    defaultValues: {
      Name: "",
    },
    limit,
    enableFilterList: true,
  });

  const { data, isLoading, refetch } = useGetAllCategoriesQuery(`?${query}`);
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [saveCategory, { isLoading: isSaving }] = useSaveCategoryMutation();

  const columns = [
    {
      key: "KnowledgeBaseCategoryId",
      label: "#No",
      render: (item: any) => (item?.KnowledgeBaseCategoryId ? item?.KnowledgeBaseCategoryId : "N/A"),
    },
    {
      key: "Name",
      label: "Name",
      render: (item: any) => (
        <Link
          to={`/admin/category/edit?id=${item?.KnowledgeBaseCategoryId}`}
          className="flex items-center gap-2 group-hover:text-primary pr-2"
        >
          <span className=" break-words">{item.Name}</span>
        </Link>
      ),
    },
    {
      key: "IsActive",
      label: "Is Active",
      render: (item: any) => (item?.IsActive ? "Yes" : "No"),
    },
    {
      key: "actions",
      label: "Action",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <button
            title="Edit category"
            onClick={() => {
              const newParams = new URLSearchParams();
              newParams.set("id", row.KnowledgeBaseCategoryId.toString());
              navigate(`/admin/category/edit?${newParams.toString()}`);
            }}
            className="border p-2 rounded-md border-gray-300 text-base cursor-pointer"
          >
            <MdOutlineEdit size={20} />
          </button>
          <button
            title="Delete category"
            onClick={() => {
              if (confirm("Are you sure?")) {
                handleDelete(row.KnowledgeBaseCategoryId);
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
      const response: any = await deleteCategory({ KnowledgeBaseCategoryId: id }).unwrap();
      if (response.Code === 200) {
        toaster.success("Category deleted successfully!");
        refetch();
      } else {
        toaster.error("Failed to delete category!");
      }
    } catch (error) {
      toaster.error("An error occurred while deleting the category.");
    }
  };

  useEffect(() => {
    if (data && data.Code === 200) {
      setCategories(data.Data);
      setRowTotal(data.Data[0]?.RowTotal || 0);
    }
  }, [data]);

  return (
    <>
      <div className="space-y-6">
        <ComponentCard title="Categories">
          <>
            <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <FilterCategory
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
                    navigate("/admin/category/new");
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
              data={categories || []}
              text={`Total Categories (${rowTotal})`}
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
