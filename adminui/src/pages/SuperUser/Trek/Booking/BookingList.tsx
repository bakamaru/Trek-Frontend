import { Link, useNavigate } from "react-router";
import DataGrid from "../../../../components/dataGrid/dataGrid";
import { Controller } from "react-hook-form";
import GridFilter from "../../../../components/dataGrid/gridFilter";
import { useFilter } from "../../../../hooks/useFilter";
import { useEffect, useState } from "react";
import { FilterProps } from "../../../../types";
import ComponentCard from "../../../../components/common/ComponentCard";
import { MdOutlineEdit } from "react-icons/md";
import { useGetAllBookingQuery } from "../../../../redux/trek/bookingAPI";

interface IFilter {
    Name: any;
}

const FilterBooking = ({
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
                            placeholder="Search..."
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

export default function BookingList() {
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [bookings, setBookings] = useState([]);
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

    const { data, isLoading } = useGetAllBookingQuery({ query: searchText, limit, offset, ...filterData });

    const columns = [
        {
            key: "bookingId",
            label: "#No",
            render: (item: any) => {
                return item?.bookingId ? item?.bookingId : "N/A";
            },
        },
        {
            key: "contactName",
            label: "Contact Name",
            render: (item: any) => (
                <Link
                    to={`/superadmin/trek/booking/edit?id=${item?.bookingId}`}
                    className="flex items-center gap-2 group-hover:text-primary pr-2"
                >
                    <span className=" break-words">{item.contactName}</span>
                </Link>
            ),
        },
        {
            key: "contactEmail",
            label: "Email",
            render: (item: any) => (
                <>
                    {item.contactEmail || "N/A"}
                </>
            ),
        },
        {
            key: "bookingStatus",
            label: "Status",
            render: (item: any) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.bookingStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    item.bookingStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        item.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {item.bookingStatus || "N/A"}
                </span>
            ),
        },
        {
            key: "totalAmount",
            label: "Total Amount",
            render: (item: any) => (
                <>
                    {item.totalAmount || "0"}
                </>
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
                            navigate(`/superadmin/trek/booking/edit?id=${row.bookingId}`);
                        }}
                        className="border p-2 rounded-md border-gray-300 text-base cursor-pointer"
                    >
                        <MdOutlineEdit size={20} />
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        if (data != undefined && data.code == 200) {
            setBookings(data.data);
            if (data.data.length > 0) {
                setRowTotal(data.data[0]?.totalRows || 0);
            }
        }
    }, [data]);

    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="Booking List">
                    <>
                        <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
                            <FilterBooking
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
                                {/* Bookings are usually created by users, but admin might need to create one manually. Keeping it for now. */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate("/superadmin/trek/booking/new");
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
                            data={bookings || []}
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
