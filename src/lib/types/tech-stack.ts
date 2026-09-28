export type TechStackType =
  | "framework"
  | "language"
  | "ui_library"
  | "package_manager"
  | "database"
  | "orm"
  | "migration_tool"
  | "runtime"
  | "build_tool";

export type TechStackItem = {
  name: string;
  type: TechStackType;
  tags?: string[];
  role?: string | null;
};
