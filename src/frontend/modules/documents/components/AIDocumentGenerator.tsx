import React, { useState } from "react";
import { useAI } from "@/frontend/contexts/AIContext";
import { AIActionButton } from "@/frontend/modules/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Textarea } from "@/frontend/components/ui/textarea";
import { Input } from "@/frontend/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { Sparkles, FileText, Download, Copy, Check, FileDown } from "lucide-react";

interface AIDocumentGeneratorProps {}

const AIDocumentGenerator: React.FC<AIDocumentGeneratorProps> = () => {
  const { promptAIAssistant } = useAI();
  const [activeTab, setActiveTab] = useState("invoice");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [generatedDocument, setGeneratedDocument] = useState("");
  const [copied, setCopied] = useState(false);

  // Sample document templates
  const documentTemplates = {
    invoice: {
      title: "Invoice #INV-2023-001",
      content: `INVOICE

From: Your Company Name
To: [Client Name]
Invoice #: INV-2023-001
Date: ${new Date().toLocaleDateString()}
Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Description                   Quantity    Rate        Amount
----------------------------------------------------------------
Product/Service 1             1           $100.00     $100.00
Product/Service 2             2           $75.00      $150.00

Subtotal:                                             $250.00
Tax (10%):                                            $25.00
Total:                                                $275.00

Payment Terms: Net 30
Payment Methods: Bank Transfer, Credit Card

Thank you for your business!`,
    },
    proposal: {
      title: "Business Proposal - Project Name",
      content: `BUSINESS PROPOSAL

Prepared for: [Client Name]
Prepared by: Your Company Name
Date: ${new Date().toLocaleDateString()}

1. EXECUTIVE SUMMARY

This proposal is intended to outline the scope, goals, and expectations for the upcoming project.

Please review and let us know if you have any feedback.`,
},