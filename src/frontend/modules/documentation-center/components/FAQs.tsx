import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/frontend/components/ui/card";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQsProps {
  searchQuery?: string;
}

const FAQs: React.FC<FAQsProps> = ({ searchQuery = "" }) => {
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>([]);

  // Sample FAQ data - in a real app, this would come from an API or database
  const faqData: FAQItem[] = [
    {
      id: "1",
      question: "How do I create a new product in the store?",
      answer:
        'Navigate to Store > Products and click the "Add Product" button. Fill in the required fields and click "Save".',
      category: "Store",
    },
    {
      id: "2",
      question: "How can I generate marketing content with AI?",
      answer:
        'Go to Marketing > Content Creator and click "Generate with AI". Enter your product details and target audience, then click "Generate".',
      category: "Marketing",
    },
    {
      id: "3",
      question: "How do I connect payment gateways?",
      answer:
        "Navigate to Integrations > Payment Gateways and select the gateway you want to connect. Follow the on-screen instructions to complete the integration.",
      category: "Integrations",
    },
    {
      id: "4",
      question: "How can I track my sales performance?",
      answer:
        "Go to Analytics > Sales Trends to view detailed reports on your sales performance over time.",
      category: "Analytics",
    },
    {
      id: "5",
      question: "How do I manage user roles and permissions?",
      answer:
        "Navigate to Settings > User Management to create and manage roles with specific permissions for your team members.",
      category: "Settings",
    },
    {
      id: "6",
      question: "Can I customize my storefront design?",
      answer:
        "Yes, go to Storefront > Home Editor to customize your storefront design using the drag-and-drop interface.",
      category: "Storefront",
    },
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFAQs(faqData);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = faqData.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.category.toLowerCase().includes(query),
      );
      setFilteredFAQs(filtered);
    }
  }, [searchQuery]);

  // Group FAQs by category
  const groupedFAQs: Record<string, FAQItem[]> = {};
  filteredFAQs.forEach((faq) => {
    if (!groupedFAQs[faq.category]) {
      groupedFAQs[faq.category] = [];
    }
    groupedFAQs[faq.category].push(faq);
  });

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Find answers to common questions about using Wemarka WMAI
        </p>
      </div>

      {Object.keys(groupedFAQs).length === 0 ? (
        <Card className="p-6 text-center">
          <p>No FAQs found matching your search criteria.</p>
        </Card>
      ) : (
        Object.entries(groupedFAQs).map(([category, faqs]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-muted/50 rounded-md">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))
      )}
    </div>
  );
};

export default FAQs;
