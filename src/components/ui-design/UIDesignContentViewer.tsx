"use client";

import { Palette, Shapes, SlidersHorizontal, Type } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FieldHint } from "@/components/ui/field-hint";
import { MetricStrip, StatusBadge, TextChips, VisualSection } from "@/components/design-assets/visual-dashboard";
import { useLanguage } from "@/components/language/language-provider";
import type { UIDesignContent } from "@/lib/types/ui-design";

function TokenPanel({
  title,
  entries,
  emptyText,
  icon,
}: {
  title: string;
  entries: Array<{ label: string; value: string }>;
  emptyText: string;
  icon: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          {title}
        </h3>
        <StatusBadge label={`${entries.length}`} tone={entries.length > 0 ? "success" : "muted"} />
      </div>
      {entries.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {entries.map((entry, index) => (
            <Badge key={`${entry.label}-${index}`} variant="outline" className="max-w-full whitespace-normal bg-transparent leading-5">
              {entry.label}: {entry.value}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>
      )}
    </section>
  );
}

export function UIDesignContentViewer({ content }: { content: UIDesignContent }) {
  const { t } = useLanguage();
  const visualSystem = content.visual_system;
  const colorEntries = visualSystem.color_configuration.colors ?? [];
  const fontEntries = visualSystem.font_configuration.fonts ?? [];
  const spacingEntries = visualSystem.spacing_configuration.spacings ?? [];
  const shapeEntries = visualSystem.shape_configuration.shapes ?? [];
  const shadowEntries = visualSystem.shadow_configuration.shadows ?? [];

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          {
            label: t.designAssets.ui.visualSystem,
            value: 1,
            description: visualSystem.design_style.style_description,
          },
          {
            label: t.designAssets.ui.traits,
            value: visualSystem.design_style.signature_traits.length,
            description: t.designAssets.ui.traits,
          },
          {
            label: t.designAssets.ui.colorSystem,
            value: colorEntries.length,
            description: t.designAssets.ui.colorSystem,
          },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label={t.designAssets.ui.visualSystem}
            hint={t.designAssets.ui.visualSystemHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={<SlidersHorizontal className="h-4 w-4" />}
      >
        <div className="space-y-4">
          <section className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
            <h3 className="text-sm font-semibold">{t.designAssets.ui.designStyle}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{visualSystem.design_style.style_description}</p>
            <TextChips values={visualSystem.design_style.signature_traits} emptyText={t.common.empty} />
          </section>

          <section className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-4">
            <h3 className="text-sm font-semibold">{t.designAssets.ui.themeConfiguration}</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">{t.designAssets.ui.light}</span>
                <StatusBadge label={visualSystem.theme_configuration.theme_types.light_mode} tone="muted" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">{t.designAssets.ui.dark}</span>
                <StatusBadge label={visualSystem.theme_configuration.theme_types.dark_mode} tone="muted" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">{t.designAssets.ui.defaultTheme}</span>
                <StatusBadge label={visualSystem.theme_configuration.default_theme} tone="muted" />
              </div>
            </div>
          </section>

          <div className="grid gap-3 lg:grid-cols-2">
            <TokenPanel title={t.designAssets.ui.colorSystem} entries={colorEntries.map((entry) => ({ label: entry.color_name, value: `${entry.hex_value} · ${entry.color_description}` }))} emptyText={t.common.empty} icon={<Palette className="h-4 w-4" />} />
            <TokenPanel title={t.designAssets.ui.typographySystem} entries={fontEntries.map((entry) => ({ label: entry.font_name, value: `${entry.font_family} · ${entry.font_size} · ${entry.font_weight}` }))} emptyText={t.common.empty} icon={<Type className="h-4 w-4" />} />
            <TokenPanel title={t.designAssets.ui.spacingSystem} entries={spacingEntries.map((entry) => ({ label: entry.spacing_name, value: entry.spacing_size }))} emptyText={t.common.empty} icon={<SlidersHorizontal className="h-4 w-4" />} />
            <TokenPanel title={t.designAssets.ui.shapeSystem} entries={shapeEntries.map((entry) => ({ label: entry.shape_name, value: entry.shape_size }))} emptyText={t.common.empty} icon={<Shapes className="h-4 w-4" />} />
            <TokenPanel title={t.designAssets.ui.elevationSystem} entries={shadowEntries.map((entry) => ({ label: entry.shadow_name, value: entry.shadow_size }))} emptyText={t.common.empty} icon={<SlidersHorizontal className="h-4 w-4" />} />
          </div>
        </div>
      </VisualSection>
    </div>
  );
}
