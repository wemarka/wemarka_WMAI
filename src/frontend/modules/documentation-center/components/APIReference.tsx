import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Badge } from "@/frontend/components/ui/badge";

interface APIEndpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  responses?: {
    code: string;
    description: string;
    example?: string;
  }[];
  category: string;
}

interface APIReferenceProps {
  searchQuery?: string;
}

const APIReference: React.FC<APIReferenceProps> = ({ searchQuery = "" }) => {
  const [activeCategory, setActiveCategory] = useState("store");
  const [filteredEndpoints, setFilteredEndpoints] = useState<APIEndpoint[]>([]);

  // Sample API endpoints data - in a real app, this would come from an API or database
  const apiEndpoints: APIEndpoint[] = [
    {
      id: "1",
      name: "List Products",
      method: "GET",
      endpoint: "/api/store/products",
      description: "Retrieves a list of products with optional filtering.",
      parameters: [
        {
          name: "limit",
          type: "number",
          required: false,
          description: "Maximum number of products to return",
        },
        {
          name: "offset",
          type: "number",
          required: false,
          description: "Number of products to skip",
        },
        {
          name: "category",
          type: "string",
          required: false,
          description: "Filter by category ID",
        },
      ],
      responses: [
        {
          code: "200",
          description: "Success",
          example: '{"products": [...], "total": 100}',
        },
        {
          code: "400",
          description: "Bad Request",
          example: '{"error": "Invalid parameters"}',
        },
      ],
      category: "store",
    },
    {
      id: "2",
      name: "Create Product",
      method: "POST",
      endpoint: "/api/store/products",
      description: "Creates a new product.",
      parameters: [
        {
          name: "name",
          type: "string",
          required: true,
          description: "Product name",
        },
        {
          name: "price",
          type: "number",
          required: true,
          description: "Product price",
        },
        {
          name: "description",
          type: "string",
          required: false,
          description: "Product description",
        },
        {
          name: "category_id",
          type: "string",
          required: true,
          description: "Category ID",
        },
      ],
      responses: [
        {
          code: "201",
          description: "Created",
          example: '{"id": "123", "name": "Product Name"}',
        },
        {
          code: "400",
          description: "Bad Request",
          example: '{"error": "Missing required fields"}',
        },
      ],
      category: "store",
    },
    {
      id: "3",
      name: "Get Campaign Analytics",
      method: "GET",
      endpoint: "/api/marketing/campaigns/{id}/analytics",
      description:
        "Retrieves analytics data for a specific marketing campaign.",
      parameters: [
        {
          name: "id",
          type: "string",
          required: true,
          description: "Campaign ID",
        },
        {
          name: "start_date",
          type: "date",
          required: false,
          description: "Start date for analytics",
        },
        {
          name: "end_date",
          type: "date",
          required: false,
          description: "End date for analytics",
        },
      ],
      responses: [
        {
          code: "200",
          description: "Success",
          example: '{"impressions": 1000, "clicks": 100, "conversions": 10}',
        },
        {
          code: "404",
          description: "Not Found",
          example: '{"error": "Campaign not found"}',
        },
      ],
      category: "marketing",
    },
    {
      id: "4",
      name: "Create Invoice",
      method: "POST",
      endpoint: "/api/accounting/invoices",
      description: "Creates a new invoice.",
      parameters: [
        {
          name: "customer_id",
          type: "string",
          required: true,
          description: "Customer ID",
        },
        {
          name: "items",
          type: "array",
          required: true,
          description: "Array of invoice items",
        },
        {
          name: "due_date",
          type: "date",
          required: true,
          description: "Invoice due date",
        },
      ],
      responses: [
        {
          code: "201",
          description: "Created",
          example: '{"id": "inv-123", "total": 100.00}',
        },
        {
          code: "400",
          description: "Bad Request",
          example: '{"error": "Invalid invoice data"}',
        },
      ],
      category: "accounting",
    },
  ];

  // Filter endpoints based on search query and active category
  useEffect(() => {
    let filtered = apiEndpoints;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (endpoint) =>
          endpoint.name.toLowerCase().includes(query) ||
          endpoint.description.toLowerCase().includes(query) ||
          endpoint.endpoint.toLowerCase().includes(query),
      );
    } else {
      filtered = apiEndpoints.filter(
        (endpoint) => endpoint.category === activeCategory,
      );
    }

    setFilteredEndpoints(filtered);
  }, [searchQuery, activeCategory]);

  // Get unique categories from endpoints
  const categories = [
    ...new Set(apiEndpoints.map((endpoint) => endpoint.category)),
  ];

  // Method badge color mapping
  const methodColors: Record<string, string> = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-yellow-500",
    DELETE: "bg-red-500",
    PATCH: "bg-purple-500",
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">API Reference</h2>
        <p className="text-muted-foreground">
          Explore the Wemarka WMAI API endpoints and learn how to integrate with
          our platform
        </p>
      </div>

      {searchQuery ? (
        <div className="mb-4">
          <h3 className="text-lg font-medium">Search Results</h3>
          <p className="text-sm text-muted-foreground">
            Showing {filteredEndpoints.length} results for "{searchQuery}"
          </p>
        </div>
      ) : (
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full mb-6"
        >
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {filteredEndpoints.length === 0 ? (
        <Card className="p-6 text-center">
          <p>No API endpoints found matching your criteria.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredEndpoints.map((endpoint) => (
            <Card key={endpoint.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{endpoint.name}</CardTitle>
                  <Badge
                    className={`${methodColors[endpoint.method]} text-white`}
                  >
                    {endpoint.method}
                  </Badge>
                </div>
                <code className="text-sm font-mono bg-muted p-1 rounded">
                  {endpoint.endpoint}
                </code>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-4">{endpoint.description}</p>

                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-2 border">Name</th>
                            <th className="text-left p-2 border">Type</th>
                            <th className="text-left p-2 border">Required</th>
                            <th className="text-left p-2 border">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2 border font-mono text-sm">
                                {param.name}
                              </td>
                              <td className="p-2 border">{param.type}</td>
                              <td className="p-2 border">
                                {param.required ? "Yes" : "No"}
                              </td>
                              <td className="p-2 border">
                                {param.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {endpoint.responses && endpoint.responses.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Responses</h4>
                    <div className="space-y-3">
                      {endpoint.responses.map((response, index) => (
                        <div key={index} className="bg-muted/30 p-3 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{response.code}</Badge>
                            <span className="font-medium">
                              {response.description}
                            </span>
                          </div>
                          {response.example && (
                            <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                              {response.example}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default APIReference;
