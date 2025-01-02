import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const LeftPannel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("/admin");

  const handleActive = (item, route) => {
    setActiveItem(item);
    navigate(route);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/admin/dashboard")) {
      setActiveItem("dashboard");
    } else if (currentPath.includes("/admin/users")) {
      setActiveItem("users");
    } else if (currentPath.includes("/admin/logged-in-users")) {
      setActiveItem("loggedInUsers");
    } else if (currentPath.includes("/admin/products")) {
      setActiveItem("products");
    } else if (currentPath.includes("/admin/orders")) {
      setActiveItem("products");
    }
  }, [location.pathname]);

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      route: "/admin/dashboard",
      icon: "/images/dashboardImg.svg",
    },
    {
      id: "users",
      name: "Users",
      route: "/admin/users",
      icon: "/images/user.svg",
    },
    {
      id: "loggedInUsers",
      name: "Logged-in Users",
      route: "/admin/logged-in-users",
      icon: "/images/staff.svg",
    },
    {
      id: "products",
      name: "Products",
      route: "/admin/products",
      icon: "/images/inventory.svg",
    },
    {
      id: "orders",
      name: "Orders",
      route: "/admin/orders",
      icon: "/images/orders.svg",
    },
  ];

  return (
    <div className="bg-white p-4 shadow-md rounded-md w-80 h-screen flex flex-col">
      <ul className="flex-grow">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`flex items-center p-2 rounded-lg mb-2 cursor-pointer ${
              activeItem === item.id
                ? "bg-[#009444] text-white"
                : "hover:bg-[#009444] hover:text-white"
            }`}
            onClick={() => handleActive(item.id, item.route)}
          >
            <div className="mr-2">
              <img src={item.icon} alt={item.name} width={22} height={22} />
            </div>
            <span className="text-heading-color">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftPannel;
