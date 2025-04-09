import React from "react";
import { cn } from "@/frontend/lib/utils";

interface WidgetGridProps {
  children?: React.ReactNode;
  className?: string;
}

const WidgetGrid = ({ children, className }: WidgetGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className,
      )}
    >
      {children || (
        <>
          <div className="bg-card rounded-lg shadow-subtle p-6 border">
            <h3 className="text-lg font-medium mb-2">Sales Overview</h3>
            <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
              <p className="text-muted-foreground">
                Sales chart will appear here
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-subtle p-6 border">
            <h3 className="text-lg font-medium mb-2">Recent Orders</h3>
            <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
              <p className="text-muted-foreground">
                Orders list will appear here
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-subtle p-6 border">
            <h3 className="text-lg font-medium mb-2">Inventory Status</h3>
            <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
              <p className="text-muted-foreground">
                Inventory status will appear here
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-subtle p-6 border">
            <h3 className="text-lg font-medium mb-2">Marketing Performance</h3>
            <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
              <p className="text-muted-foreground">
                Marketing metrics will appear here
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-subtle p-6 border">
            <h3 className="text-lg font-medium mb-2">Recent Messages</h3>
            <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
              <p className="text-muted-foreground">Messages will appear here</p>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-subtle p-6 border">
            <h3 className="text-lg font-medium mb-2">Financial Summary</h3>
            <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
              <p className="text-muted-foreground">
                Financial data will appear here
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WidgetGrid;
