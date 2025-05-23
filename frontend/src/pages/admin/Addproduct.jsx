import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    imageFile: null, 
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile") {
      setFormData((prev) => ({
        ...prev,
        imageFile: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to add a product.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock ||
      !formData.imageFile
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill all the fields and choose an image.",
        variant: "destructive",
      });
      return;
    }

    try {
      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("category", formData.category);
      productData.append("price", formData.price);
      productData.append("stock", formData.stock);
      productData.append("image", formData.imageFile); // must match backend key

      const response = await axios.post(
        "http://localhost:3000/api/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Product Added",
        description: `${formData.name} has been successfully added.`,
      });

      navigate("/admin/products");
    } catch (err) {
      console.error("Error adding product:", err);

      if (err.response && err.response.status === 401) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: "There was an error adding the product.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Organic Apples"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. fruits"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (in INR)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 399"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <Label htmlFor="imageFile">Image (JPG only)</Label>
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/jpeg"
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
//new line
export default AddProduct;
