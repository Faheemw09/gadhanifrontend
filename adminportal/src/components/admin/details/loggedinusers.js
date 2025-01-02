// UserTable.js (Frontend)
import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const Loggedinuser = () => {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Fetch users from the backend API
    axios
      .get("https://gdhanibackend.onrender.com/api/get-all-count")
      .then((response) => {
        setUsers(response.data.loggedInUsers); // Set the users data
        setFilteredData(response.data.loggedInUsers);
        console.log(response.data.loggedInUsers, "tt");
      })

      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);
  const formatDateTime = (timestamp) => {
    if (!timestamp) {
      console.error("Invalid date: No timestamp provided");
      return { date: "No Date", time: "No Time" };
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", timestamp); // Log invalid date if found
      return { date: "Invalid Date", time: "Invalid Time" };
    }

    const formattedDate = date.toLocaleDateString();

    const formattedTime = date.toLocaleTimeString();

    return { date: formattedDate, time: formattedTime };
  };

  const columns = [
    {
      name: "Sr.No",
      selector: (row, index) => String(index + 1).padStart(2, "0"),
      sortable: true,
    },
    {
      name: "ID",
      selector: (row) => row._id.slice(-6),
      sortable: true,
      cell: (row) => <div className="text-[#fbb03f]">{row._id.slice(-6)}</div>,
    },

    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Last Login Date",
      selector: (row) => formatDateTime(row.lastLogin).date,
      sortable: true,
    },
    {
      name: "Last Login Time",
      selector: (row) => formatDateTime(row.lastLogin).time,
      sortable: true,
    },
  ];


  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchText(query);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center p-2 border rounded-md shadow-md max-w-xs w-full">
          <img
            src="/images/seachImg.png"
            width={20}
            height={20}
            alt="search icon"
            className="mr-2"
          />
          <input
            type="text"
            placeholder="Search user here"
            value={searchText}
            onChange={handleSearch}
            className="w-full p-2 outline-none border-none focus:ring-2 focus:ring-blue-500 rounded-md"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default Loggedinuser;
