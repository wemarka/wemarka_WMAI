import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
import { Button } from "@/frontend/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";

interface ProductListProps {
  isRTL?: boolean;
}

// Mock product data
const mockProducts = [
  { id: 1, name: "Product 1", category: "Electronics", price: 299, stock: 10 },
  { id: 2, name: "Product 2", category: "Clothing", price: 49, stock: 25 },
  { id: 3, name: "Product 3", category: "Home", price: 129, stock: 5 },
  { id: 4, name: "Product 4", category: "Electronics", price: 199, stock: 8 },
  { id: 5, name: "Product 5", category: "Clothing", price: 79, stock: 15 },
  { id: 6, name: "Product 6", category: "Home", price: 99, stock: 12 },
];

// Categories for filter
const categories = ["All", "Electronics", "Clothing", "Home"];

const ProductList = ({ isRTL = false }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
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
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {isRTL ? "الفئة: " : "Category: "}
                    <span className="font-medium">{product.category}</span>
                  </p>
                  <p className="text-muted-foreground">
                    {isRTL ? "السعر: " : "Price: "}
                    <span className="font-medium">${product.price}</span>
                  </p>
                  <p className="text-muted-foreground">
                    {isRTL ? "المخزون: " : "Stock: "}
                    <span className="font-medium">{product.stock}</span>
                  </p>
                </div>
              </CardContent>
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
    </div>
  );
};

export default ProductList;
