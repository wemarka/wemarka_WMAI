-- Fix product_sales view (for top products)
DROP VIEW IF EXISTS product_sales;
CREATE OR REPLACE VIEW product_sales AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  SUM(o.amount) AS total_sales,
  COUNT(o.id) AS units_sold,
  p.image_url,
  date_trunc('day', o.created_at)::date AS date,
  'Product' AS category
FROM products p
JOIN orders o ON o.order_items::jsonb @> jsonb_build_array(jsonb_build_object('product_id', p.id::text))
GROUP BY p.id, p.name, p.image_url, date_trunc('day', o.created_at)::date;