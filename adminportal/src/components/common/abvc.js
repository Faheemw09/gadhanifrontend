import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component"; // Import DataTable component
import axios from "axios"; // For API calls
import { Drawer, Button, Input, Form } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [datafilter, setFilter] = useState();
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    SoldCount: 0,
    discount: 0,
  });

  // Fetch products from your API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-all-products"
        );
        setProducts(response.data.products);
        setFilter(response.data.products);
        console.log(response.data, "products");
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on search
    const filtered = products.filter((user) =>
      user.name.toLowerCase().includes(query)
    );
    setFilter(filtered);
  };
  // Handle input changes for new product
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/products", formData); // Make sure to update the API endpoint
      setVisible(false); // Close modal after submit
      setFormData({
        name: "",
        description: "",
        price: 0,
        image: "",
        SoldCount: 0,
        discount: 0,
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const columns = [
    {
      name: "Sr.No",
      selector: (row, index) => String(index + 1).padStart(2, "0"),
      sortable: true,
    },
    {
      name: "Product Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
    },
    {
      name: "Price",
      selector: "price",
      sortable: true,
    },
    {
      name: "Sold Count",
      selector: "SoldCount",
      sortable: true,
    },
    {
      name: "Discount",
      selector: "discount",
      sortable: true,
    },
    {
      name: "Action",
      selector: "actions",
      cell: (row) => (
        <div className="flex space-x-2 cursor-pointer text-blue-500">
          <div className="hover:underline">Edit</div>
          <span className="text-gray-400">|</span>
          <span className="hover:underline text-red-500">Delete</span>
        </div>
      ),
    },
  ];
  // const uploadFileHandler = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setPreviewImage(imageUrl);
  //     setImage(file);
  //   }
  // };

  // const handleRemovePreview = () => {
  //   setImage("");
  //   setPreviewImage("");
  // };

  return (
    <div className="p-4">
      {/* Search Box */}
      <div className="mb-4 flex items-center space-x-4">
        {/* Search Box */}
        <div className="flex items-center p-2 border rounded-md shadow-md">
          <img
            src="/images/seachImg.png"
            width={15}
            height={15}
            alt="search icon"
          />
          <input
            type="text"
            placeholder="Search product here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 p-2 outline-none"
          />
        </div>

        <button
          onClick={() => setVisible(true)}
          className="ml-4 bg-[#009444] text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none"
        >
          Add Product
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={datafilter}
          pagination
          highlightOnHover
          responsive
        />
      </div>
      <Drawer
        title="Add Product Details"
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </Form.Item>
          <Form.Item label="Price">
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </Form.Item>
          <Form.Item label="Image URL">
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </Form.Item>

          <Form.Item label="Discount">
            <Input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Enter discount percentage"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default Products;
