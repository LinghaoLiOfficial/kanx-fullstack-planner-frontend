import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 rounded-[1.75rem]" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-[1.75rem]" />
        <Skeleton className="h-80 rounded-[1.75rem]" />
      </div>
    </div>
  );
}
