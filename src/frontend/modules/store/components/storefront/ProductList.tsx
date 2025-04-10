import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
import { Button } from "@/frontend/components/ui/button";
import { useToast } from "@/frontend/components/ui/use-toast";
import { Search, ArrowUpDown, ShoppingCart, Loader2 } from "lucide-react";
import { useStorefrontProducts } from "@/frontend/hooks/useStorefrontProducts";
import { useCart } from "@/frontend/hooks/useCart";

interface ProductListProps {
  isRTL?: boolean;
}

const ProductList = ({ isRTL = false }: ProductListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch products using React Query
  const { data: products, isLoading, isError, error } = useStorefrontProducts();

  // Cart functionality
  const { addToCart, isAddingToCart } = useCart();

  // Categories for filter
  const categories = ["All"];
  if (products) {
    // Extract unique categories from products
    const uniqueCategories = [
      ...new Set(products.map((product) => product.description.split(" ")[0])),
    ];
    categories.push(...uniqueCategories);
  }

  // Filter and sort products
  const filteredProducts = products
    ? products
        .filter((product) => {
          const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchesCategory =
            selectedCategory === "All" ||
            product.description.split(" ")[0] === selectedCategory;
          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          if (sortBy === "name") {
            return sortOrder === "asc"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          } else if (sortBy === "price") {
            return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
          } else {
            return sortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock;
          }
        })
    : [];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleAddToCart = (product) => {
    addToCart({
      product_id: product.id,
      quantity: 1,
      price: product.price,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "قائمة المنتجات" : "Product List"}
      </h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder={isRTL ? "البحث عن المنتجات..." : "Search products..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex gap-2">
          <div className="w-40">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {isRTL
                    ? category === "All"
                      ? "الكل"
                      : category === "Electronics"
                        ? "إلكترونيات"
                        : category === "Clothing"
                          ? "ملابس"
                          : "منزل"
                    : category}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-40">
            <Select value={sortBy} onValueChange={setSortBy}>
              <option value="name">{isRTL ? "الاسم" : "Name"}</option>
              <option value="price">{isRTL ? "السعر" : "Price"}</option>
              <option value="stock">{isRTL ? "المخزون" : "Stock"}</option>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            title={isRTL ? "تبديل ترتيب الفرز" : "Toggle sort order"}
          >
            <ArrowUpDown
              className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">
            {isRTL ? "جاري التحميل..." : "Loading products..."}
          </span>
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-destructive">
          {error?.message || (isRTL ? "حدث خطأ" : "An error occurred")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {product.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/storefront/product/${product.id}`)
                    }
                  >
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-xl font-bold">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? "المخزون: " : "Stock: "}
                      <span className="font-medium">{product.stock}</span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    {isRTL ? "إضافة إلى السلة" : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">
                {isRTL ? "لا توجد منتجات مطابقة" : "No matching products found"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
