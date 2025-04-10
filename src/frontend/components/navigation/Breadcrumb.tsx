import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/frontend/lib/utils";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Always include Dashboard as the first item
  const allItems: BreadcrumbItem[] = [
    {
      label: isRTL ? "لوحة القيادة" : "Dashboard",
      path: "/dashboard",
      icon: <Home className="h-3.5 w-3.5" />,
    },
    ...items,
  ];

  return (
    <nav
      className={cn(
        "flex items-center text-sm text-muted-foreground mb-4",
        className,
      )}
      aria-label="Breadcrumb"
    >
      <ol
        className={cn(
          "flex items-center space-x-2",
          isRTL && "space-x-reverse",
        )}
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className={cn(
                    "mx-2 h-4 w-4 text-muted-foreground/50",
                    isRTL && "rotate-180",
                  )}
                />
              )}
              {isLast ? (
                <span
                  className="flex items-center font-medium text-foreground"
                  aria-current="page"
                >
                  {item.icon && (
                    <span className={cn("mr-1", isRTL && "ml-1 mr-0")}>
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  {item.icon && (
                    <span className={cn("mr-1", isRTL && "ml-1 mr-0")}>
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
