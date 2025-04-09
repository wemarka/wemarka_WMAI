import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface ProductManagerProps {
  isRTL?: boolean;
}

const ProductManager = ({ isRTL = false }: ProductManagerProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "إدارة المنتجات" : "Product Management"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "قائمة المنتجات" : "Product List"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض وإدارة المنتجات" : "View and manage products"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "إضافة منتج" : "Add Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إضافة منتج جديد" : "Add a new product"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "فئات المنتجات" : "Product Categories"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة فئات المنتجات" : "Manage product categories"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductManager;
