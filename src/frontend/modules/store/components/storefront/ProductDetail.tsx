import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { useToast } from "@/frontend/components/ui/use-toast";
import { useStorefrontProduct } from "@/frontend/hooks/useStorefrontProducts";
import { useCart } from "@/frontend/hooks/useCart";
import { ShoppingCart, Plus, Minus, Loader2, ArrowLeft } from "lucide-react";

interface ProductDetailProps {
  isRTL?: boolean;
  productId?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  isRTL = false,
  productId: propProductId,
}) => {
  const { productId: paramProductId } = useParams<{ productId: string }>();
  const activeProductId = propProductId || paramProductId;
  const { toast } = useToast();
  const { addToCart, isAddingToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    error,
  } = useStorefrontProduct(activeProductId || "");

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-background">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !product) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-background">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? "المنتج غير موجود" : "Product Not Found"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isRTL
                ? "لم نتمكن من العثور على المنتج الذي تبحث عنه."
                : "We couldn't find the product you're looking for."}
            </p>
            <Button asChild>
              <Link to="/store">
                <ArrowLeft className="mr-2" />
                {isRTL ? "العودة إلى المتجر" : "Back to Store"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || "",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {isRTL ? "لا توجد صورة" : "No Image Available"}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{isRTL ? "السعر" : "Price"}</h3>
              <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">
                {isRTL ? "الوصف" : "Description"}
              </h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">
                {isRTL ? "الكمية" : "Quantity"}
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-20 text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {product.stock && (
              <div>
                <h3 className="font-medium mb-1">
                  {isRTL ? "المخزون" : "Stock"}
                </h3>
                <p
                  className={
                    product.stock > 10
                      ? "text-green-600"
                      : product.stock > 0
                        ? "text-amber-600"
                        : "text-red-600"
                  }
                >
                  {product.stock > 10
                    ? isRTL
                      ? "متوفر"
                      : "In Stock"
                    : product.stock > 0
                      ? isRTL
                        ? `${product.stock} قطع متبقية`
                        : `${product.stock} items left`
                      : isRTL
                        ? "غير متوفر"
                        : "Out of Stock"}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={
            isAddingToCart ||
            (product.stock !== undefined && product.stock <= 0)
          }
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isRTL ? "جاري الإضافة..." : "Adding..."}
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isRTL ? "إضافة إلى السلة" : "Add to Cart"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductDetail;
