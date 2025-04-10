import React from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./card";
import { useEnhancedToast } from "./toast-enhanced";
import { useToast } from "./use-toast";

/**
 * Demo component to showcase the toast functionality
 */
export function ToastDemo() {
  const { toast } = useToast();
  const enhancedToast = useEnhancedToast();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Toast Notifications Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Basic Toasts</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Default Toast",
                  description: "This is a default toast notification",
                })
              }
            >
              Default
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Destructive Toast",
                  description: "This is a destructive toast notification",
                  variant: "destructive",
                })
              }
            >
              Destructive
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Enhanced Toasts</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="bg-green-500/10"
              onClick={() =>
                enhancedToast.success({
                  title: "Success",
                  description: "Operation completed successfully",
                })
              }
            >
              Success
            </Button>
            <Button
              variant="outline"
              className="bg-red-500/10"
              onClick={() =>
                enhancedToast.error({
                  title: "Error",
                  description: "An error occurred during the operation",
                })
              }
            >
              Error
            </Button>
            <Button
              variant="outline"
              className="bg-blue-500/10"
              onClick={() =>
                enhancedToast.info({
                  title: "Information",
                  description: "Here's some information for you",
                })
              }
            >
              Info
            </Button>
            <Button
              variant="outline"
              className="bg-yellow-500/10"
              onClick={() =>
                enhancedToast.warning({
                  title: "Warning",
                  description: "Please be careful with this action",
                })
              }
            >
              Warning
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">With Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                enhancedToast.info({
                  title: "New Feature",
                  description: "We've added a new feature you might like",
                  actionLabel: "View",
                  onAction: () => alert("Action clicked!"),
                  duration: 5000,
                })
              }
            >
              With Action
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                enhancedToast.warning({
                  title: "Session Expiring",
                  description: "Your session will expire in 5 minutes",
                  actionLabel: "Extend",
                  onAction: () => alert("Session extended!"),
                  duration: 0, // Won't auto-dismiss
                })
              }
            >
              Persistent
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Click the buttons above to see different toast notifications
      </CardFooter>
    </Card>
  );
}
