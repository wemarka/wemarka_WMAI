import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface ProductListProps {
  isRTL?: boolean;
}

const ProductList = ({ isRTL = false }: ProductListProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "قائمة المنتجات" : "Product List"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "جميع المنتجات" : "All Products"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض جميع المنتجات" : "View all products"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "تصفية المنتجات" : "Filter Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "تصفية المنتجات حسب الفئة"
                : "Filter products by category"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "البحث عن المنتجات" : "Search Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "البحث عن المنتجات" : "Search for products"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductList;
