import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Textarea } from "@/frontend/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/frontend/components/ui/alert-dialog";
import { useToast } from "@/frontend/components/ui/use-toast";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Image as ImageIcon,
  Loader2,
  X,
  Check,
} from "lucide-react";

interface ProductManagerProps {
  isRTL?: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Form validation schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
  stock: z
    .string()
    .min(1, "Stock is required")
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
      "Stock must be a non-negative number",
    ),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductManager = ({ isRTL = false }: ProductManagerProps) => {
  const { toast } = useToast();
  const { direction, language } = useLanguage();
  const rtl = isRTL || direction === "rtl";

  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        rtl
          ? "حدث خطأ أثناء جلب المنتجات. يرجى المحاولة مرة أخرى."
          : "An error occurred while fetching products. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Add a new product
  const addProduct = async (data: ProductFormValues) => {
    try {
      let imageUrl = "";

      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Insert product into database
      const { error } = await supabase.from("products").insert({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        image_url: imageUrl || null,
      });

      if (error) throw error;

      // Refresh products list
      await fetchProducts();

      // Show success message
      toast({
        title: rtl ? "تمت الإضافة بنجاح" : "Product Added",
        description: rtl
          ? "تمت إضافة المنتج بنجاح"
          : "The product has been added successfully",
      });

      // Reset form and close dialog
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: rtl ? "خطأ" : "Error",
        description: rtl
          ? "حدث خطأ أثناء إضافة المنتج"
          : "An error occurred while adding the product",
        variant: "destructive",
      });
    }
  };

  // Update an existing product
  const updateProduct = async (data: ProductFormValues) => {
    if (!selectedProduct) return;

    try {
      let imageUrl = selectedProduct.image_url || "";

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Update product in database
      const { error } = await supabase
        .from("products")
        .update({
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedProduct.id);

      if (error) throw error;

      // Refresh products list
      await fetchProducts();

      // Show success message
      toast({
        title: rtl ? "تم التحديث بنجاح" : "Product Updated",
        description: rtl
          ? "تم تحديث المنتج بنجاح"
          : "The product has been updated successfully",
      });

      // Reset form and close dialog
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: rtl ? "خطأ" : "Error",
        description: rtl
          ? "حدث خطأ أثناء تحديث المنتج"
          : "An error occurred while updating the product",
        variant: "destructive",
      });
    }
  };

  // Delete a product
  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct.id);

      if (error) throw error;

      // Refresh products list
      await fetchProducts();

      // Show success message
      toast({
        title: rtl ? "تم الحذف بنجاح" : "Product Deleted",
        description: rtl
          ? "تم حذف المنتج بنجاح"
          : "The product has been deleted successfully",
      });

      // Close dialog
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: rtl ? "خطأ" : "Error",
        description: rtl
          ? "حدث خطأ أثناء حذف المنتج"
          : "An error occurred while deleting the product",
        variant: "destructive",
      });
    }
  };

  // Open edit dialog and populate form
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price.toString());
    setValue("stock", product.stock.toString());
    setImagePreview(product.image_url || null);
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Reset form and state
  const resetForm = () => {
    reset();
    setImageFile(null);
    setImagePreview(null);
    setSelectedProduct(null);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {rtl ? "إدارة المنتجات" : "Product Management"}
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {rtl ? "إضافة منتج" : "Add Product"}
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={rtl ? "البحث عن منتج..." : "Search products..."}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Products table */}
      <Card>
        <CardHeader>
          <CardTitle>{rtl ? "قائمة المنتجات" : "Product List"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {rtl ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {rtl ? "لا توجد منتجات" : "No products found"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{rtl ? "الصورة" : "Image"}</TableHead>
                    <TableHead>{rtl ? "الاسم" : "Name"}</TableHead>
                    <TableHead>{rtl ? "السعر" : "Price"}</TableHead>
                    <TableHead>{rtl ? "المخزون" : "Stock"}</TableHead>
                    <TableHead className="text-right">
                      {rtl ? "الإجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-muted flex items-center justify-center rounded">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {product.stock > 0
                            ? `${product.stock} ${rtl ? "متوفر" : "in stock"}`
                            : rtl
                              ? "غير متوفر"
                              : "out of stock"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {rtl
              ? `إجمالي المنتجات: ${filteredProducts.length}`
              : `Total products: ${filteredProducts.length}`}
          </div>
        </CardFooter>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {rtl ? "إضافة منتج جديد" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {rtl
                ? "أدخل تفاصيل المنتج الجديد"
                : "Enter the details of the new product"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(addProduct)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">
                  {rtl ? "اسم المنتج" : "Product Name"}
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder={rtl ? "أدخل اسم المنتج" : "Enter product name"}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{rtl ? "السعر" : "Price"}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price")}
                  placeholder={rtl ? "0.00" : "0.00"}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">{rtl ? "المخزون" : "Stock"}</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register("stock")}
                  placeholder={rtl ? "0" : "0"}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">
                  {rtl ? "الوصف" : "Description"}
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                  placeholder={
                    rtl ? "أدخل وصف المنتج" : "Enter product description"
                  }
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="image">{rtl ? "الصورة" : "Image"}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  {imagePreview && (
                    <div className="relative h-16 w-16">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-white rounded-full flex items-center justify-center"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                {rtl ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {rtl ? "جاري الرفع..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {rtl ? "إضافة" : "Add"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{rtl ? "تعديل المنتج" : "Edit Product"}</DialogTitle>
            <DialogDescription>
              {rtl ? "تعديل تفاصيل المنتج" : "Edit the details of the product"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(updateProduct)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-name">
                  {rtl ? "اسم المنتج" : "Product Name"}
                </Label>
                <Input
                  id="edit-name"
                  {...register("name")}
                  placeholder={rtl ? "أدخل اسم المنتج" : "Enter product name"}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">{rtl ? "السعر" : "Price"}</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price")}
                  placeholder={rtl ? "0.00" : "0.00"}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-stock">{rtl ? "المخزون" : "Stock"}</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  {...register("stock")}
                  placeholder={rtl ? "0" : "0"}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-description">
                  {rtl ? "الوصف" : "Description"}
                </Label>
                <Textarea
                  id="edit-description"
                  {...register("description")}
                  rows={3}
                  placeholder={
                    rtl ? "أدخل وصف المنتج" : "Enter product description"
                  }
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-image">{rtl ? "الصورة" : "Image"}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  {imagePreview && (
                    <div className="relative h-16 w-16">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-white rounded-full flex items-center justify-center"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(selectedProduct?.image_url || null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                }}
              >
                {rtl ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {rtl ? "جاري الرفع..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {rtl ? "حفظ التغييرات" : "Save Changes"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {rtl ? "هل أنت متأكد؟" : "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {rtl
                ? `هل أنت متأكد من حذف المنتج "${selectedProduct?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete the product "${selectedProduct?.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{rtl ? "إلغاء" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct}>
              {rtl ? "حذف" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManager;
