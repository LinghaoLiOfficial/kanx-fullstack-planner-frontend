export type FrontendImplementationFieldDefinition = {
  key: string;
  chineseName: string;
  englishName: string;
  meaning: string;
};

export const frontendImplementationFieldDefinitions = {
  frontend_implementation: {
    key: "frontend_implementation",
    chineseName: "前端工程实现",
    englishName: "frontend_implementation",
    meaning: "将 UX、UI、API 契约转译为前端工程结构和实现规划的资产模块。",
  },
  version_summary: {
    key: "version_summary",
    chineseName: "版本摘要",
    englishName: "version_summary",
    meaning: "本次前端工程实现版本的简要概括。",
  },
  route_definitions: {
    key: "route_definitions",
    chineseName: "路由定义",
    englishName: "route_definitions",
    meaning: "前端访问路径、动态参数和目标组件。",
  },
  route_definition: {
    key: "route_definition",
    chineseName: "路由",
    englishName: "route_definition",
    meaning: "一条前端访问路径和页面归属规则。",
  },
  route_path: {
    key: "route_path",
    chineseName: "访问路径",
    englishName: "path",
    meaning: "前端用户访问该页面时使用的 URL 路径。",
  },
  route_name: {
    key: "route_name",
    chineseName: "路由名称",
    englishName: "route_name",
    meaning: "该访问路径的业务名称。",
  },
  route_params: {
    key: "route_params",
    chineseName: "路由参数",
    englishName: "route_params",
    meaning: "该路由中需要从 URL 中读取的动态参数集合。",
  },
  route_target_component: {
    key: "route_target_component",
    chineseName: "目标组件",
    englishName: "route_target_component",
    meaning: "该路由对应的前端组件或页面实现。",
  },
  directory_structure: {
    key: "directory_structure",
    chineseName: "目录结构",
    englishName: "directory_structure",
    meaning: "前端页面、组件、API client、类型定义和工具文件的建议文件路径。",
  },
  directory_entry: {
    key: "directory_entry",
    chineseName: "文件路径",
    englishName: "directory_entry",
    meaning: "一个建议创建或修改的前端文件路径。",
  },
  file_path: {
    key: "file_path",
    chineseName: "路径",
    englishName: "path",
    meaning: "建议文件或目录在前端工程中的位置。",
  },
  file_purpose: {
    key: "file_purpose",
    chineseName: "用途",
    englishName: "purpose",
    meaning: "该文件或目录在前端实现中的职责。",
  },
  code_logic: {
    key: "code_logic",
    chineseName: "代码逻辑",
    englishName: "code_logic",
    meaning: "前端页面和组件中的核心实现逻辑。",
  },
  logic_item: {
    key: "logic_item",
    chineseName: "逻辑对象",
    englishName: "logic_item",
    meaning: "一个页面、组件或 API client 的前端实现逻辑规划。",
  },
  logic_target: {
    key: "logic_target",
    chineseName: "目标对象",
    englishName: "target",
    meaning: "该段代码逻辑对应的页面、组件或前端模块。",
  },
  logic_description: {
    key: "logic_description",
    chineseName: "逻辑描述",
    englishName: "logic_description",
    meaning: "页面、组件、布局库、组件库、依赖包管理或接口定义的实现要点。",
  },
  environment_variables: {
    key: "environment_variables",
    chineseName: "环境变量",
    englishName: "environment_variables",
    meaning: "前端运行和构建所需的环境变量配置。",
  },
  environment_variable: {
    key: "environment_variable",
    chineseName: "环境变量项",
    englishName: "environment_variable",
    meaning: "一个前端运行或构建环境变量。",
  },
  variable_name: {
    key: "variable_name",
    chineseName: "变量名",
    englishName: "variable_name",
    meaning: "环境变量的名称。",
  },
  variable_description: {
    key: "variable_description",
    chineseName: "变量说明",
    englishName: "variable_description",
    meaning: "该环境变量在前端工程中的用途。",
  },
  default_value: {
    key: "default_value",
    chineseName: "默认值",
    englishName: "default_value",
    meaning: "该环境变量的默认值或推荐值。",
  },
  layout_library: {
    key: "layout_library",
    chineseName: "布局库",
    englishName: "layout_library",
    meaning: "前端页面与布局组件的实现说明。",
  },
  component_library: {
    key: "component_library",
    chineseName: "组件库",
    englishName: "component_library",
    meaning: "前端组件的实现说明。",
  },
  dependency_package_management: {
    key: "dependency_package_management",
    chineseName: "依赖包管理",
    englishName: "dependency_package_management",
    meaning: "第三方依赖包及其用途说明。",
  },
  page_code_logic: {
    key: "page_code_logic",
    chineseName: "页面代码逻辑",
    englishName: "page_code_logic",
    meaning: "前端页面和组件中的实现逻辑规划。",
  },
  frontend_interfaces: {
    key: "frontend_interfaces",
    chineseName: "前端接口",
    englishName: "frontend_interfaces",
    meaning: "前端内部接口、共享契约和模块之间的边界说明。",
  },
  dependencies: {
    key: "dependencies",
    chineseName: "依赖包",
    englishName: "dependencies",
    meaning: "前端工程需要安装或使用的第三方依赖包。",
  },
  dependency: {
    key: "dependency",
    chineseName: "依赖包项",
    englishName: "dependency",
    meaning: "一个前端第三方依赖包。",
  },
  package_name: {
    key: "package_name",
    chineseName: "包名",
    englishName: "package_name",
    meaning: "第三方依赖包的 npm 包名或工程引用名。",
  },
  dependency_purpose: {
    key: "dependency_purpose",
    chineseName: "依赖用途",
    englishName: "purpose",
    meaning: "该依赖包在前端工程中的使用原因。",
  },
} as const;
