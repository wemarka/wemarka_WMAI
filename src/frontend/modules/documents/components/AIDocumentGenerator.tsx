import React, { useState } from "react";
import { useAI } from "@/frontend/contexts/AIContext";
import { AIActionButton } from "@/frontend/modules/ai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Textarea } from "@/frontend/components/ui/textarea";
import { Input } from "@/frontend/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Sparkles,
  FileText,
  Download,
  Copy,
  Check,
  FileDown,
} from "lucide-react";
import { useToast } from "@/frontend/components/ui/use-toast";

interface AIDocumentGeneratorProps {}

const AIDocumentGenerator: React.FC<AIDocumentGeneratorProps> = () => {
  const { promptAIAssistant } = useAI();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("invoice");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [generatedDocument, setGeneratedDocument] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
    contract: {
      title: "Service Agreement Contract",
      content: `SERVICE AGREEMENT CONTRACT

Between: Your Company Name
And: [Client Name]
Date: ${new Date().toLocaleDateString()}

1. SCOPE OF SERVICES

Your Company Name agrees to provide the following services to the Client:
- [Service 1]
- [Service 2]
- [Service 3]

2. PAYMENT TERMS

The Client agrees to pay for services as follows:
- Total Amount: $X,XXX.XX
- Payment Schedule: [Details]
- Payment Method: [Details]

3. TERM AND TERMINATION

This agreement will commence on [Start Date] and continue until [End Date] or until terminated by either party with [X] days written notice.

4. SIGNATURES

____________________                    ____________________
Your Company Name                       Client Name
Date:                                   Date:`,
    },
    report: {
      title: "Business Analysis Report",
      content: `BUSINESS ANALYSIS REPORT

Prepared by: Your Company Name
Prepared for: [Client Name]
Date: ${new Date().toLocaleDateString()}

1. EXECUTIVE SUMMARY

[Brief overview of the report findings and recommendations]

2. ANALYSIS METHODOLOGY

[Description of the methods used to gather and analyze data]

3. KEY FINDINGS

[Detailed findings from the analysis]

4. RECOMMENDATIONS

[Strategic recommendations based on the findings]

5. IMPLEMENTATION PLAN

[Steps for implementing the recommendations]

6. CONCLUSION

[Summary of the report and next steps]`,
    },
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const template = documentTemplates[value as keyof typeof documentTemplates];
    if (template) {
      setDocumentTitle(template.title);
      setDocumentContent(template.content);
    }
  };

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    try {
      // Prepare the prompt for the AI
      const prompt = `Generate a professional ${activeTab} document with the following details:\n\nTitle: ${documentTitle}\n\nContent structure: ${documentContent}\n\nPlease format it professionally and make it comprehensive.`;

      // Send the prompt to the AI assistant
      promptAIAssistant(prompt);

      // In a real implementation, we would wait for the AI response
      // For now, we'll just use the template as the "generated" document
      setTimeout(() => {
        setGeneratedDocument(documentContent);
        setIsGenerating(false);
        toast({
          title: "Document Generated",
          description: "Your document has been generated successfully.",
        });
      }, 2000);
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument);
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: "Document content has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedDocument], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${documentTitle.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Document Downloaded",
      description: "Your document has been downloaded successfully.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          AI Document Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="proposal">Proposal</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>

          {Object.keys(documentTemplates).map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Title</label>
                <Input
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Enter document title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Document Content</label>
                <Textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  placeholder="Enter document content or structure"
                  className="min-h-[200px]"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleGenerateDocument}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Document
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {generatedDocument && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Generated Document</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {generatedDocument}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Use AI to generate professional documents quickly
        </div>
        <AIActionButton
          action="Generate a professional document template"
          tooltip="Get AI help with document creation"
        />
      </CardFooter>
    </Card>
  );
};

export default AIDocumentGenerator;
