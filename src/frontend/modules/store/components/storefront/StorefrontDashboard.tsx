import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { ShoppingBag, CreditCard, ShoppingCart, Package } from "lucide-react";

interface StorefrontDashboardProps {
  isRTL?: boolean;
}

const StorefrontDashboard = ({ isRTL = false }: StorefrontDashboardProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "واجهة المتجر" : "Storefront Dashboard"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/storefront" className="block">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isRTL ? "المنتجات" : "Products"}</CardTitle>
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "تصفح كافة المنتجات" : "Browse all products"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/storefront/product/1" className="block">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {isRTL ? "تفاصيل المنتج" : "Product Details"}
                </CardTitle>
                <Package className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "عرض تفاصيل المنتج" : "View product details"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/storefront/cart" className="block">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isRTL ? "سلة التسوق" : "Shopping Cart"}</CardTitle>
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "عرض سلة التسوق" : "View shopping cart"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/storefront/checkout" className="block">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isRTL ? "الدفع" : "Checkout"}</CardTitle>
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "إتمام عملية الشراء" : "Complete purchase"}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default StorefrontDashboard;
