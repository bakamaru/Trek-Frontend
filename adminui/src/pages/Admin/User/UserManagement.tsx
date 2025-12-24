import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { BiHistory } from "react-icons/bi";
import { AiOutlineLock } from "react-icons/ai";
import DataGrid from "../../../components/dataGrid/dataGrid";
import ComponentCard from "../../../components/common/ComponentCard";
import FilterUserManagement from "./FilterUserManagement";
import ResetPasswordModal from "./ResetPasswordModal";
import LoginHistoryModal from "./LoginHistoryModal";
import toaster from "../../../components/toster";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetRolesQuery
} from "../../../redux/user/userAPI";
import { useFilter } from "../../../hooks/useFilter";

interface IFilter {
  email: string;
  roleId: string[];
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [isResetPassword, setIsResetPassword] = useState<any | null>(null);
  const [loginHistoryUser, setLoginHistoryUser] = useState<any | null>(null);
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
      email: "",
      roleId: []
    },
    limit,
    enableFilterList: true,
  });

  const { data, isLoading, refetch } = useGetUsersQuery({
    query: searchText,
    limit,
    offset,
    ...filterData,
  });

  const { data: roleData } = useGetRolesQuery({
    offset: 1,
    limit: 1000,
  });


  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id).unwrap();
      toaster.success("User deleted successfully");
      refetch();
    } catch {
      toaster.error("Failed to delete user");
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
      label: "Name",
      render: (row: any) => (
        <Link
          to={`/admin/user/edit?id=${row.AppUserId}`}
          className="flex items-center gap-2 group-hover:text-primary pr-2"
        >
          {row.FirstName + " " + row.LastName || "N/A"}
        </Link>
      ),
    },
    { key: "Email", label: "Email" },
    { key: "PhoneNumber", label: "Phone" },
    { key: "RoleName", label: "Role", render: (row: any) => row.RoleName || "N/A" },
    {
      key: "IsActive",
      label: "Active",
      render: (row: any) => (
        <span className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${row.IsActive ? "bg-success text-success" : "bg-danger text-danger"
          }`}>
          {row.IsActive ? "Active" : "Inactive"}
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
              navigate(`/admin/user/edit?id=${row.AppUserId}`);
            }}
            className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:text-primary"
          >
            <MdOutlineEdit size={20} />
          </button>
          <button
            title="Delete"
            onClick={() => {
              if (confirm("Are you sure?")) {
                handleDelete(row.AppUserId);
              }
            }}
            className="border p-2 rounded-md border-gray-300 text-red-500 cursor-pointer hover:bg-red-50"
            disabled={deleting}
          >
            <MdDeleteOutline size={20} />
          </button>
          <button
            title="Reset Password"
            onClick={() => {
              setIsResetPassword(row);
            }}
            className="border p-2 rounded-md border-gray-300 text-yellow-500 cursor-pointer hover:bg-yellow-50"
          >
            <AiOutlineLock size={20} />
          </button>
          <button
            title="Login History"
            onClick={() => {
              setLoginHistoryUser(row);
            }}
            className="border p-2 rounded-md border-gray-300 text-green-500 cursor-pointer hover:bg-green-50"
          >
            <BiHistory size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ComponentCard title="User Management">
        <>
          <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <FilterUserManagement
              control={control}
              handleSubmit={handleSubmit}
              onFilterSubmit={onFilterSubmit}
              handleFilterRemove={handleFilterRemove}
              handleFilterReset={handleFilterReset}
              handleFilterSearch={handleFilterSearch}
              filterList={filterList}
              setFilter={setFilter}
              roles={roleData?.Data || []}
            />
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  navigate("/admin/user/new");
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

      <ResetPasswordModal
        isOpen={!!isResetPassword}
        user={isResetPassword}
        onClose={() => setIsResetPassword(null)}
      />
      <LoginHistoryModal
        isOpen={!!loginHistoryUser}
        user={loginHistoryUser}
        onClose={() => setLoginHistoryUser(null)}
      />
    </div>
  );
};

export default UserManagement;
