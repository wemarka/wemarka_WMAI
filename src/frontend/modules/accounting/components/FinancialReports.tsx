import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Select } from "@/frontend/components/ui/select";
import {
  Calendar,
  Download,
  FileText,
  BarChart,
  LineChart,
  PieChart,
} from "lucide-react";

interface FinancialReportsProps {
  isRTL?: boolean;
}

const FinancialReports = ({ isRTL = false }: FinancialReportsProps) => {
  const [activeReport, setActiveReport] = useState<
    "profit-loss" | "cash-flow" | "balance-sheet"
  >("profit-loss");

  // Mock financial data
  const financialSummary = {
    revenue: 125000,
    expenses: 78500,
    profit: 46500,
    profitMargin: 37.2,
    cashBalance: 85000,
    accountsReceivable: 32000,
    accountsPayable: 18500,
    totalAssets: 450000,
    totalLiabilities: 175000,
    equity: 275000,
  };

  return (
    <div className="space-y-6 bg-background p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isRTL ? "التقارير المالية" : "Financial Reports"}
        </h1>
        <div className="flex items-center space-x-2">
          <Select>
            <option value="current-month">
              {isRTL ? "الشهر الحالي" : "Current Month"}
            </option>
            <option value="last-month">
              {isRTL ? "الشهر الماضي" : "Last Month"}
            </option>
            <option value="current-quarter">
              {isRTL ? "الربع الحالي" : "Current Quarter"}
            </option>
            <option value="year-to-date">
              {isRTL ? "السنة حتى تاريخه" : "Year to Date"}
            </option>
            <option value="last-year">
              {isRTL ? "السنة الماضية" : "Last Year"}
            </option>
            <option value="custom">{isRTL ? "مخصص" : "Custom"}</option>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="profit-loss"
        className="w-full"
        onValueChange={(value) => setActiveReport(value as any)}
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="profit-loss">
            {isRTL ? "الأرباح والخسائر" : "Profit & Loss"}
          </TabsTrigger>
          <TabsTrigger value="cash-flow">
            {isRTL ? "التدفق النقدي" : "Cash Flow"}
          </TabsTrigger>
          <TabsTrigger value="balance-sheet">
            {isRTL ? "الميزانية العمومية" : "Balance Sheet"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profit-loss" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? "الإيرادات" : "Revenue"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${financialSummary.revenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? "المصروفات" : "Expenses"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${financialSummary.expenses.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? "صافي الربح" : "Net Profit"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${financialSummary.profit.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? "هامش الربح" : "Profit Margin"}:{" "}
                  {financialSummary.profitMargin}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "تحليل الأرباح والخسائر" : "Profit & Loss Analysis"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center text-muted-foreground">
                <BarChart className="h-16 w-16 mb-4" />
                <p>
                  {isRTL ? "رسم بياني للأرباح والخسائر" : "Profit & Loss Chart"}
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-between">
              <Button variant="outline" size="sm">
                {isRTL ? "تصدير البيانات" : "Export Data"}
              </Button>
              <Button variant="outline" size="sm">
                {isRTL ? "عرض التفاصيل" : "View Details"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? "الرصيد النقدي" : "Cash Balance"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${financialSummary.cashBalance.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? "الذمم المدينة" : "Accounts Receivable"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${financialSummary.accountsReceivable.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? "الذمم الدائنة" : "Accounts Payable"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${financialSummary.accountsPayable.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "تحليل التدفق النقدي" : "Cash Flow Analysis"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center text-muted-foreground">
                <LineChart className="h-16 w-16 mb-4" />
                <p>{isRTL ? "رسم بياني للتدفق النقدي" : "Cash Flow Chart"}</p>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-between">
              <Button variant="outline" size="sm">
                {isRTL ? "تصدير البيانات" : "Export Data"}
              </Button>
              <Button variant="outline" size="sm">
                {isRTL ? "عرض التفاصيل" : "View Details"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? "إجمالي الأصول" : "Total Assets"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${financialSummary.totalAssets.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? "إجمالي الخصوم" : "Total Liabilities"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${financialSummary.totalLiabilities.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? "حقوق الملكية" : "Equity"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${financialSummary.equity.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "تحليل الميزانية العمومية" : "Balance Sheet Analysis"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center text-muted-foreground">
                <PieChart className="h-16 w-16 mb-4" />
                <p>
                  {isRTL
                    ? "رسم بياني للميزانية العمومية"
                    : "Balance Sheet Chart"}
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-between">
              <Button variant="outline" size="sm">
                {isRTL ? "تصدير البيانات" : "Export Data"}
              </Button>
              <Button variant="outline" size="sm">
                {isRTL ? "عرض التفاصيل" : "View Details"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReports;
