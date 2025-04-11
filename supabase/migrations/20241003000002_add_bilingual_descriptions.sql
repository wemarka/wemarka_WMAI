-- Add bilingual descriptions to tables

-- Products table
COMMENT ON TABLE products IS 'Store products with details like name, price, and inventory (EN) | منتجات المتجر مع تفاصيل مثل الاسم والسعر والمخزون (AR)';
COMMENT ON COLUMN products.id IS 'Unique identifier for the product (EN) | معرف فريد للمنتج (AR)';
COMMENT ON COLUMN products.name IS 'Product name (EN) | اسم المنتج (AR)';
COMMENT ON COLUMN products.description IS 'Detailed product description (EN) | وصف تفصيلي للمنتج (AR)';
COMMENT ON COLUMN products.price IS 'Product price in the default currency (EN) | سعر المنتج بالعملة الافتراضية (AR)';
COMMENT ON COLUMN products.image_url IS 'URL to the product image (EN) | رابط صورة المنتج (AR)';
-- Removing the category column comment as it doesn't exist
COMMENT ON COLUMN products.stock IS 'Current inventory count (EN) | عدد المخزون الحالي (AR)';
-- Column 'is_active' doesn't exist in the products table, so removing this comment
COMMENT ON COLUMN products.created_at IS 'Timestamp when the product was created (EN) | الطابع الزمني عند إنشاء المنتج (AR)';
COMMENT ON COLUMN products.updated_at IS 'Timestamp when the product was last updated (EN) | الطابع الزمني عند آخر تحديث للمنتج (AR)';

-- Orders table
COMMENT ON TABLE orders IS 'Customer orders with status and payment information (EN) | طلبات العملاء مع معلومات الحالة والدفع (AR)';
COMMENT ON COLUMN orders.id IS 'Unique identifier for the order (EN) | معرف فريد للطلب (AR)';
COMMENT ON COLUMN orders.user_id IS 'ID of the user who placed the order (EN) | معرف المستخدم الذي قدم الطلب (AR)';
COMMENT ON COLUMN orders.amount IS 'Total order amount (EN) | إجمالي مبلغ الطلب (AR)';
COMMENT ON COLUMN orders.status IS 'Current status of the order (pending, processing, shipped, delivered, cancelled) (EN) | الحالة الحالية للطلب (قيد الانتظار، قيد المعالجة، تم الشحن، تم التسليم، تم الإلغاء) (AR)';
COMMENT ON COLUMN orders.created_at IS 'Timestamp when the order was created (EN) | الطابع الزمني عند إنشاء الطلب (AR)';

-- Order items table
COMMENT ON TABLE order_items IS 'Individual items within an order (EN) | العناصر الفردية داخل الطلب (AR)';
COMMENT ON COLUMN order_items.id IS 'Unique identifier for the order item (EN) | معرف فريد لعنصر الطلب (AR)';
COMMENT ON COLUMN order_items.order_id IS 'ID of the parent order (EN) | معرف الطلب الأصلي (AR)';
COMMENT ON COLUMN order_items.product_id IS 'ID of the product ordered (EN) | معرف المنتج المطلوب (AR)';
COMMENT ON COLUMN order_items.quantity IS 'Quantity of the product ordered (EN) | كمية المنتج المطلوبة (AR)';
COMMENT ON COLUMN order_items.price IS 'Price of the product at the time of order (EN) | سعر المنتج وقت الطلب (AR)';

-- User roles table
COMMENT ON TABLE user_roles IS 'Roles assigned to users for permission management (EN) | الأدوار المخصصة للمستخدمين لإدارة الصلاحيات (AR)';
COMMENT ON COLUMN user_roles.id IS 'Unique identifier for the user role assignment (EN) | معرف فريد لتعيين دور المستخدم (AR)';
COMMENT ON COLUMN user_roles.user_id IS 'ID of the user (EN) | معرف المستخدم (AR)';
COMMENT ON COLUMN user_roles.role IS 'Role name (admin, staff, customer, etc.) (EN) | اسم الدور (مدير، موظف، عميل، إلخ) (AR)';
COMMENT ON COLUMN user_roles.created_at IS 'Timestamp when the role was assigned (EN) | الطابع الزمني عند تعيين الدور (AR)';
