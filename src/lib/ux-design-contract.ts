export type UXFieldDefinition = {
  key: string;
  chineseName: string;
  englishName: string;
  meaning: string;
};

export const uxDesignFieldDefinitions = {
  ux_design: {
    key: "ux_design",
    chineseName: "UX用户体验设计",
    englishName: "ux_design",
    meaning: "",
  },
  version_summary: {
    key: "version_summary",
    chineseName: "版本摘要",
    englishName: "version_summary",
    meaning: "本次 UX 设计版本的简要概括。",
  },
  low_fidelity_screen_structure: {
    key: "low_fidelity_screen_structure",
    chineseName: "页面低保真结构",
    englishName: "low_fidelity_screen_structure",
    meaning: "以页面为单位描述页面名称、页面功能、信息优先级和交互区域。",
  },
  ux_screen: {
    key: "ux_screen",
    chineseName: "页面",
    englishName: "ux_screen",
    meaning: "一个 UX 页面或低保真屏幕结构对象。",
  },
  screen_name: {
    key: "screen_name",
    chineseName: "页面名称",
    englishName: "screen_name",
    meaning: "页面在产品和用户视角下的名称。",
  },
  screen_purpose: {
    key: "screen_purpose",
    chineseName: "页面功能",
    englishName: "screen_purpose",
    meaning: "该页面承担的用户任务和产品职责。",
  },
  information_priority: {
    key: "information_priority",
    chineseName: "信息优先级",
    englishName: "information_priority",
    meaning: "该页面中用户最需要优先理解的信息排序。",
  },
  interaction_regions: {
    key: "interaction_regions",
    chineseName: "交互区域",
    englishName: "interaction_regions",
    meaning: "页面中承载信息、操作和反馈的主要低保真区域集合。",
  },
  wireframe_region: {
    key: "wireframe_region",
    chineseName: "区域",
    englishName: "wireframe_region",
    meaning: "页面中的一个低保真区域或交互区块。",
  },
  region_name: {
    key: "region_name",
    chineseName: "区域名称",
    englishName: "region_name",
    meaning: "该页面区域的中文展示名称。",
  },
  region_purpose: {
    key: "region_purpose",
    chineseName: "区域功能",
    englishName: "region_purpose",
    meaning: "该区域在页面体验中的职责和用途。",
  },
  content_elements: {
    key: "content_elements",
    chineseName: "内容元素",
    englishName: "content_elements",
    meaning: "该区域内需要展示的信息元素列表。",
  },
  business_flows: {
    key: "business_flows",
    chineseName: "业务逻辑流",
    englishName: "business_flows",
    meaning: "用户围绕业务目标完成任务的流程集合，可横跨多个页面和多个交互区域。",
  },
  business_flow: {
    key: "business_flow",
    chineseName: "流程",
    englishName: "business_flow",
    meaning: "一条完整的业务逻辑流对象。",
  },
  flow_name: {
    key: "flow_name",
    chineseName: "流程名称",
    englishName: "flow_name",
    meaning: "该业务逻辑流的中文名称。",
  },
  flow_goal: {
    key: "flow_goal",
    chineseName: "流程目标",
    englishName: "flow_goal",
    meaning: "用户通过该流程希望达成的业务结果。",
  },
  primary_actor: {
    key: "primary_actor",
    chineseName: "主要用户",
    englishName: "primary_actor",
    meaning: "该流程的主要执行者或使用者角色。",
  },
  preconditions: {
    key: "preconditions",
    chineseName: "前置条件",
    englishName: "preconditions",
    meaning: "流程开始前必须满足的条件、权限、数据或状态要求。",
  },
  steps: {
    key: "steps",
    chineseName: "步骤",
    englishName: "steps",
    meaning: "业务逻辑流中按顺序发生的用户行为和系统反馈集合。",
  },
  flow_step: {
    key: "flow_step",
    chineseName: "步骤",
    englishName: "flow_step",
    meaning: "业务逻辑流中的单个步骤对象。",
  },
  step_order: {
    key: "step_order",
    chineseName: "步骤顺序",
    englishName: "step_order",
    meaning: "该步骤在业务逻辑流中的先后顺序。",
  },
  involved_elements: {
    key: "involved_elements",
    chineseName: "涉及元素",
    englishName: "involved_elements",
    meaning: "该步骤涉及的页面、区域和元素引用。",
  },
  step_results: {
    key: "step_results",
    chineseName: "结果分支",
    englishName: "step_results",
    meaning: "该步骤可能产生的成功、失败、阻塞、空状态或下一步分支集合。",
  },
  step_system_feedback: {
    key: "step_system_feedback",
    chineseName: "系统反馈",
    englishName: "system_feedback",
    meaning: "系统在该步骤或分支中向用户展示的响应、提示、状态或结果。",
  },
  branches: {
    key: "branches",
    chineseName: "结果",
    englishName: "branches",
    meaning: "该步骤可能产生的成功、失败、阻塞、空状态或下一步分支集合。",
  },
  branch: {
    key: "branch",
    chineseName: "结果",
    englishName: "branch",
    meaning: "该步骤的一个可能结果分支。",
  },
  branch_status: {
    key: "branch_status",
    chineseName: "分支状态",
    englishName: "branch_status",
    meaning: "该结果分支的状态类型，例如 success、error、blocked、empty 或 next_action。",
  },
  branch_description: {
    key: "branch_description",
    chineseName: "分支说明",
    englishName: "branch_description",
    meaning: "该结果分支发生的条件和业务含义说明。",
  },
  branch_system_feedback: {
    key: "branch_system_feedback",
    chineseName: "系统反馈",
    englishName: "system_feedback",
    meaning: "系统在该步骤或分支中向用户展示的响应、提示、状态或结果。",
  },
} as const;
