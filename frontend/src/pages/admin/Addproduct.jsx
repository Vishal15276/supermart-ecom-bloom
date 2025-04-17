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
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || !formData.stock || !formData.image) {
      toast({
        title: "Missing Fields",
        description: "Please fill all the fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send POST request to the backend to add the product
      const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage after login
      const response = await axios.post(
        "/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Product Added",
        description: `${formData.name} has been successfully added.`,
      });

      // Redirect to the product listing page after successful submission
      navigate("/admin/products");
    } catch (err) {
      console.error("Error adding product:", err);
      toast({
        title: "Error",
        description: "There was an error adding the product.",
        variant: "destructive",
      });
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
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/placeholder.svg or external URL"
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

export default AddProduct;
