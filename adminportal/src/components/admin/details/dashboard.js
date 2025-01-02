import React from "react";
import RightPannel from "../RightPannel";
import Graphs from "./Graphs";
import Orders from "./orders";

const Dashboard = () => {
  return (
    <div>
      <RightPannel />
      {/* <Graphs /> */}
      <div className="text-left ml-3 font-medium text-[#a11616]">
        <h5 className="ml-3">Recent Orders</h5>
        <Orders />
      </div>
    </div>
  );
};

export default Dashboard;
