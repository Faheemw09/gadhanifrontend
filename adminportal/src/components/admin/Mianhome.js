import React from "react";
import LeftPannel from "./LeftPannel";
import RightPannel from "./RightPannel";
import { Route, Routes } from "react-router-dom";
import Users from "./details/users";
import Loggedinusers from "./details/loggedinusers";
import Products from "./details/products";
import Dashboard from "./details/dashboard";
import Orders from "./details/orders";

const MainHome = () => {
  return (
    <>
      <header className="bg-green-600 text-white p-4 shadow-md">
        <h1 className="text-center text-xl font-semibold">
          Welcome to Admin Dashboard
        </h1>
      </header>
      <section className="h-screen flex">
        <div className="w-1/5 bg-white shadow-lg h-full">
          <LeftPannel />
        </div>

        <div className="w-4/5 bg-gray-100 h-full overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/logged-in-users" element={<Loggedinusers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
          
          </Routes>
        </div>
      </section>
    </>
  );
};

export default MainHome;
