import { Badge } from "@/components/ui/badge";
import { changeSetStatusLabels } from "@/lib/design-asset-labels";
import type { ChangeSetStatus } from "@/lib/types/change-set";

export function ChangeSetStatusBadge({ status }: { status: ChangeSetStatus }) {
  return <Badge variant="outline">{changeSetStatusLabels[status]}</Badge>;
}
