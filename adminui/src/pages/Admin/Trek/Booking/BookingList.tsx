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
                return item?.BookingId ? item?.BookingId : "N/A";
            },
        },
        {
            key: "productName",
            label: "Product",
            render: (item: any) => {
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-black dark:text-white">
                            {item.ProductName || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {item.ProductType || "TREK"}
                        </span>
                    </div>
                );
            },
        },
        {
            key: "travelDate",
            label: "Travel Date",
            render: (item: any) => {
                return item?.TravelDate ? new Date(item.TravelDate).toLocaleDateString() : "N/A";
            },
        },
        {
            key: "contactName",
            label: "Contact Name",
            render: (item: any) => {
                const name = `${item.FirstName || ""} ${item.LastName || ""}`.trim();
                const url = `/superadmin/trek/booking/detail?id=${item.BookingId}&producturl=${encodeURIComponent(item.ProductUrl || "")}&producttype=${item.ProductType || ""}`;
                return (
                    <Link
                        to={url}
                        className="flex items-center gap-2 group-hover:text-primary pr-2"
                    >
                        <span className="break-words">{name || "N/A"}</span>
                    </Link>
                );
            },
        },
        {
            key: "email",
            label: "Email",
            render: (item: any) => (
                <>
                    {item.Email || "N/A"}
                </>
            ),
        },
        {
            key: "pax",
            label: "Pax",
            render: (item: any) => (
                <>
                    {item.TotalTraveler || 0}
                </>
            ),
        },
        {
            key: "paidAmount",
            label: "Paid",
            render: (item: any) => (
                <>
                    {item.PaidAmount || 0}
                </>
            ),
        },
        {
            key: "bookingStatus",
            label: "Status",
            render: (item: any) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.BookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    item.BookingStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        item.BookingStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {item.BookingStatus || "N/A"}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Action",
            render: (row: any) => {
                const url = `/superadmin/trek/booking/detail?id=${row.BookingId}&producturl=${encodeURIComponent(row.ProductUrl || "")}&producttype=${row.ProductType || ""}`;
                return (
                    <div className="flex items-center gap-2">
                        <button
                            title="View Details"
                            onClick={() => {
                                navigate(url);
                            }}
                            className="border p-2 rounded-md border-gray-300 text-base cursor-pointer hover:bg-gray-50"
                        >
                            <MdOutlineEdit size={20} />
                        </button>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (data != undefined && data.Code == 200) {
            setBookings(data.Data);
            if (data.Data.length > 0) {
                setRowTotal(data.Data[0]?.RowTotal || 0);
            }
        }
    }, [data]);

    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="Bookings">
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
