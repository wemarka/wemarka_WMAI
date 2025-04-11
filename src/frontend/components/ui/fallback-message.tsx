import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { AlertTriangle, Database } from "lucide-react";
import { Button } from "./button";

interface FallbackMessageProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function FallbackMessage({
  title = "Data Unavailable",
  message = "The requested data could not be loaded. This might be due to a connection issue or missing database tables.",
  icon = <Database className="h-12 w-12 text-muted-foreground opacity-50" />,
  action,
}: FallbackMessageProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          {icon}
          <p className="mt-4 max-w-md text-muted-foreground">{message}</p>
          {action && (
            <Button className="mt-4" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
