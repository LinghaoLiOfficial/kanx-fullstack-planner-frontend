"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import { getProjectBlueprints, summarizeProjectBlueprint } from "@/lib/api/blueprints";

function SummarizeBlueprintButton() {
  const { t } = useLanguage();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      await summarizeProjectBlueprint(projectId);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" onClick={() => void handleSummarize()} disabled={loading}>
      {loading ? t.designAssets.pages.projectBlueprint.resummarizing : t.designAssets.pages.projectBlueprint.resummarize}
    </Button>
  );
}

export default function ProjectBlueprintPage() {
  const { t } = useLanguage();
  const page = t.designAssets.pages.projectBlueprint;

  return (
    <VersionedAssetPage
      title={page.title}
      description={page.description}
      emptyDescription={page.emptyDescription}
      listAssets={getProjectBlueprints}
      action={<SummarizeBlueprintButton />}
      sections={[
        { key: "project_overview", title: page.sections.projectOverview },
        { key: "current_product_scope", title: page.sections.currentProductScope },
        { key: "business_capability_summary", title: page.sections.businessCapabilitySummary },
        { key: "ux_summary", title: page.sections.uxSummary },
        { key: "ui_summary", title: page.sections.uiSummary },
        { key: "frontend_summary", title: page.sections.frontendSummary },
        { key: "backend_summary", title: page.sections.backendSummary },
        { key: "architecture_notes", title: page.sections.architectureNotes },
        { key: "risks", title: page.sections.risks },
        { key: "open_questions", title: page.sections.openQuestions },
      ]}
    />
  );
}
