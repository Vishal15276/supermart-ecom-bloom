import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const EditProduct = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if location.state is available and fallback to an empty object if it's null
  const product = location.state?.product || {}; 

  // Initialize state variables with product data, or empty strings/numbers
  const [name, setName] = useState(product.name || "");
  const [category, setCategory] = useState(product.category || "");
  const [price, setPrice] = useState(product.price || "");
  const [stock, setStock] = useState(product.stock || "");

  useEffect(() => {
    // If no product data is passed, redirect to the products page
    if (!product.id) {
      navigate("/admin/products");
    }
  }, [product, navigate]);

  const handleSave = () => {
    // Ideally, you would make an API call here to update the product in the database
    // For now, we'll just show a success message
    toast({
      title: "Product Updated",
      description: "The product details have been successfully updated.",
    });
    navigate("/admin/products");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>

      <div className="mb-4">
        <Input
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          label="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button onClick={handleSave}>Save Changes</Button>
        <Button variant="outline" onClick={() => navigate("/admin/products")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditProduct;
