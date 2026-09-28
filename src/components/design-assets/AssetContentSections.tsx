import { JsonViewer } from "@/components/common/JsonViewer";
import { useLanguage } from "@/components/language/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function HumanValue({ value }: { value: unknown }) {
  const { t } = useLanguage();

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm text-muted-foreground">{t.common.empty}</p>;
    }

    return (
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
        {value.slice(0, 12).map((item, index) => (
          <li key={index}>
            {isRecord(item) ? (
              <code className="break-words text-xs">{JSON.stringify(item)}</code>
            ) : (
              String(item)
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (isRecord(value)) {
    return (
      <pre className="max-h-72 overflow-auto rounded-2xl bg-muted/60 p-3 font-mono text-xs leading-6">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{String(value ?? t.common.empty)}</p>;
}

export function AssetContentSections({
  content,
  sections,
}: {
  content: Record<string, unknown>;
  sections: Array<{ key: string; title: string }>;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.key}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <HumanValue value={content[section.key]} />
          </CardContent>
        </Card>
      ))}
      <JsonViewer title={t.designAssets.versions.fullJson} data={content} />
    </div>
  );
}
