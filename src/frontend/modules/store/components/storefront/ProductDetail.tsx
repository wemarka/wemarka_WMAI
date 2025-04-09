import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface ProductDetailProps {
  isRTL?: boolean;
  productId?: string;
}

const ProductDetail = ({
  isRTL = false,
  productId = "1",
}: ProductDetailProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "تفاصيل المنتج" : "Product Details"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "معلومات المنتج" : "Product Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض معلومات المنتج" : "View product information"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "صور المنتج" : "Product Images"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض صور المنتج" : "View product images"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "المراجعات" : "Reviews"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "قراءة مراجعات المنتج" : "Read product reviews"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "المنتجات ذات الصلة" : "Related Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "استعراض المنتجات ذات الصلة" : "Browse related products"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;
