import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredDataOrder, setFilteredDataOrder] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios
      .get("https://gdhanibackend.onrender.com/api/get-all-orders")
      .then((response) => {
        setOrders(response.data.orders);
        setFilteredDataOrder(response.data.orders);
      })
      .catch((error) => {
        console.error("There was an error fetching the orders!", error);
      });
  }, []);

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Invalid Date";
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => String(index + 1).padStart(2, "0"),
      sortable: true,
    },
    {
      name: "Order ID",
      selector: (row) => row._id,
      sortable: true,
      cell: (row) => <div className="text-[#fbb03f]">{row._id.slice(-6)}</div>,
    },
    {
      name: "User Name",
      selector: (row) => row.userId?.name || "N/A",
      sortable: true,
    },
    {
      name: "User Email",
      selector: (row) => row.userId?.email || "N/A",
      sortable: true,
    },
    {
      name: "Product Details",
      cell: (row) => (
        <div>
          {row.items.map((item, index) => (
            <div key={index}>
              <p>{item.productId.name}</p>
              <p>
                <strong className="text-[#9f6610]">Price:</strong> ₹
                {item.productId.price}
              </p>
              <p>
                <strong className="text-[#9f6610]">Quantity:</strong>{" "}
                {item.quantity}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Total Amount",
      selector: (row) => (
        <div className="text-[#009444]"> ₹{row.totalAmount}</div>
      ),
      sortable: true,
    },
    {
      name: "Order Date",
      selector: (row) => formatDateTime(row.orderDate),
      sortable: true,
    },
  ];

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchText(query);

    const filtered = orders.filter(
      (order) =>
        order.userId?.name?.toLowerCase().includes(query) ||
        order.userId?.email?.toLowerCase().includes(query) ||
        order.items.some((item) =>
          item.productId?.name?.toLowerCase().includes(query)
        )
    );
    setFilteredDataOrder(filtered);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center p-2 border rounded-md shadow-md max-w-xs w-full">
          <input
            type="text"
            placeholder="Search orders"
            value={searchText}
            onChange={handleSearch}
            className="w-full p-2 outline-none border-none focus:ring-2 focus:ring-blue-500 rounded-md"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredDataOrder}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default Orders;
