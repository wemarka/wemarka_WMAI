import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  User,
  Phone,
  Mail,
  Plus,
  Send,
} from "lucide-react";

export default function CustomerServiceWireframe() {
  return (
    <div className="w-full h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Agent Sidebar */}
      <div className="w-full md:w-64 border-r bg-card flex-shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Support Agents</h2>
        </div>
        <div className="p-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md"
            />
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {[
              { name: "Alex Johnson", status: "Online", tickets: 3 },
              { name: "Sarah Miller", status: "Online", tickets: 5 },
              { name: "David Chen", status: "Away", tickets: 2 },
              { name: "Emma Wilson", status: "Offline", tickets: 0 },
              { name: "Michael Brown", status: "Online", tickets: 4 },
            ].map((agent, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-2 rounded-md ${i === 0 ? "bg-primary/10" : "hover:bg-muted"}`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <div className="flex items-center">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${agent.status === "Online" ? "bg-success" : agent.status === "Away" ? "bg-warning" : "bg-muted-foreground"}`}
                      ></div>
                      <p className="text-xs text-muted-foreground">
                        {agent.status}
                      </p>
                    </div>
                  </div>
                </div>
                {agent.tickets > 0 && (
                  <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                    {agent.tickets}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto p-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Your Account</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <button className="p-1 rounded-md hover:bg-muted">
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="w-full md:w-80 border-r flex-shrink-0 flex flex-col max-h-screen">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Tickets</h2>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-muted">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="p-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md"
            />
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
            <button className="px-2.5 py-1 text-xs rounded-full bg-primary text-white whitespace-nowrap">
              All Tickets
            </button>
            <button className="px-2.5 py-1 text-xs rounded-full border whitespace-nowrap">
              Unassigned
            </button>
            <button className="px-2.5 py-1 text-xs rounded-full border whitespace-nowrap">
              Assigned to me
            </button>
            <button className="px-2.5 py-1 text-xs rounded-full border whitespace-nowrap">
              Urgent
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-grow">
          {[
            {
              id: "TKT-1234",
              customer: "John Smith",
              subject: "Payment issue with recent order",
              time: "10m ago",
              status: "New",
              priority: "High",
            },
            {
              id: "TKT-1233",
              customer: "Lisa Wong",
              subject: "Cannot access my account",
              time: "25m ago",
              status: "In Progress",
              priority: "Medium",
            },
            {
              id: "TKT-1232",
              customer: "Robert Johnson",
              subject: "Request for refund",
              time: "1h ago",
              status: "In Progress",
              priority: "Medium",
            },
            {
              id: "TKT-1231",
              customer: "Emily Davis",
              subject: "Product arrived damaged",
              time: "2h ago",
              status: "New",
              priority: "High",
            },
            {
              id: "TKT-1230",
              customer: "Michael Brown",
              subject: "Question about shipping",
              time: "3h ago",
              status: "In Progress",
              priority: "Low",
            },
            {
              id: "TKT-1229",
              customer: "Sarah Miller",
              subject: "Missing item in order",
              time: "5h ago",
              status: "New",
              priority: "Medium",
            },
            {
              id: "TKT-1228",
              customer: "David Wilson",
              subject: "Subscription cancellation",
              time: "1d ago",
              status: "Resolved",
              priority: "Low",
            },
          ].map((ticket, i) => (
            <div
              key={i}
              className={`p-3 border-b hover:bg-muted/30 cursor-pointer ${i === 0 ? "bg-primary/5" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {ticket.id}
                </span>
                <span className="text-xs text-muted-foreground">
                  {ticket.time}
                </span>
              </div>
              <p className="font-medium text-sm mb-1 truncate">
                {ticket.subject}
              </p>
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <User className="h-3 w-3 mr-1" />
                <span>{ticket.customer}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs
                      ${
                        ticket.status === "New"
                          ? "bg-blue-100 text-blue-800"
                          : ticket.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                  >
                    {ticket.status === "New" ? (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    ) : ticket.status === "In Progress" ? (
                      <Clock className="h-3 w-3 mr-1" />
                    ) : (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    {ticket.status}
                  </span>
                </div>
                <span
                  className={`inline-block w-2 h-2 rounded-full
                    ${
                      ticket.priority === "High"
                        ? "bg-destructive"
                        : ticket.priority === "Medium"
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                ></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Panel */}
      <div className="flex-grow flex flex-col h-screen">
        {/* Ticket Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Payment issue with recent order</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                New
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              TKT-1234 • Opened 10m ago by John Smith
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted">
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-4 border-b bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              JS
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-muted-foreground">
                    Customer since Jan 2023
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-full bg-primary/10 text-primary">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-full bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">john.smith@example.com</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-sm">12</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-sm">$1,245.80</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {/* Customer Message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              JS
            </div>
            <div className="max-w-[80%]">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm">
                  Hello, I recently placed an order (#ORD-7890) and was charged
                  twice for it. I can see two identical transactions on my
                  credit card statement. Could you please help me resolve this
                  issue?
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">10:24 AM</p>
            </div>
          </div>

          {/* Agent Message */}
          <div className="flex items-start gap-3 justify-end">
            <div className="max-w-[80%]">
              <div className="bg-primary/10 text-primary-900 rounded-lg p-3">
                <p className="text-sm">
                  Hi John, I'm sorry to hear about this issue. Let me check your
                  order details right away. Could you please confirm the date
                  when you noticed these duplicate charges?
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-right">
                10:26 AM
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              AJ
            </div>
          </div>

          {/* Customer Message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              JS
            </div>
            <div className="max-w-[80%]">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm">
                  I noticed the duplicate charges yesterday. Both transactions
                  were processed on June 15th for $89.99 each.
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">10:28 AM</p>
            </div>
          </div>
        </div>

        {/* Reply Box */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <button className="px-2.5 py-1 text-xs rounded-md border">
              Canned Responses
            </button>
            <button className="px-2.5 py-1 text-xs rounded-md border">
              Order Details
            </button>
            <button className="px-2.5 py-1 text-xs rounded-md border">
              Refund Policy
            </button>
          </div>
          <div className="relative">
            <textarea
              placeholder="Type your reply..."
              className="w-full border rounded-md p-3 pr-12 min-h-[100px] resize-none"
            ></textarea>
            <button className="absolute right-3 bottom-3 p-2 bg-primary text-white rounded-md">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
