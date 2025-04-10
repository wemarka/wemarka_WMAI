import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Textarea } from "@/frontend/components/ui/textarea";
import { Avatar } from "@/frontend/components/ui/avatar";
import { Badge } from "@/frontend/components/ui/badge";
import {
  MessageCircle,
  Zap,
  Settings,
  History,
  Sparkles,
  Send,
  Mic,
  Image,
  FileText,
} from "lucide-react";

const AIAssistantWireframe = () => {
  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Assistant (WMAI)</h1>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Main AI Chat Area - Takes up most of the space */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="automate">Automate</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Ask me anything about your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {/* Chat messages */}
                  <div className="flex items-start gap-3 text-sm">
                    <Avatar className="h-8 w-8 mt-1">
                      <div className="bg-primary text-white flex items-center justify-center h-full w-full rounded-full">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg">
                      <p>
                        Hello! I'm your AI assistant. How can I help you today
                        with your business operations?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                      <p>Can you help me analyze my recent sales data?</p>
                    </div>
                    <Avatar className="h-8 w-8 mt-1">
                      <div className="bg-secondary flex items-center justify-center h-full w-full rounded-full">
                        U
                      </div>
                    </Avatar>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Avatar className="h-8 w-8 mt-1">
                      <div className="bg-primary text-white flex items-center justify-center h-full w-full rounded-full">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg">
                      <p>
                        I'd be happy to help analyze your sales data. I can
                        identify trends, compare performance to previous
                        periods, and suggest optimization strategies. Would you
                        like me to:
                      </p>
                      <ul className="list-disc pl-5 mt-2">
                        <li>Generate a quick summary of recent sales</li>
                        <li>Perform a detailed analysis with visualizations</li>
                        <li>Compare against industry benchmarks</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex w-full items-center space-x-2">
                    <Button variant="outline" size="icon">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="generate" className="flex-1">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Content Generator</CardTitle>
                  <CardDescription>
                    Create marketing content, reports, and more
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        What would you like to generate?
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <Button variant="outline" className="justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Report
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Social Post
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Image className="mr-2 h-4 w-4" />
                          Image
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <Textarea
                        placeholder="Describe what you want to generate..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="pt-4">
                      <Button className="w-full">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Content
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analyze" className="flex-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Data Analysis</CardTitle>
                  <CardDescription>
                    Get insights from your business data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Sales Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            <Zap className="mr-2 h-4 w-4" />
                            Analyze Sales
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Customer Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            <Zap className="mr-2 h-4 w-4" />
                            Analyze Customers
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Marketing Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            <Zap className="mr-2 h-4 w-4" />
                            Analyze Marketing
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Financial Health
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            <Zap className="mr-2 h-4 w-4" />
                            Analyze Finances
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="automate" className="flex-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Task Automation</CardTitle>
                  <CardDescription>Set up automated workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <Card className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm">
                              Order Processing
                            </CardTitle>
                            <Badge>Active</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p>
                            Automatically send confirmation emails when new
                            orders are received
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm">
                              Inventory Alerts
                            </CardTitle>
                            <Badge>Active</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p>
                            Send notifications when product inventory falls
                            below threshold
                          </p>
                        </CardContent>
                      </Card>

                      <Button className="mt-4">
                        <Zap className="mr-2 h-4 w-4" />
                        Create New Automation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar with context and history */}
        <div className="lg:col-span-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Context</CardTitle>
                <CardDescription>Current module: Store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active products:</span>
                    <span className="font-medium">128</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Recent orders:</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Low inventory items:</span>
                    <span className="font-medium text-red-500">7</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Zap className="mr-2 h-3 w-3" />
                  Suggest Actions
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2"
                  >
                    <History className="mr-2 h-3 w-3" />
                    <div className="text-left">
                      <p>Marketing campaign analysis</p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2"
                  >
                    <History className="mr-2 h-3 w-3" />
                    <div className="text-left">
                      <p>Inventory optimization</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2"
                  >
                    <History className="mr-2 h-3 w-3" />
                    <div className="text-left">
                      <p>Customer feedback analysis</p>
                      <p className="text-xs text-muted-foreground">
                        3 days ago
                      </p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantWireframe;
