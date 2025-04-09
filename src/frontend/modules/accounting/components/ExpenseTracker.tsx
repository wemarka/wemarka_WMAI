import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface ExpenseTrackerProps {
  isRTL?: boolean;
}

const ExpenseTracker = ({ isRTL = false }: ExpenseTrackerProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "تتبع المصروفات" : "Expense Tracker"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "جميع المصروفات" : "All Expenses"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض جميع المصروفات" : "View all expenses"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "إضافة مصروف" : "Add Expense"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إضافة مصروف جديد" : "Add a new expense"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "فئات المصروفات" : "Expense Categories"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة فئات المصروفات" : "Manage expense categories"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseTracker;
