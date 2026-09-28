export type DatabaseModelFieldDefinition = {
  key: string;
  chineseName: string;
  englishName: string;
  meaning: string;
};

export const databaseModelFieldDefinitions = {
  database_model: {
    key: "database_model",
    chineseName: "数据库模型",
    englishName: "database_model",
    meaning: "",
  },
  database_tables: {
    key: "database_tables",
    chineseName: "数据表",
    englishName: "database_tables",
    meaning: "数据库中的业务表集合。",
  },
  database_table: {
    key: "database_table",
    chineseName: "表",
    englishName: "database_table",
    meaning: "一个数据库表定义。",
  },
  fields: {
    key: "fields",
    chineseName: "字段",
    englishName: "fields",
    meaning: "该数据表中的字段集合。",
  },
  field: {
    key: "field",
    chineseName: "字段",
    englishName: "field",
    meaning: "一个数据库字段定义。",
  },
} as const;

export const databaseModelLegacySections = [
  { key: "database", title: "数据库设置" },
  { key: "entities", title: "实体 / 表列表" },
  { key: "relationships", title: "关系定义" },
  { key: "indexes", title: "索引" },
  { key: "migration_notes", title: "迁移说明" },
  { key: "api_field_mappings", title: "API 字段映射" },
  { key: "diff", title: "版本差异" },
];
