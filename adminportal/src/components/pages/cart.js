import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { message, Modal } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { decrementCartCount } = useCart();
  const fetchCartData = async () => {
    try {
      const user = localStorage.getItem("user");
      const userObject = JSON.parse(user);
      const userId = userObject?.user?.id;

      const response = await fetch(
        `https://gdhanibackend.onrender.com/api/user-cart/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart.items);
        calculateTotals(data.cart.items);
      } else {
        message.error("Failed to fetch cart data.");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      message.error("An error occurred while fetching cart data.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (items) => {
    let price = 0;
    let discount = 0;

    items.forEach((item) => {
      const originalPrice = item.productId.price * item.quantity;
      const discountedPrice =
        originalPrice - (originalPrice * item.productId.discount) / 100;

      price += originalPrice;
      discount += originalPrice - discountedPrice;
    });

    setTotalPrice(price.toFixed(2));
    setTotalDiscount(discount.toFixed(2));
  };

  const handleRemove = async (item) => {
    Modal.confirm({
      title: "Are you sure you want to remove this product from your cart?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const user = localStorage.getItem("user");
          const userObject = JSON.parse(user);
          const userId = userObject?.user?.id;
          console.log(item.productId, "ii");
          if (!userId || !item.productId._id) {
            message.error("Invalid user or product information.");
            return;
          }

          const response = await axios.delete(
            "https://gdhanibackend.onrender.com/api/remove-cart",
            {
              data: {
                userId,
                productId: item.productId._id,
              },
            }
          );

          console.log(response, "res");
          if (response.status === 200) {
            message.success("Product removed successfully!");
            decrementCartCount();
            fetchCartData();
          } else {
            message.error(
              response.data?.message || "Failed to remove the product."
            );
          }
        } catch (error) {
          console.error("Error removing product:", error);
          message.error("An error occurred while removing the product.");
        }
      },
      onCancel: () => {
        message.info("Product removal canceled.");
      },
    });
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  if (loading) {
    return <div className="p-6 bg-gray-100 min-h-screen">Loading...</div>;
  }

  const finalAmount = totalPrice - totalDiscount;
  const handleOrderNow = async () => {
    try {
      const user = localStorage.getItem("user");
      const userObject = JSON.parse(user);
      const userId = userObject?.user?.id;

      if (!userId) {
        message.error("User not logged in. Please log in to place an order.");
        return;
      }

      const response = await axios.post(
        "https://gdhanibackend.onrender.com/api/order",
        {
          userId,
          items: cartItems,
          totalAmount: finalAmount,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setCartItems([]);
        setTotalPrice(0);
        setTotalDiscount(0);
        message.success("Order placed successfully! returning home");
        navigate("/home");
        decrementCartCount();
      } else {
        message.error("Failed to place the order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("An error occurred while placing the order.");
    }
  };
  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 mt-12 min-h-screen flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const { productId, quantity, _id } = item;
                const discountedPrice =
                  productId.price -
                  (productId.price * productId.discount) / 100;

                return (
                  <div
                    key={_id}
                    className="flex items-center bg-white p-4 rounded-md border"
                  >
                    <img
                      src={`https://gdhanibackend.onrender.com${productId.image}`}
                      alt={productId.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 ml-2">
                      <h3 className="font-semibold text-lg">
                        {productId.name}
                      </h3>
                      <p className="text-gray-600">Price: ₹{productId.price}</p>
                      <p className="text-green-500">
                        Discount: {productId.discount}%
                      </p>
                      <p className="font-bold">Quantity: {quantity}</p>
                      <p className="text-blue-600 font-semibold">
                        Discounted Price: ₹
                        {(discountedPrice * quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      className="ml-auto text-red-500 font-bold"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="w-full md:w-1/3 bg-white shadow-md rounded-md p-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Total Price:</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Total Discount:</span>
                <span className="text-green-500">-₹{totalDiscount}</span>
              </div>
              <hr />
              <div className="flex justify-between text-gray-900 font-bold">
                <span>Final Amount:</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleOrderNow}
              className="mt-6 w-full bg-[#009444] text-white py-2 rounded-md"
            >
              Order Now
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
