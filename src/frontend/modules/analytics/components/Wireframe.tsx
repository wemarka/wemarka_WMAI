import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/frontend/components/ui/tabs';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Select } from '@/frontend/components/ui/select';
import { Badge } from '@/frontend/components/ui/badge';
import { Separator } from '@/frontend/components/ui/separator';
import { BarChart, LineChart, PieChart, ArrowUpRight, ArrowDownRight, Download, Calendar, Filter, RefreshCw, Zap, Share2 } from 'lucide-react';

const AnalyticsWireframe = () => {
  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track and analyze your business performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-muted rounded-md p-1">
            <Button variant="ghost" size="sm" className="rounded-sm">
              Day
            </Button>
            <Button variant="ghost" size="sm" className="rounded-sm">
              Week
            </Button>
            <Button variant="default" size="sm" className="rounded-sm">
              Month
            </Button>
            <Button variant="ghost" size="sm" className="rounded-sm">
              Year
            </Button>
          </div>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">$24,780</div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>12.5% vs last month</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">384</div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>8.2% vs last month</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">3.6%</div>
                <div className="flex items-center text-sm text-red-600">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>1.2% vs last month</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">$64.50</div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>4.3% vs last month</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="marketing">Marketing ROI</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Revenue Over Time</CardTitle>
                    <CardDescription>Monthly revenue for the past year</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Chart placeholder */}
                <div className="w-full aspect-[3/2] bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                  <div className="text-center p-4">
                    <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Revenue chart visualization</p>
                    <p className="text-xs text-muted-foreground">Shows monthly revenue trends with year-over-year comparison</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded" />
                          <div>
                            <p className="text-sm font-medium">Product {i + 1}</p>
                            <p className="text-xs text-muted-foreground">{50 - i * 5} units</p>
                          </div>
                        </div>
                        <p className="font-medium">${(100 - i * 10).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    View All Products
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Channel</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Pie chart placeholder */}
                  <div className="w-full aspect-square bg-muted/30 rounded-lg flex items-center justify-center border border-dashed mb-4">
                    <div className="text-center p-4">
                      <PieChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Distribution of sales across channels</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <p className="text-sm">Website</p>
                      </div>
                      <p className="text-sm font-medium">45%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <p className="text-sm">Mobile App</p>
                      </div>
                      <p className="text-sm font-medium">30%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <p className="text-sm">Marketplace</p>
                      </div>
                      <p className="text-sm font-medium">15%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        <p className="text-sm">Social Media</p>
                      </div>
                      <p className="text-sm font-medium">10%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="marketing" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campaign Performance</CardTitle>
                    <CardDescription>ROI and conversion metrics for marketing campaigns</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="border rounded p-1 text-sm bg-background">
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last 12 months</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Campaign</th>
                        <th className="text-left p-2 font-medium">Platform</th>
                        <th className="text-right p-2 font-medium">Spend</th>
                        <th className="text-right p-2 font-medium">Revenue</th>
                        <th className="text-right p-2 font-medium">ROI</th>
                        <th className="text-right p-2 font-medium">Conv. Rate</th>
                        <th className="text-right p-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Summer Sale</td>
                        <td className="p-2">Facebook</td>
                        <td className="p-2 text-right">$1,200</td>
                        <td className="p-2 text-right">$4,800</td>
                        <td className="p-2 text-right text-green-600">4.0x</td>
                        <td className="p-2 text-right">3.2%</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">New Collection</td>
                        <td className="p-2">Instagram</td>
                        <td className="p-2 text-right">$850</td>
                        <td className="p-2 text-right">$3,200</td>
                        <td className="p-2 text-right text-green-600">3.8x</td>
                        <td className="p-2 text-right">2.9%</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Holiday Special</td>
                        <td className="p-2">Google</td>
                        <td className="p-2 text-right">$2,000</td>
                        <td className="p-2 text-right">$7,500</td>
                        <td className="p-2 text-right text-green-600">3.75x</td>
                        <td className="p-2 text-right">4.1%</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Flash Sale</td>
                        <td className="p-2">TikTok</td>
                        <td className="p-2 text-right">$600</td>
                        <td className="p-2 text-right">$1,800</td>
                        <td className="p-2 text-right text-green-600">3.0x</td>
                        <td className="p-2 text-right">2.5%</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Brand Awareness</td>
                        <td className="p-2">YouTube</td>
                        <td className="p-2 text-right">$1,500</td>
                        <td className="p-2 text-right">$2,250</td>
                        <td className="p-2 text-right text-yellow-600">1.5x</td>
                        <td className="p-2 text-right">1.8%</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ended</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Bar chart placeholder */}
                  <div className="w-full aspect-[4/3] bg-muted/30 rounded-lg flex items-center justify-center border border-dashed mb-4">
                    <div className="text-center p-4">
                      <BarChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">ROI comparison by marketing channel</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Facebook</p>
                      <p className="text-sm font-medium">3.8x ROI</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Google</p>
                      <p className="text-sm font-medium">4.2x ROI</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Instagram</p>
                      <p className="text-sm font-medium">3.5x ROI</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">TikTok</p>
                      <p className="text-sm font-medium">2.9x ROI</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    Optimize Budget
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg">
                      <p className="text-sm font-medium">Opportunity</p>
                      <p className="text-sm mt-1">Increasing budget for Google campaigns could yield 15% more conversions based on current performance.</p>
                    </div>
                    <div className="p-3 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 rounded-lg">
                      <p className="text-sm font-medium">Warning</p>
                      <p className="text-sm mt-1">TikTok campaign performance has declined by 12% in the past week.</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 rounded-lg">
                      <p className="text-sm font-medium">Success</p>
                      <p className="text-sm mt-1">Instagram story ads are outperforming feed ads by 23% in terms of engagement.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Customer Segments</CardTitle>
                    <CardDescription>Analysis of customer behavior and demographics</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart placeholder - Customer Age Distribution */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Age Distribution</h3>
                    <div className="w-full aspect-square bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                      <div className="text-center p-4">
                        <BarChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Customer age distribution chart</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart placeholder - Customer Geography */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Geographic Distribution</h3>
                    <div className="w-full aspect-square bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                      <div className="text-center p-4">
                        <div className="h-8 w-8 mx-auto mb-2 text-muted-foreground">🌎</div>
                        <p className="text-xs text-muted-foreground">Customer location map</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart placeholder - Purchase Frequency */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Purchase Frequency</h3>
                    <div className="w-full aspect-square bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                      <div className="text-center p-4">
                        <LineChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Purchase frequency distribution</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart placeholder - Customer Lifetime Value */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Customer Lifetime Value</h3>
                    <div className="w-full aspect-square bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                      <div className="text-center p-4">
                        <BarChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">CLV by customer segment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Loyal Customers</h3>
                        <Badge>32%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Purchased 5+ times in the last year</p>
                    </div>
                    
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">New Customers</h3>
                        <Badge>28%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">First purchase in the last 30 days</p>
                    </div>
                    
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">At-Risk</h3>
                        <Badge>15%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">No purchase in 60+ days</p>
                    </div>
                    
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">High-Value</h3>
                        <Badge>8%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Average order value >$200</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    Create Targeted Campaign
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Avg. Customer Lifetime</p>
                      <p className="text-sm font-medium">14 months</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Avg. Customer Value</p>
                      <p className="text-sm font-medium">$342</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Repeat Purchase Rate</p>
                      <p className="text-sm font-medium">38%</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Churn Rate</p>
                      <p className="text-sm font-medium">12%</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Customer Acquisition Cost</p>
                      <p className="text-sm font-medium">$28</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Stock levels and product performance</CardDescription>
                  </div>
                  <Input placeholder="Search products..." className="max-w-xs" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Product</th>
                        <th className="text-left p-2 font-medium">Category</th>
                        <th className="text-right p-2 font-medium">In Stock</th>
                        <th className="text-right p-2 font-medium">Reorder Point</th>
                        <th className="text-right p-2 font-medium">Sales (30d)</th>
                        <th className="text-right p-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Product A</td>
                        <td className="p-2">Electronics</td>
                        <td className="p-2 text-right">45</td>
                        <td className="p-2 text-right">20</td>
                        <td className="p-2 text-right">78</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Product B</td>
                        <td className="p-2">Clothing</td>
                        <td className="p-2 text-right">12</td>
                        <td className="p-2 text-right">15</td>
                        <td className="p-2 text-right">34</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Product C</td>
                        <td className="p-2">Home</td>
                        <td className="p-2 text-right">0</td>
                        <td className="p-2 text-right">10</td>
                        <td className="p-2 text-right">22</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Out of Stock</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Product D</td>
                        <td className="p-2">Electronics</td>
                        <td className="p-2 text-right">87</td>
                        <td className="p-2 text-right">25</td>
                        <td className="p-2 text-right">12</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Overstocked</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Product E</td>
                        <td className="p-2">Accessories</td>
                        <td className="p-2 text-right">32</td>
                        <td className="p-2 text-right">20</td>
                        <td className="p-2 text-right">45</td>
                        <td className="p-2 text-right">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Pie chart placeholder */}
                  <div className="w-full aspect-square bg-muted/30 rounded-lg flex items-center justify-center border border-dashed mb-4">
                    <div className="text-center p-4">
                      <PieChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Inventory status distribution</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <p className="text-sm">Healthy</p>
                      </div>
                      <p className="text-sm font-medium">65%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <p className="text-sm">Low Stock</p>
                      </div>
                      <p className="text-sm font-medium">15%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <p className="text-sm">Out of Stock</p>
                      </div>
                      <p className="text-sm font-medium">8%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <p className="text-sm">Overstocked</p>
                      </div>
                      <p className="text-sm font-medium">12%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    Optimize Inventory
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 rounded-lg">
                      <p className="text-sm font-medium">Out of Stock (3 items)</p>
                      <p className="text-sm mt-1">Product C, Product F, Product H need to be restocked immediately.</p>
                    </div>
                    <div className="p-3 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 rounded-lg">
                      <p className="text-sm font-medium">Low Stock (5 items)</p>
                      <p className="text-sm mt-1">Product B, Product G and 3 other products are below reorder point.</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg">
                      <p className="text-sm font-medium">Slow Moving (4 items)</p>
                      <p className="text-sm mt-1">Product D and 3 other products have low sales velocity.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsWireframe;
