import { Sparkles } from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";

export function BusinessStoryGenerateButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  const { t } = useLanguage();

  return (
    <Button type="button" size="sm" onClick={onClick} disabled={loading}>
      <Sparkles className="size-4" />
      {loading ? t.businessStories.generating : t.businessStories.generate}
    </Button>
  );
}
