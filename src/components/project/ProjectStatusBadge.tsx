import { Badge } from "@/components/ui/badge";

export function ProjectStatusBadge({ status }: { status: string }) {
  const normalized = status || "draft";

  return <Badge variant={normalized === "active" ? "default" : "secondary"}>{normalized}</Badge>;
}
