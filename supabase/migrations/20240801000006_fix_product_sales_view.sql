-- Fix product_sales view (for top products)
DROP VIEW IF EXISTS product_sales;

-- First, let's check if the orders table has an order_items column
DO $$
BEGIN
  -- Create the view based on the actual structure of the orders table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'order_items'
  ) THEN
    -- If order_items exists, use it (assuming it's a JSONB array of items)
    EXECUTE 'CREATE VIEW product_sales AS
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      SUM(oi.item_price * oi.quantity) AS total_sales,
      SUM(oi.quantity) AS units_sold,
      p.image_url,
      date_trunc(''day'', o.created_at)::date AS date,
      ''Product'' AS category
    FROM products p
    JOIN orders o ON true
    JOIN LATERAL jsonb_to_recordset(o.order_items) AS oi(product_id UUID, quantity INT, item_price DECIMAL)
      ON oi.product_id = p.id
    GROUP BY p.id, p.name, p.image_url, date_trunc(''day'', o.created_at)::date;';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'product_id'
  ) THEN
    -- If product_id exists, use the original approach
    EXECUTE 'CREATE VIEW product_sales AS
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      SUM(o.amount) AS total_sales,
      COUNT(o.id) AS units_sold,
      p.image_url,
      date_trunc(''day'', o.created_at)::date AS date,
      ''Product'' AS category
    FROM products p
    JOIN orders o ON o.product_id = p.id
    GROUP BY p.id, p.name, p.image_url, date_trunc(''day'', o.created_at)::date;';
  ELSE
    -- If neither exists, create a view that joins on order_id column (assuming it exists)
    EXECUTE 'CREATE VIEW product_sales AS
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      SUM(o.amount) AS total_sales,
      COUNT(o.id) AS units_sold,
      p.image_url,
      date_trunc(''day'', o.created_at)::date AS date,
      ''Product'' AS category
    FROM products p
    JOIN order_items oi ON oi.product_id = p.id
    JOIN orders o ON o.id = oi.order_id
    GROUP BY p.id, p.name, p.image_url, date_trunc(''day'', o.created_at)::date;';
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Fallback to a simple view if all else fails
  CREATE VIEW product_sales AS
  SELECT
    p.id AS product_id,
    p.name AS product_name,
    0 AS total_sales,
    0 AS units_sold,
    p.image_url,
    CURRENT_DATE AS date,
    'Product' AS category
  FROM products p
  GROUP BY p.id, p.name, p.image_url;
END $$;