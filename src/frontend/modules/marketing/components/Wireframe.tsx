import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";

export default function MarketingWireframe() {
  return (
    <div className="container mx-auto p-4 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Marketing Hub</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted/20 rounded-md flex items-center justify-center">
                <div className="text-muted-foreground">
                  Campaign Performance Chart
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                {["Impressions", "Clicks", "Conversions", "ROI"].map(
                  (metric) => (
                    <div key={metric} className="p-4 bg-muted/20 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {metric}
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {metric === "ROI"
                          ? "245%"
                          : metric === "Conversions"
                            ? "1.2K"
                            : metric === "Clicks"
                              ? "15.4K"
                              : "342K"}
                      </div>
                      <div className="text-xs text-success flex items-center mt-1">
                        <span className="mr-1">↑</span> 12% from last week
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Summer Sale",
                    "New Product Launch",
                    "Retargeting Campaign",
                    "Email Newsletter",
                  ].map((campaign, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-md hover:bg-muted/20 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{campaign}</div>
                        <div className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                          {index === 0
                            ? "Running"
                            : index === 1
                              ? "Scheduled"
                              : "Active"}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <div className="text-muted-foreground">
                          Budget: $1,{index + 1}00
                        </div>
                        <div className="text-muted-foreground">
                          Platform:{" "}
                          {index === 0
                            ? "Facebook"
                            : index === 1
                              ? "Google"
                              : index === 2
                                ? "Instagram"
                                : "Email"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded-md border flex items-center justify-center text-xs",
                        i % 7 === 2 || i % 7 === 5
                          ? "bg-primary/20 border-primary/30"
                          : "",
                      )}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                    <div className="text-xs">Social Media Post</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-success/50"></div>
                    <div className="text-xs">Email Campaign</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Create Campaign",
                  "Schedule Post",
                  "Generate Content",
                  "Analyze Results",
                ].map((action) => (
                  <div
                    key={action}
                    className="p-3 border rounded-md hover:bg-primary/10 cursor-pointer flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      +
                    </div>
                    <div>{action}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Facebook", "Instagram", "Google Ads", "Email"].map(
                  (platform) => (
                    <div
                      key={platform}
                      className="flex items-center justify-between"
                    >
                      <div>{platform}</div>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width:
                              platform === "Facebook"
                                ? "70%"
                                : platform === "Instagram"
                                  ? "85%"
                                  : platform === "Google Ads"
                                    ? "60%"
                                    : "40%",
                          }}
                        ></div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Review campaign performance",
                  "Approve social media posts",
                  "Finalize email copy",
                  "Budget review meeting",
                ].map((task) => (
                  <div key={task} className="flex items-center space-x-2">
                    <div className="w-4 h-4 border rounded flex-shrink-0"></div>
                    <div className="text-sm">{task}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
