export type BackendImplementationFieldDefinition = {
  key: string;
  chineseName: string;
  englishName: string;
  meaning: string;
};

export const backendImplementationFieldDefinitions = {
  backend_implementation: {
    key: "backend_implementation",
    chineseName: "后端工程实现",
    englishName: "backend_implementation",
    meaning: "后端服务目录、代码逻辑、工具类、LLM 交互模板、环境变量和依赖的工程规划。",
  },
  version_summary: {
    key: "version_summary",
    chineseName: "版本摘要",
    englishName: "version_summary",
    meaning: "本次后端工程实现版本的简要概括。",
  },
  directory_structure: {
    key: "directory_structure",
    chineseName: "目录结构",
    englishName: "directory_structure",
    meaning: "后端路由、模型、服务、schema、工具和迁移文件的建议文件路径。",
  },
  directory_entry: {
    key: "directory_entry",
    chineseName: "文件路径",
    englishName: "directory_entry",
    meaning: "一个建议创建或修改的后端文件路径。",
  },
  file_path: {
    key: "file_path",
    chineseName: "路径",
    englishName: "path",
    meaning: "建议文件或目录在后端工程中的位置。",
  },
  file_purpose: {
    key: "file_purpose",
    chineseName: "用途",
    englishName: "purpose",
    meaning: "该文件或目录在后端实现中的职责。",
  },
  code_logic: {
    key: "code_logic",
    chineseName: "代码逻辑",
    englishName: "code_logic",
    meaning: "后端核心服务流程、校验逻辑、事务处理和错误处理。",
  },
  logic_item: {
    key: "logic_item",
    chineseName: "逻辑对象",
    englishName: "logic_item",
    meaning: "一个后端路由、服务、schema 或基础设施模块的实现逻辑规划。",
  },
  logic_target: {
    key: "logic_target",
    chineseName: "目标对象",
    englishName: "target",
    meaning: "该段代码逻辑对应的后端模块、服务方法或处理流程。",
  },
  service_flow: {
    key: "service_flow",
    chineseName: "服务流程",
    englishName: "service_flow",
    meaning: "后端核心服务按顺序执行的业务处理步骤。",
  },
  validation_logic: {
    key: "validation_logic",
    chineseName: "校验逻辑",
    englishName: "validation_logic",
    meaning: "输入、权限、状态或业务规则的校验方式。",
  },
  transaction_handling: {
    key: "transaction_handling",
    chineseName: "事务处理",
    englishName: "transaction_handling",
    meaning: "数据库写入、回滚、幂等和一致性处理方式。",
  },
  error_handling: {
    key: "error_handling",
    chineseName: "错误处理",
    englishName: "error_handling",
    meaning: "校验失败、权限失败、资源不存在、外部依赖失败等异常情况的响应方式。",
  },
  utility_classes: {
    key: "utility_classes",
    chineseName: "工具类",
    englishName: "utility_classes",
    meaning: "可复用的后端工具函数、工具类或基础设施封装。",
  },
  utility_class: {
    key: "utility_class",
    chineseName: "工具类项",
    englishName: "utility_class",
    meaning: "一个可复用的后端工具函数、工具类或基础设施封装。",
  },
  utility_name: {
    key: "utility_name",
    chineseName: "名称",
    englishName: "name",
    meaning: "工具类、工具函数或基础设施封装的名称。",
  },
  utility_purpose: {
    key: "utility_purpose",
    chineseName: "用途",
    englishName: "purpose",
    meaning: "该工具在后端工程中的职责。",
  },
  utility_usage: {
    key: "utility_usage",
    chineseName: "使用场景",
    englishName: "usage",
    meaning: "该工具会被哪些服务、路由或基础设施流程复用。",
  },
  llm_interaction_templates: {
    key: "llm_interaction_templates",
    chineseName: "大模型交互模板",
    englishName: "llm_interaction_templates",
    meaning: "后端调用大模型时使用的提示词模板、输入结构、输出结构和解析规则。",
  },
  llm_interaction_template: {
    key: "llm_interaction_template",
    chineseName: "大模型交互模板项",
    englishName: "llm_interaction_template",
    meaning: "一个后端调用大模型的交互模板规划。",
  },
  template_name: {
    key: "template_name",
    chineseName: "模板名称",
    englishName: "template_name",
    meaning: "提示词模板或大模型交互任务的名称。",
  },
  input_structure: {
    key: "input_structure",
    chineseName: "输入结构",
    englishName: "input_structure",
    meaning: "调用大模型时传入的上下文、字段和约束。",
  },
  output_structure: {
    key: "output_structure",
    chineseName: "输出结构",
    englishName: "output_structure",
    meaning: "大模型应返回的数据结构、字段和类型要求。",
  },
  parsing_rules: {
    key: "parsing_rules",
    chineseName: "解析规则",
    englishName: "parsing_rules",
    meaning: "后端解析、校验、修复或拒绝大模型输出的规则。",
  },
  environment_variables: {
    key: "environment_variables",
    chineseName: "环境变量",
    englishName: "environment_variables",
    meaning: "后端运行、数据库、认证、LLM、邮件等功能需要的环境变量配置。",
  },
  environment_variable: {
    key: "environment_variable",
    chineseName: "环境变量项",
    englishName: "environment_variable",
    meaning: "一个后端运行或部署环境变量。",
  },
  env_name: {
    key: "env_name",
    chineseName: "变量名",
    englishName: "name",
    meaning: "环境变量的名称。",
  },
  env_purpose: {
    key: "env_purpose",
    chineseName: "变量用途",
    englishName: "purpose",
    meaning: "该环境变量在后端工程中的用途。",
  },
  env_required: {
    key: "env_required",
    chineseName: "是否必需",
    englishName: "required",
    meaning: "该环境变量是否为运行或部署必需配置。",
  },
  dependencies: {
    key: "dependencies",
    chineseName: "依赖包",
    englishName: "dependencies",
    meaning: "后端工程需要安装或使用的第三方依赖包。",
  },
  dependency: {
    key: "dependency",
    chineseName: "依赖包项",
    englishName: "dependency",
    meaning: "一个后端第三方依赖包。",
  },
  package_name: {
    key: "package_name",
    chineseName: "包名",
    englishName: "package_name",
    meaning: "第三方依赖包的包名或工程引用名。",
  },
  dependency_purpose: {
    key: "dependency_purpose",
    chineseName: "依赖用途",
    englishName: "purpose",
    meaning: "该依赖包在后端工程中的使用原因。",
  },
  dependency_required: {
    key: "dependency_required",
    chineseName: "是否必需",
    englishName: "required",
    meaning: "该依赖包是否为实现该后端工程规划的必需依赖。",
  },
} as const;

export const backendImplementationLegacySections = [
  { key: "version_summary", title: "版本摘要" },
  { key: "services", title: "历史服务结构（兼容）" },
  { key: "cross_cutting_rules", title: "横切规则" },
  { key: "api_mappings", title: "关联 API" },
  { key: "database_mappings", title: "关联数据库实体" },
  { key: "dependencies", title: "依赖包" },
  { key: "external_services", title: "外部服务" },
  { key: "environment_variables", title: "环境变量" },
  { key: "internal_utilities", title: "内部工具" },
  { key: "install_commands", title: "安装命令" },
  { key: "risks", title: "风险说明" },
  { key: "diff", title: "版本差异" },
];
