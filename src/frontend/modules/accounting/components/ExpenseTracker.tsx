import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Select } from "@/frontend/components/ui/select";
import { PlusCircle, Filter, Download, BarChart3 } from "lucide-react";

interface ExpenseTrackerProps {
  isRTL?: boolean;
}

const ExpenseTracker = ({ isRTL = false }: ExpenseTrackerProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "add" | "categories">(
    "all",
  );

  // Mock data for demonstration
  const recentExpenses = [
    {
      id: 1,
      name: "Office Supplies",
      amount: 250,
      date: "2023-05-15",
      category: "Office",
    },
    {
      id: 2,
      name: "Software Subscription",
      amount: 99,
      date: "2023-05-10",
      category: "Software",
    },
    {
      id: 3,
      name: "Client Lunch",
      amount: 85,
      date: "2023-05-08",
      category: "Meals",
    },
  ];

  const expenseCategories = [
    { id: 1, name: isRTL ? "مكتب" : "Office", count: 12 },
    { id: 2, name: isRTL ? "برمجيات" : "Software", count: 8 },
    { id: 3, name: isRTL ? "وجبات" : "Meals", count: 15 },
    { id: 4, name: isRTL ? "سفر" : "Travel", count: 6 },
    { id: 5, name: isRTL ? "تسويق" : "Marketing", count: 10 },
  ];

  return (
    <div className="space-y-6 bg-background p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isRTL ? "تتبع المصروفات" : "Expense Tracker"}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {isRTL ? "تصفية" : "Filter"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isRTL ? "تصدير" : "Export"}
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            {isRTL ? "تقرير" : "Report"}
          </Button>
        </div>
      </div>

      <div className="flex space-x-2 border-b pb-2">
        <Button
          variant={activeTab === "all" ? "default" : "ghost"}
          onClick={() => setActiveTab("all")}
        >
          {isRTL ? "جميع المصروفات" : "All Expenses"}
        </Button>
        <Button
          variant={activeTab === "add" ? "default" : "ghost"}
          onClick={() => setActiveTab("add")}
        >
          {isRTL ? "إضافة مصروف" : "Add Expense"}
        </Button>
        <Button
          variant={activeTab === "categories" ? "default" : "ghost"}
          onClick={() => setActiveTab("categories")}
        >
          {isRTL ? "فئات المصروفات" : "Expense Categories"}
        </Button>
      </div>

      {activeTab === "all" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {isRTL ? "المصروفات الأخيرة" : "Recent Expenses"}
            </h2>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              {isRTL ? "إضافة مصروف" : "Add Expense"}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recentExpenses.map((expense) => (
              <Card key={expense.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">{expense.name}</CardTitle>
                    <span className="font-bold">${expense.amount}</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{expense.category}</span>
                    <span>{expense.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "إضافة مصروف جديد" : "Add New Expense"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{isRTL ? "الاسم" : "Name"}</Label>
                <Input
                  id="name"
                  placeholder={isRTL ? "اسم المصروف" : "Expense name"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{isRTL ? "المبلغ" : "Amount"}</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">{isRTL ? "التاريخ" : "Date"}</Label>
                <Input id="date" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{isRTL ? "الفئة" : "Category"}</Label>
                <Select>
                  <option value="">
                    {isRTL ? "اختر فئة" : "Select a category"}
                  </option>
                  {expenseCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{isRTL ? "ملاحظات" : "Notes"}</Label>
                <Input
                  id="notes"
                  placeholder={isRTL ? "ملاحظات اختيارية" : "Optional notes"}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              {isRTL ? "حفظ المصروف" : "Save Expense"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {isRTL ? "فئات المصروفات" : "Expense Categories"}
            </h2>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              {isRTL ? "إضافة فئة" : "Add Category"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {isRTL
                      ? `${category.count} مصروفات`
                      : `${category.count} expenses`}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
