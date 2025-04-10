import {
  BarChart,
  PieChart,
  LineChart,
  Download,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AccountingWireframe() {
  return (
    <div className="w-full min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          Accounting Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <select className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-auto">
              <option>Last 30 days</option>
              <option>This month</option>
              <option>Last quarter</option>
              <option>This year</option>
              <option>Custom range</option>
            </select>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Total Revenue",
            value: "$24,345.00",
            change: "+12.5%",
            up: true,
          },
          {
            title: "Total Expenses",
            value: "$12,680.00",
            change: "+5.2%",
            up: true,
          },
          {
            title: "Net Profit",
            value: "$11,665.00",
            change: "+18.3%",
            up: true,
          },
          {
            title: "Pending Invoices",
            value: "$4,120.00",
            change: "-8.4%",
            up: false,
          },
        ].map((metric, i) => (
          <div key={i} className="bg-white border rounded-lg p-4 shadow-subtle">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
              </div>
              <div
                className={`flex items-center ${metric.up ? "text-success" : "text-destructive"}`}
              >
                {metric.up ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span className="text-sm font-medium ml-1">
                  {metric.change}
                </span>
              </div>
            </div>
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${metric.up ? "bg-success" : "bg-destructive"}`}
                style={{ width: `${Math.abs(parseFloat(metric.change))}0%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white border rounded-lg p-4 shadow-subtle lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Revenue & Expenses</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-xs text-muted-foreground">Expenses</span>
              </div>
              <button className="p-1 rounded-md hover:bg-muted">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border-t pt-4">
            <LineChart className="h-full w-full text-muted-foreground opacity-20" />
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white border rounded-lg p-4 shadow-subtle">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Expense Breakdown</h2>
            <button className="p-1 rounded-md hover:bg-muted">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="h-48 flex items-center justify-center mb-4">
            <PieChart className="h-full w-full text-muted-foreground opacity-20" />
          </div>
          <div className="space-y-2">
            {[
              { category: "Operations", amount: "$5,240.00", percentage: 42 },
              { category: "Marketing", amount: "$3,120.00", percentage: 25 },
              { category: "Salaries", amount: "$2,860.00", percentage: 22 },
              { category: "Other", amount: "$1,460.00", percentage: 11 },
            ].map((expense, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: [
                        `#4f46e5`,
                        `#ec4899`,
                        `#f59e0b`,
                        `#6b7280`,
                      ][i],
                    }}
                  ></div>
                  <span className="text-sm">{expense.category}</span>
                </div>
                <div className="text-sm font-medium">{expense.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border rounded-lg shadow-subtle overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Recent Transactions</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-8 pr-4 py-1.5 text-sm border rounded-md w-full md:w-auto"
              />
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            </div>
            <button className="p-1.5 border rounded-md hover:bg-muted">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Reference
                </th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  date: "2023-06-15",
                  desc: "Client Payment - ABC Corp",
                  category: "Income",
                  ref: "INV-2023-056",
                  amount: "$2,450.00",
                  status: "Completed",
                  isIncome: true,
                },
                {
                  date: "2023-06-14",
                  desc: "Office Supplies",
                  category: "Expense",
                  ref: "PO-2023-112",
                  amount: "$345.50",
                  status: "Completed",
                  isIncome: false,
                },
                {
                  date: "2023-06-12",
                  desc: "Software Subscription",
                  category: "Expense",
                  ref: "SUB-2023-089",
                  amount: "$79.99",
                  status: "Completed",
                  isIncome: false,
                },
                {
                  date: "2023-06-10",
                  desc: "Client Payment - XYZ Ltd",
                  category: "Income",
                  ref: "INV-2023-055",
                  amount: "$1,850.00",
                  status: "Completed",
                  isIncome: true,
                },
                {
                  date: "2023-06-08",
                  desc: "Marketing Campaign",
                  category: "Expense",
                  ref: "PO-2023-111",
                  amount: "$750.00",
                  status: "Pending",
                  isIncome: false,
                },
              ].map((tx, i) => (
                <tr
                  key={i}
                  className="border-b last:border-b-0 hover:bg-muted/20"
                >
                  <td className="p-3 text-sm">{tx.date}</td>
                  <td className="p-3 text-sm font-medium">{tx.desc}</td>
                  <td className="p-3 text-sm">{tx.category}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {tx.ref}
                  </td>
                  <td
                    className={`p-3 text-sm font-medium text-right ${tx.isIncome ? "text-success" : "text-destructive"}`}
                  >
                    {tx.isIncome ? "+" : "-"}
                    {tx.amount}
                  </td>
                  <td className="p-3 text-sm text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${tx.status === "Completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing 5 of 24 transactions
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing import for Search component
function Search(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
