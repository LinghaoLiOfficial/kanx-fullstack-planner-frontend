import { CopyButton } from "@/components/common/CopyButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PromptTextViewer({ promptText }: { promptText: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Codex Prompt</CardTitle>
          <CopyButton value={promptText} label="复制 Prompt" />
        </div>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap rounded-[1.5rem] border border-border/60 bg-muted/50 p-4 font-mono text-xs leading-6 text-foreground">
          {promptText || "暂无 prompt_text"}
        </pre>
      </CardContent>
    </Card>
  );
}
