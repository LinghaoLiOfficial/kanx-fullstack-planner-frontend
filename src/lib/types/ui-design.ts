import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type UIDesignStyle = {
  style_description: string;
  signature_traits: string[];
};

export type UIThemeTypes = {
  light_mode: string;
  dark_mode: string;
};

export type UIThemeConfiguration = {
  theme_types: UIThemeTypes;
  default_theme: string;
};

export type UIColorEntry = {
  color_name: string;
  hex_value: string;
  color_description: string;
};

export type UIFontEntry = {
  font_name: string;
  font_family: string;
  font_size: string;
  font_weight: string;
  font_description: string;
};

export type UISpacingEntry = {
  spacing_name: string;
  spacing_size: string;
};

export type UIShapeEntry = {
  shape_name: string;
  shape_size: string;
};

export type UIShadowEntry = {
  shadow_name: string;
  shadow_size: string;
};

export type UIColorConfiguration = {
  description: string;
  rules: string[];
  colors: UIColorEntry[];
  tbd_items?: string[];
};

export type UIFontConfiguration = {
  description: string;
  rules: string[];
  fonts: UIFontEntry[];
  tbd_items?: string[];
};

export type UISpacingConfiguration = {
  description: string;
  rules: string[];
  spacings: UISpacingEntry[];
  tbd_items?: string[];
};

export type UIShapeConfiguration = {
  description: string;
  rules: string[];
  shapes: UIShapeEntry[];
  tbd_items?: string[];
};

export type UIShadowConfiguration = {
  description: string;
  rules: string[];
  shadows: UIShadowEntry[];
  tbd_items?: string[];
};

export type UIVisualSystem = {
  design_style: UIDesignStyle;
  theme_configuration: UIThemeConfiguration;
  color_configuration: UIColorConfiguration;
  font_configuration: UIFontConfiguration;
  spacing_configuration: UISpacingConfiguration;
  shape_configuration: UIShapeConfiguration;
  shadow_configuration: UIShadowConfiguration;
};

export type UIDesignContent = {
  version_summary: string;
  visual_system: UIVisualSystem;
  diff: {
    added: unknown[];
    modified: unknown[];
    removed: unknown[];
  };
};

export type UIDesign = VersionedDesignAsset<UIDesignContent>;
