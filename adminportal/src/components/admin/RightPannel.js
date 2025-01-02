import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RightPannel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://gdhanibackend.onrender.com/api/get-all-count"
      );
      console.log(res);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <section className="container-fluid p-0">
      <div className="bg-gray-100 py-6">
        <div className="container">
          <div className="hidden md:flex justify-between flex-wrap">
            <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/4 p-4">
              <div
                className="bg-[#df8600] text-white p-6 rounded-lg cursor-pointer hover:bg-opacity-80"
                onClick={() => navigate("/admin/users")}
              >
                <h4 className="text-lg font-semibold">Users</h4>
                <h2 className="text-2xl font-bold">
                  {data.registeredUsersCount}
                </h2>
              </div>
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/4 p-4">
              <div
                className="bg-[#004de1] text-white p-6 rounded-lg cursor-pointer hover:bg-opacity-80"
                onClick={() => navigate("/admin/logged-in-users")}
              >
                <h4 className="text-lg font-semibold">Logged-In Users</h4>
                <h2 className="text-2xl font-bold">
                  {data?.loggedInUsersCount}
                </h2>
              </div>
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/4 p-4">
              <div
                className="bg-[#94683e] text-white p-6 rounded-lg cursor-pointer hover:bg-opacity-80"
                onClick={() => navigate("/admin/products")}
              >
                <h4 className="text-lg font-semibold">Products</h4>
                <h2 className="text-2xl font-bold">{data.productCount}</h2>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/4 p-4">
              <div
                className="bg-green-800 text-white p-6 rounded-lg cursor-pointer hover:bg-opacity-80"
                onClick={() => navigate("/admin/orders")}
              >
                <h4 className="text-lg font-semibold">Orders</h4>
                <h2 className="text-2xl font-bold">{data.orderCount}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightPannel;
