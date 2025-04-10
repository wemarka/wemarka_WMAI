import { cn } from "@/frontend/lib/utils";
import { Search, Filter, ShoppingCart, Heart } from "lucide-react";

export default function StoreWireframe() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <div className="w-full p-4 border-b">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Store</h1>
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-primary-50 text-primary">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-primary-50 text-primary relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Categories Sidebar */}
        <div className="w-full md:w-64 p-4 border-r">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Categories</h2>
            <ul className="space-y-2">
              {[
                "All Products",
                "Electronics",
                "Clothing",
                "Home & Kitchen",
                "Books",
                "Beauty",
                "Sports",
              ].map((category) => (
                <li
                  key={category}
                  className="cursor-pointer hover:text-primary"
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Filters</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input type="range" className="w-full" />
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>$0</span>
                  <span>$1000</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Rating</h3>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rating-${rating}`}
                        className="mr-2"
                      />
                      <label htmlFor={`rating-${rating}`} className="text-sm">
                        {rating} Stars & Up
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-2 px-4 bg-primary text-white rounded-md flex items-center justify-center gap-2">
            <Filter className="h-4 w-4" />
            Apply Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Showing 24 of 156 products
            </p>
            <select className="border rounded-md p-1 text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
              <option>Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden hover:shadow-card transition-shadow"
              >
                <div className="bg-muted aspect-square relative">
                  {/* Placeholder for product image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Product Image
                  </div>
                  {i % 3 === 0 && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      Sale
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-sm text-muted-foreground mb-1">
                    Category
                  </div>
                  <h3 className="font-medium mb-1 truncate">
                    Product Name {i + 1}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      ${(19.99 + i * 10).toFixed(2)}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★★★★</span>
                      <span className="text-muted ml-1 text-xs">(24)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border">
                &lt;
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded",
                    page === 1 ? "bg-primary text-white" : "border",
                  )}
                >
                  {page}
                </button>
              ))}
              <button className="w-8 h-8 flex items-center justify-center rounded border">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
