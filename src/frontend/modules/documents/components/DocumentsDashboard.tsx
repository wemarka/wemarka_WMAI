import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface DocumentsDashboardProps {
  isRTL?: boolean;
}

const DocumentsDashboard = ({ isRTL = false }: DocumentsDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "قائمة المستندات" : "Document List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL ? "عرض وإدارة المستندات" : "View and manage documents"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "عارض المستندات" : "Document Viewer"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL ? "عرض وتحرير المستندات" : "View and edit documents"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? "قوالب المستندات" : "Document Templates"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL ? "إدارة قوالب المستندات" : "Manage document templates"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsDashboard;
