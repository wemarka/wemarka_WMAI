import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";

interface GuideSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface GettingStartedProps {
  searchQuery?: string;
}

const GettingStarted: React.FC<GettingStartedProps> = ({
  searchQuery = "",
}) => {
  const [activeSection, setActiveSection] = useState("overview");

  // Define the guide sections
  const guideSections: Record<string, GuideSection> = {
    overview: {
      id: "overview",
      title: "Overview",
      content: (
        <div className="space-y-4">
          <p>
            Welcome to Wemarka WMAI, your unified business operating system.
            This platform integrates all your business operations into one
            seamless experience, powered by AI assistance.
          </p>
          <p>
            This getting started guide will help you navigate the platform and
            make the most of its features. Use the tabs below to explore
            different aspects of the system.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>AI-powered business automation</li>
                  <li>Integrated store management</li>
                  <li>Smart accounting system</li>
                  <li>Unified marketing hub</li>
                  <li>Centralized customer service</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Store Dashboard</li>
                  <li>Marketing Campaigns</li>
                  <li>Customer Management</li>
                  <li>Analytics Reports</li>
                  <li>System Settings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    setup: {
      id: "setup",
      title: "Initial Setup",
      content: (
        <div className="space-y-4">
          <p>
            Follow these steps to set up your Wemarka WMAI account and start
            using the platform:
          </p>
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <strong>Complete your profile</strong>
              <p>
                Navigate to Settings &gt; User Profile and fill in your business
                details.
              </p>
            </li>
            <li>
              <strong>Connect your store</strong>
              <p>
                Go to Store &gt; Settings and configure your store details,
                including payment methods and shipping options.
              </p>
            </li>
            <li>
              <strong>Set up integrations</strong>
              <p>
                Visit the Integrations hub to connect your existing tools and
                services.
              </p>
            </li>
            <li>
              <strong>Configure AI assistant</strong>
              <p>
                Customize your AI assistant preferences in Settings &gt; AI
                Assistant.
              </p>
            </li>
          </ol>
        </div>
      ),
    },
    modules: {
      id: "modules",
      title: "Core Modules",
      content: (
        <div className="space-y-6">
          <p>
            Wemarka WMAI consists of several integrated modules, each handling a
            specific aspect of your business:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Manage products, inventory, orders, and your online
                  storefront.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Accounting</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Handle invoices, expenses, purchase orders, and financial
                  reports.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Create and manage campaigns, content, and track performance.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customer Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Manage customer inquiries across multiple channels in one
                  place.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  };

  // Filter sections based on search query
  const filteredSections = Object.values(guideSections).filter((section) => {
    if (!searchQuery) return true;

    const sectionContent = section.content?.toString().toLowerCase() || "";
    const sectionTitle = section.title.toLowerCase();

    return (
      sectionTitle.includes(searchQuery.toLowerCase()) ||
      sectionContent.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Getting Started with Wemarka WMAI
        </h2>
        <p className="text-muted-foreground">
          Learn how to use the platform and make the most of its features
        </p>
      </div>

      {filteredSections.length === 0 ? (
        <Card className="p-6 text-center">
          <p>No guide sections found matching your search criteria.</p>
        </Card>
      ) : (
        <Tabs
          value={activeSection}
          onValueChange={setActiveSection}
          className="w-full"
        >
          <TabsList className="mb-6">
            {filteredSections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredSections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              {section.content}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default GettingStarted;
