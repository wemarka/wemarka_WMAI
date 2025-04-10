import React, { useState } from "react";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/frontend/components/ui/collapsible";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { TestResult } from "@/frontend/services/testService";

interface TestResultItemProps {
  result: TestResult;
  isRTL?: boolean;
}

const TestResultItem: React.FC<TestResultItemProps> = ({
  result,
  isRTL = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="border rounded-md mb-2 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-muted/30">
        <div className="flex items-center">
          {result.status === "pass" ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 rtl:ml-2 rtl:mr-0" />
          ) : result.status === "running" ? (
            <Clock className="h-5 w-5 text-blue-500 animate-pulse mr-2 rtl:ml-2 rtl:mr-0" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mr-2 rtl:ml-2 rtl:mr-0" />
          )}
          <div>
            <h4 className="font-medium">{result.testName}</h4>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-2 rtl:ml-2 rtl:mr-0">
                {formatDuration(result.duration)}
              </span>
              <span>{formatTimestamp(result.timestamp)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Badge
            variant={result.status === "pass" ? "outline" : "destructive"}
            className={
              result.status === "pass"
                ? "bg-green-100 text-green-800 border-green-200"
                : ""
            }
          >
            {result.status === "pass"
              ? isRTL
                ? "نجاح"
                : "Pass"
              : result.status === "running"
                ? isRTL
                  ? "جاري التنفيذ"
                  : "Running"
                : isRTL
                  ? "فشل"
                  : "Fail"}
          </Badge>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 rtl:mr-2 rtl:ml-0"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>

      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <div className="p-3 border-t bg-muted/10">
            {result.error && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-red-500 mb-1">
                  {isRTL ? "خطأ:" : "Error:"}
                </h5>
                <div className="bg-red-50 text-red-800 p-2 rounded text-sm font-mono">
                  {result.error}
                </div>
              </div>
            )}

            <h5 className="text-sm font-medium mb-1">
              {isRTL ? "سجلات:" : "Logs:"}
            </h5>
            <ScrollArea className="h-[200px] rounded border bg-muted/20 p-2">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {result.logs.join("\n")}
              </pre>
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TestResultItem;
