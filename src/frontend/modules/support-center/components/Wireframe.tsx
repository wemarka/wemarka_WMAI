import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";

export default function SupportCenterWireframe() {
  return (
    <div className="container mx-auto p-4 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Support Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Ticket Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Filter Tickets</div>
                  <div className="flex space-x-2">
                    <div className="w-24 h-8 bg-muted rounded"></div>
                    <div className="w-24 h-8 bg-muted rounded"></div>
                  </div>
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/20 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-10 bg-primary rounded-full"></div>
                        <div>
                          <div className="font-medium">Ticket #{item}00</div>
                          <div className="text-sm text-muted-foreground">
                            Customer inquiry about product
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm bg-muted px-2 py-1 rounded">
                          Open
                        </div>
                        <div className="text-sm text-muted-foreground">
                          2h ago
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/20 rounded-md text-center">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">
                    Open Tickets
                  </div>
                </div>
                <div className="p-4 bg-muted/20 rounded-md text-center">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">Urgent</div>
                </div>
                <div className="p-4 bg-muted/20 rounded-md text-center">
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-sm text-muted-foreground">
                    Resolved Today
                  </div>
                </div>
                <div className="p-4 bg-muted/20 rounded-md text-center">
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-sm text-muted-foreground">
                    Satisfaction
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((agent) => (
                  <div
                    key={agent}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted"></div>
                      <div>
                        <div className="font-medium">Agent {agent}</div>
                        <div className="text-xs text-muted-foreground">
                          Handling 3 tickets
                        </div>
                      </div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "Product FAQs",
                "Troubleshooting",
                "Returns & Refunds",
                "Shipping Info",
                "Account Help",
                "Payment Issues",
              ].map((category) => (
                <div
                  key={category}
                  className="p-4 border rounded-md hover:bg-muted/20 cursor-pointer"
                >
                  <div className="font-medium">{category}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    12 articles
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
