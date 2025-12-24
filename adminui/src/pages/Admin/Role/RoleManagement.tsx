import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import DataGrid from "../../../components/dataGrid/dataGrid";
import ComponentCard from "../../../components/common/ComponentCard";
import FilterRoleManagement from "./FilterRoleManagement";
import toaster from "../../../components/toster";
import { useGetRolesQuery, useDeleteRoleMutation } from "../../../redux/user/userAPI";
import { useFilter } from "../../../hooks/useFilter";

interface IFilter {
  roleName: string;
}

const RoleManagement = () => {
  const navigate = useNavigate();
  const [rowTotal, setRowTotal] = useState(0);
  const [limit, setLimit] = useState(10);

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
      roleName: "",
    },
    limit,
    enableFilterList: true,
  });

  const { data, isLoading, refetch } = useGetRolesQuery({
    query: searchText,
    limit,
    offset,
    ...filterData,
  });

  const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id).unwrap();
      toaster.success("Role deleted successfully");
      refetch();
    } catch {
      toaster.error("Failed to delete role");
    }
  };

  useEffect(() => {
    if (data && data.Data) {
      if (data.Data.length > 0) {
        setRowTotal(data.Data[0]?.RowTotal || 0);
      } else {
        setRowTotal(0);
      }
    }
  }, [data]);

  const columns = [
    {
      key: "Name",
      label: "Role Name",
      render: (row: any) => (
        <Link
          to={`/admin/role/edit?id=${row.Id}`}
          className="flex items-center gap-2 group-hover:text-primary pr-2"
        >
          {row.Name || "N/A"}
        </Link>
      ),
    },
    {
      key: "IsActive",
      label: "Active",
      render: (row: any) => (
        <span className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${row.IsActive ? "bg-success text-success" : "bg-danger text-danger"
          }`}>
          {row.IsActive ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "IsSystem",
      label: "System",
      render: (row: any) => (
        <span className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${row.IsSystem ? "bg-primary text-primary" : "bg-gray-500 text-gray-500"
          }`}>
          {row.IsSystem ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "IsTemporary",
      label: "Temporary",
      render: (row: any) => (
        <span className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${row.IsTemporary ? "bg-warning text-warning" : "bg-gray-500 text-gray-500"
          }`}>
          {row.IsTemporary ? "Yes" : "No"}
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
              navigate(`/admin/role/edit?id=${row.Id}`);
            }}
            className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:text-primary"
          >
            <MdOutlineEdit size={20} />
          </button>
          <button
            title="Delete"
            onClick={() => {
              if (confirm("Are you sure?")) {
                handleDelete(row.Id);
              }
            }}
            className="border p-2 rounded-md border-gray-300 text-red-500 cursor-pointer hover:bg-red-50"
            disabled={deleting}
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ComponentCard title="Role Management">
        <>
          <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <FilterRoleManagement
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
                  navigate("/admin/role/new");
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
            data={data?.Data || []}
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
};

export default RoleManagement;
