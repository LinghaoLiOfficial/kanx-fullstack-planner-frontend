import type { BusinessRequirementFieldDefinition } from "@/lib/types/business-story";

export const BUSINESS_REQUIREMENT_FIELD_DEFINITIONS: BusinessRequirementFieldDefinition[] = [
  {
    key: "agile_business_requirements",
    name: "敏捷业务需求",
    englishName: "agile_business_requirements",
    meaning: "将原始需求拆解后形成的可迭代、可执行、可验收的业务需求故事集合",
  },
  {
    key: "requirement_overview",
    name: "需求总览",
    englishName: "requirement_overview",
    meaning: "对敏捷业务需求故事的汇总视图，用于快速查看数量、优先级和整体状态",
  },
  {
    key: "business_requirement_pool",
    name: "敏捷业务需求池",
    englishName: "business_requirement_pool",
    meaning: "",
  },
  {
    key: "business_requirement_story",
    name: "需求故事",
    englishName: "business_requirement_story",
    meaning: "业务需求池中的单条业务需求故事完整对象",
    parentKey: "business_requirement_pool",
  },
  {
    key: "requirement_name",
    name: "需求名称",
    englishName: "requirement_name",
    meaning: "业务需求故事的简短标题",
    parentKey: "business_requirement_story",
  },
  {
    key: "impact_scope",
    name: "影响范围",
    englishName: "impact_scope",
    meaning: "该业务需求故事可能影响的产品、前端、后端、数据库、API、UX、UI 或非代码资产范围",
    parentKey: "business_requirement_story",
  },
  {
    key: "user_story",
    name: "用户故事",
    englishName: "user_story",
    meaning: "以用户视角描述的需求目标，通常表达为“作为某类用户，我希望做某事，从而获得某种价值”",
    parentKey: "business_requirement_story",
  },
  {
    key: "business_scope",
    name: "业务范围",
    englishName: "business_scope",
    meaning: "该业务需求故事包含和不包含的业务边界",
    parentKey: "business_requirement_story",
  },
  {
    key: "included_scope",
    name: "包含的业务范围",
    englishName: "included_scope",
    meaning: "本业务需求故事明确覆盖的功能、规则或场景",
    parentKey: "business_scope",
  },
  {
    key: "excluded_scope",
    name: "不包含的业务范围",
    englishName: "excluded_scope",
    meaning: "本业务需求故事明确不处理的功能、规则或场景",
    parentKey: "business_scope",
  },
  {
    key: "execution_note",
    name: "执行说明",
    englishName: "execution_note",
    meaning: "执行该业务需求故事时需要注意的上下文、限制、依赖或操作说明",
    parentKey: "business_requirement_story",
  },
  {
    key: "data_rules",
    name: "数据规则",
    englishName: "data_rules",
    meaning: "该业务需求故事涉及的数据字段、限制、来源或校验规则",
    parentKey: "business_requirement_story",
  },
  {
    key: "acceptance_criteria",
    name: "验收标准",
    englishName: "acceptance_criteria",
    meaning: "该业务需求故事必须满足的可测试业务结果和完成条件",
    parentKey: "business_requirement_story",
  },
];

export const businessRequirementFieldDefinitionByKey = Object.fromEntries(
  BUSINESS_REQUIREMENT_FIELD_DEFINITIONS.map((item) => [item.key, item])
) as Record<
  BusinessRequirementFieldDefinition["key"],
  BusinessRequirementFieldDefinition
>;
