import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Drawer, Button, Input, Form, Modal, message } from "antd";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDiscount, setEditDiscount] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);
  const [editImageLoading, setEditImageLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://gdhanibackend.onrender.com/api/get-all-products"
      );
      setProducts(response.data.products);
      setFilteredData(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchText(query);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageLoading(true);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setImage(file);
      setImageLoading(false);
    }
  };

  const handleEditImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditImageLoading(true);
      const previewUrl = URL.createObjectURL(file);
      setEditPreviewImage(previewUrl);
      setEditImage(file);
      setEditImageLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !description || !discount || !image) {
      message.error("Please fill all fields and upload an image.");
      return;
    }

    setFormLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "https://gdhanibackend.onrender.com/api/create-product",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        message.success("Product uploaded successfully!");

        setName("");
        setPrice("");
        setDescription("");
        setDiscount("");
        setImage(null);
        setPreviewImage(null);
        document.querySelector('input[type="file"]').value = "";
        fetchProducts();
        setVisible(false);
      }
    } catch (error) {
      message.error("Error uploading product!");
      console.error(error);
    }
    setFormLoading(false);
  };

  const handleEditSubmit = async () => {
    if (!editName || !editPrice || !editDescription || !editDiscount) {
      message.error("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDescription);
    formData.append("price", editPrice);
    formData.append("discount", editDiscount);
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const response = await axios.patch(
        `https://gdhanibackend.onrender.com/api/update-product/${editId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        message.success("Product updated successfully!");
        fetchProducts();
        setEditVisible(false);
      }
    } catch (error) {
      message.error("Error updating product!");
      console.error(error);
    }
  };

  const handleEditClick = (product) => {
    setEditId(product._id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditDescription(product.description);
    setEditDiscount(product.discount);
    setEditPreviewImage(`https://gdhanibackend.onrender.com${product.image}`);
    setEditVisible(true);
  };

  const columns = [
    {
      name: "Sr.No",
      selector: (row, index) => String(index + 1).padStart(2, "0"),
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`https://gdhanibackend.onrender.com${row.image}`}
          alt={row.name}
          style={{ width: "30px", height: "30px", objectFit: "cover" }}
        />
      ),
      sortable: false,
    },
    {
      name: "ID",
      selector: (row) => row._id.slice(-6),
      sortable: true,
      cell: (row) => <div className="text-[#fbb03f]">{row._id.slice(-6)}</div>,
    },
    {
      name: "Product Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Discount",
      selector: (row) => row.discount,
      sortable: true,
    },
    {
      name: "SoldCount",
      selector: (row) => <div className="text-[#009444]">{row.SoldCount}</div>,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center space-x-2 cursor-pointer">
          <span
            className="relative hover:underline text-blue-500 hover:text-blue-600"
            onClick={() => handleEditClick(row)}
          >
            Edit
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-blue-500 scale-x-0 hover:scale-x-100 transition-all duration-300"></div>
          </span>

          <span className="text-gray-400 text-xs">|</span>

          <span
            className="relative hover:underline text-red-500 hover:text-red-600"
            onClick={() => handleDeleteClick(row)} // Add the delete click handler
          >
            Delete
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-red-500 scale-x-0 hover:scale-x-100 transition-all duration-300"></div>
          </span>
        </div>
      ),
    },
  ];

  const handleDeleteClick = async (row) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await axios.delete(
            `https://gdhanibackend.onrender.com/api/delete-product/${row._id}`
          );
          if (response.status === 200) {
            message.success("Product deleted successfully!");
            fetchProducts();
          }
        } catch (error) {
          message.error("Error deleting product!");
          console.error(error);
        }
      },
      onCancel: () => {
        message.info("Product deletion canceled.");
      },
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search product here"
          value={searchText}
          onChange={handleSearch}
          className="p-2 outline-none border rounded-md"
        />
        <button
          onClick={() => setVisible(true)}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Add Product
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
      />

     
      <Drawer
        title="Add Product Details"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </Form.Item>
          <Form.Item label="Price">
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </Form.Item>
          <Form.Item label="Discount">
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter discount percentage"
            />
          </Form.Item>
          <Form.Item label="Product Image">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <img src={previewImage} alt="Preview" width="100" />
            )}
            {imageLoading && <div>Loading...</div>}
          </Form.Item>
          <Button htmlType="submit" loading={formLoading}>
            Add Product
          </Button>
        </Form>
      </Drawer>

      {/* Edit Product Drawer */}
      <Drawer
        title="Edit Product Details"
        placement="right"
        onClose={() => setEditVisible(false)}
        open={editVisible}
      >
        <Form layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item label="Name">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </Form.Item>
          <Form.Item label="Price">
            <Input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="Enter price"
            />
          </Form.Item>
          <Form.Item label="Discount">
            <Input
              type="number"
              value={editDiscount}
              onChange={(e) => setEditDiscount(e.target.value)}
              placeholder="Enter discount percentage"
            />
          </Form.Item>
          <Form.Item label="Product Image">
            <input
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
            />
            {editPreviewImage && (
              <img src={editPreviewImage} alt="Preview" width="100" />
            )}
            {editImageLoading && <div>Loading...</div>}
          </Form.Item>
          <Button htmlType="submit" loading={formLoading}>
            Update Product
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default Products;
