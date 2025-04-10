import { Skeleton } from "./skeleton";
import { cn } from "@/frontend/lib/utils";

interface TextSkeletonProps {
  lines?: number;
  className?: string;
  width?: string | number;
}

export function TextSkeleton({
  lines = 1,
  className,
  width,
}: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-4/5" : "w-full",
            width
              ? typeof width === "number"
                ? `w-[${width}px]`
                : `w-[${width}]`
              : "",
          )}
        />
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
  header?: boolean;
  footer?: boolean;
  lines?: number;
}

export function CardSkeleton({
  className,
  header = true,
  footer = false,
  lines = 3,
}: CardSkeletonProps) {
  return (
    <div className={cn("rounded-lg border p-4 space-y-4", className)}>
      {header && (
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      <div className="space-y-2">
        <TextSkeleton lines={lines} />
      </div>
      {footer && (
        <div className="flex justify-between pt-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      )}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            {showHeader && (
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors">
                  {Array.from({ length: columns }).map((_, i) => (
                    <th
                      key={i}
                      className="h-12 px-4 text-left align-middle font-medium"
                    >
                      <Skeleton className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="[&_tr:last-child]:border-0">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b transition-colors">
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td key={colIndex} className="p-4 align-middle">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardSkeletonProps {
  className?: string;
  showIcon?: boolean;
}

export function StatCardSkeleton({
  className,
  showIcon = true,
}: StatCardSkeletonProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        {showIcon && <Skeleton className="h-8 w-8 rounded-full" />}
      </div>
      <div className="mt-3">
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

interface DashboardSkeletonProps {
  className?: string;
  statCards?: number;
  showCharts?: boolean;
  showTable?: boolean;
}

export function DashboardSkeleton({
  className,
  statCards = 4,
  showCharts = true,
  showTable = true,
}: DashboardSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: statCards }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      {showCharts && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton className="h-[300px]" lines={0} />
          <CardSkeleton className="h-[300px]" lines={0} />
        </div>
      )}

      {/* Table */}
      {showTable && (
        <CardSkeleton className="p-0">
          <TableSkeleton />
        </CardSkeleton>
      )}
    </div>
  );
}
