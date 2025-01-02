// UserTable.js (Frontend)
import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    
    axios
      .get("https://gdhanibackend.onrender.com/api/get-all-users")
      .then((response) => {
        setUsers(response.data.users); 
        setFilteredData(response.data.users);
        console.log(response.data.users, "tt");
     
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
      console.error("Invalid date:", timestamp);
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
      name: "Created Date",
      selector: (row) => formatDateTime(row.created_ts).date, // Display the formatted date
      sortable: true,
    },
    {
      name: "Created Time",
      selector: (row) => formatDateTime(row.created_ts).time, // Display the formatted time
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
        <div className="flex items-center p-2 border rounded-md shadow-md">
          <img
            src="/images/seachImg.png"
            width={15}
            height={15}
            alt="search icon"
          />
          <input
            type="text"
            placeholder="Search user here"
            value={searchText}
            onChange={handleSearch}
            className="ml-2 p-2 outline-none"
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

export default Users;
