export type UIFieldDefinition = {
  key: string;
  chineseName: string;
  englishName: string;
  meaning: string;
};

export const uiDesignFieldDefinitions = {
  ui_design: {
    key: "ui_design",
    chineseName: "UI视觉设计",
    englishName: "ui_design",
    meaning: "",
  },
  version_summary: {
    key: "version_summary",
    chineseName: "版本摘要",
    englishName: "version_summary",
    meaning: "本次 UI 视觉设计版本的简要概括。",
  },
  visual_system: {
    key: "visual_system",
    chineseName: "视觉系统",
    englishName: "visual_system",
    meaning: "全局视觉语言，包括设计风格、主题配置、颜色配置、字体配置、间距配置、形状配置和阴影配置。",
  },
  design_style: {
    key: "design_style",
    chineseName: "设计风格",
    englishName: "design_style",
    meaning: "产品整体视觉气质、风格方向和识别特征。",
  },
  style_description: {
    key: "style_description",
    chineseName: "风格描述",
    englishName: "style_description",
    meaning: "对整体视觉风格的自然语言说明。",
  },
  signature_traits: {
    key: "signature_traits",
    chineseName: "典型特征",
    englishName: "signature_traits",
    meaning: "该视觉风格最具有代表性的特征集合。",
  },
  trait: {
    key: "trait",
    chineseName: "特征",
    englishName: "trait",
    meaning: "一个典型视觉特征。",
  },
  theme_configuration: {
    key: "theme_configuration",
    chineseName: "主题配置",
    englishName: "theme_configuration",
    meaning: "视觉系统支持的主题模式、默认主题和主题切换策略。",
  },
  theme_types: {
    key: "theme_types",
    chineseName: "类型",
    englishName: "theme_types",
    meaning: "当前产品支持的主题模式类型集合。",
  },
  light_mode: {
    key: "light_mode",
    chineseName: "浅色模式",
    englishName: "light_mode",
    meaning: "适合明亮环境和默认使用场景的浅色主题。",
  },
  dark_mode: {
    key: "dark_mode",
    chineseName: "暗色模式",
    englishName: "dark_mode",
    meaning: "适合低光环境或开发者偏好的暗色主题。",
  },
  default_theme: {
    key: "default_theme",
    chineseName: "默认",
    englishName: "default_theme",
    meaning: "系统初始使用的默认主题模式。",
  },
  color_configuration: {
    key: "color_configuration",
    chineseName: "颜色配置",
    englishName: "color_configuration",
    meaning: "按 Brand、Surface、Text、Border 等分类组织的颜色配置。",
  },
  font_configuration: {
    key: "font_configuration",
    chineseName: "字体配置",
    englishName: "font_configuration",
    meaning: "字体族、字号、字重和字体说明。",
  },
  spacing_configuration: {
    key: "spacing_configuration",
    chineseName: "间距配置",
    englishName: "spacing_configuration",
    meaning: "页面和组件使用的间距配置。",
  },
  shape_configuration: {
    key: "shape_configuration",
    chineseName: "形状配置",
    englishName: "shape_configuration",
    meaning: "页面和组件使用的形状配置。",
  },
  shadow_configuration: {
    key: "shadow_configuration",
    chineseName: "阴影配置",
    englishName: "shadow_configuration",
    meaning: "页面和组件使用的阴影配置。",
  },
} as const;
