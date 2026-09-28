import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type DbModelDraft = {
  id: string;
  project_id: string;
  blueprint_id: string;
  version: number;
  is_current?: boolean;
  title: string;
  summary: string;
  content: DbModelContent;
  created_at: string;
  updated_at: string;
};

export type VersionedDbModel = VersionedDesignAsset<DbModelContent>;

export type NewDbModelContent = {
  database?: {
    engine?: string;
    orm?: string;
    migration_tool?: string;
  };
  database_tables: DatabaseTable[];
  relationships?: DbRelationship[];
  indexes?: DbIndex[];
  migration_notes?: string[];
  diff?: unknown;
  [key: string]: unknown;
};

export type LegacyDbModelContent = {
  database?: {
    engine?: string;
    orm?: string;
    migration_tool?: string;
  };
  entities?: DbEntity[];
  relationships?: DbRelationship[];
  indexes?: DbIndex[];
  migration_notes?: string[];
  api_field_mappings?: unknown;
  diff?: unknown;
  [key: string]: unknown;
};

export type DbModelContent = NewDbModelContent | LegacyDbModelContent;

export type DatabaseTable = {
  name: string;
  table_name?: string;
  description?: string;
  fields: DatabaseField[];
  relationships?: DbRelationship[];
  indexes?: DbIndex[];
  migration_notes?: string[];
};

export type DbEntity = {
  name: string;
  table_name?: string;
  description?: string;
  fields: DatabaseField[];
  relationships?: DbRelationship[];
};

export type DatabaseField = {
  name: string;
  type: string;
  primary_key?: boolean;
  nullable?: boolean;
  required?: boolean;
  description?: string;
};

export type DbField = DatabaseField;

export type DbRelationship = {
  from?: string;
  to?: string;
  field?: string;
  target?: string;
  type: string;
  description?: string;
};

export type DbIndex = {
  table: string;
  fields: string[];
  reason?: string;
};

export function isNewDbModelContent(content: DbModelContent): content is NewDbModelContent {
  return "database_tables" in content;
}
