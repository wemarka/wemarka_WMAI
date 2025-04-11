import React, { useState } from "react";
import { cn } from "@/frontend/lib/utils";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Grip, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface WidgetGridProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  titleAr?: string;
  editable?: boolean;
}

interface WidgetProps {
  title: string;
  titleAr?: string;
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
  onExpand?: () => void;
  expanded?: boolean;
  draggable?: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
  title,
  titleAr,
  children,
  className,
  onRemove,
  onExpand,
  expanded = false,
  draggable = false,
}) => {
  const { direction } = useLanguage();
  const rtl = direction === "rtl";

  return (
    <Card
      className={cn(
        "overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200",
        expanded ? "col-span-full row-span-2" : "",
        className,
      )}
    >
      <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center">
          {draggable && (
            <Grip className="h-4 w-4 text-muted-foreground mr-2 cursor-move" />
          )}
          <CardTitle className="text-base">
            {rtl && titleAr ? titleAr : title}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-1">
          {onExpand && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onExpand}
              className="h-6 w-6 rounded-full hover:bg-muted"
            >
              {expanded ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRemove}
              className="h-6 w-6 rounded-full hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
};

const WidgetGrid = ({
  children,
  className,
  title,
  titleAr,
  editable = false,
}: WidgetGridProps) => {
  const { direction } = useLanguage();
  const rtl = direction === "rtl";
  const [expandedWidget, setExpandedWidget] = useState<number | null>(null);

  const handleExpand = (index: number) => {
    setExpandedWidget(expandedWidget === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {(title || titleAr) && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {rtl && titleAr ? titleAr : title}
          </h2>
          {editable && (
            <Button variant="outline" size="sm">
              {rtl ? "تخصيص" : "Customize"}
            </Button>
          )}
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className,
        )}
      >
        {children || (
          <>
            <Widget
              title="Sales Overview"
              titleAr="نظرة عامة على المبيعات"
              onExpand={() => handleExpand(0)}
              expanded={expandedWidget === 0}
              draggable={editable}
            >
              <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
                <p className="text-muted-foreground">
                  {rtl
                    ? "سيظهر مخطط المبيعات هنا"
                    : "Sales chart will appear here"}
                </p>
              </div>
            </Widget>

            <Widget
              title="Recent Orders"
              titleAr="الطلبات الأخيرة"
              onExpand={() => handleExpand(1)}
              expanded={expandedWidget === 1}
              draggable={editable}
            >
              <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
                <p className="text-muted-foreground">
                  {rtl
                    ? "ستظهر قائمة الطلبات هنا"
                    : "Orders list will appear here"}
                </p>
              </div>
            </Widget>

            <Widget
              title="Inventory Status"
              titleAr="حالة المخزون"
              onExpand={() => handleExpand(2)}
              expanded={expandedWidget === 2}
              draggable={editable}
            >
              <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
                <p className="text-muted-foreground">
                  {rtl
                    ? "ستظهر حالة المخزون هنا"
                    : "Inventory status will appear here"}
                </p>
              </div>
            </Widget>

            <Widget
              title="Marketing Performance"
              titleAr="أداء التسويق"
              onExpand={() => handleExpand(3)}
              expanded={expandedWidget === 3}
              draggable={editable}
            >
              <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
                <p className="text-muted-foreground">
                  {rtl
                    ? "ستظهر مقاييس التسويق هنا"
                    : "Marketing metrics will appear here"}
                </p>
              </div>
            </Widget>

            <Widget
              title="Recent Messages"
              titleAr="الرسائل الأخيرة"
              onExpand={() => handleExpand(4)}
              expanded={expandedWidget === 4}
              draggable={editable}
            >
              <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
                <p className="text-muted-foreground">
                  {rtl ? "ستظهر الرسائل هنا" : "Messages will appear here"}
                </p>
              </div>
            </Widget>

            <Widget
              title="Financial Summary"
              titleAr="ملخص مالي"
              onExpand={() => handleExpand(5)}
              expanded={expandedWidget === 5}
              draggable={editable}
            >
              <div className="h-40 flex items-center justify-center bg-muted/30 rounded">
                <p className="text-muted-foreground">
                  {rtl
                    ? "ستظهر البيانات المالية هنا"
                    : "Financial data will appear here"}
                </p>
              </div>
            </Widget>
          </>
        )}
      </div>
    </div>
  );
};

export default WidgetGrid;
