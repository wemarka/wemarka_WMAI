import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface DocumentViewerProps {
  isRTL?: boolean;
  documentId?: string;
}

const DocumentViewer = ({
  isRTL = false,
  documentId = "1",
}: DocumentViewerProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "عارض المستندات" : "Document Viewer"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "عرض المستند" : "View Document"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض محتوى المستند" : "View document content"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "تحرير المستند" : "Edit Document"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تحرير محتوى المستند" : "Edit document content"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "مشاركة المستند" : "Share Document"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "مشاركة المستند مع الآخرين"
                : "Share document with others"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentViewer;
