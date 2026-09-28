import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type FrontendRouteDefinition = {
  route_name: string;
  route_path: string;
  route_params: string[];
  route_target_component: string;
};

export type FrontendDirectoryEntry = {
  path: string;
  purpose: string;
};

export type FrontendCodeLogicItem = {
  target: string;
  logic_description: string;
};

export type FrontendEnvironmentVariable = {
  variable_name: string;
  variable_description: string;
  default_value: string;
};

export type FrontendDependency = {
  package_name: string;
  package_description: string;
};

export type FrontendInterfaceDefinition = {
  interface_name: string;
  interface_description: string;
};

export type FrontendImplementationContent = {
  version_summary: string;
  environment_variables: FrontendEnvironmentVariable[];
  route_definitions: FrontendRouteDefinition[];
  directory_structure: FrontendDirectoryEntry[];
  layout_library: string;
  component_library: string;
  dependency_package_management: FrontendDependency[];
  page_code_logic: FrontendCodeLogicItem[];
  frontend_interfaces: FrontendInterfaceDefinition[];
  diff: {
    added: unknown[];
    modified: unknown[];
    removed: unknown[];
  };
};

export type FrontendImplementation = VersionedDesignAsset<FrontendImplementationContent>;
