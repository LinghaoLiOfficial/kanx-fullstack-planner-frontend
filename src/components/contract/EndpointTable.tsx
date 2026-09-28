import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language/language-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LegacyApiEndpoint } from "@/lib/types/api-contract";

function display(value?: string | null) {
  return value && value.trim() ? value : "-";
}

export function EndpointTable({ endpoints }: { endpoints: LegacyApiEndpoint[] }) {
  const { t } = useLanguage();

  if (endpoints.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.designAssets.viewer.noEndpoints}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Method</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Request</TableHead>
          <TableHead>Response</TableHead>
          <TableHead>Auth</TableHead>
          <TableHead>Errors</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {endpoints.map((endpoint) => (
          <TableRow key={`${endpoint.method}-${endpoint.path}-${endpoint.operation_id ?? ""}`}>
            <TableCell>
              <Badge variant="outline">{endpoint.method.toUpperCase()}</Badge>
            </TableCell>
            <TableCell className="font-mono text-xs">{endpoint.path}</TableCell>
            <TableCell className="min-w-48 text-muted-foreground">{display(endpoint.purpose)}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{display(endpoint.request_body)}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{display(endpoint.response_body)}</TableCell>
            <TableCell>{endpoint.auth_required ? t.common.yes : t.common.no}</TableCell>
            <TableCell className="text-muted-foreground">{endpoint.errors?.join(", ") || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
