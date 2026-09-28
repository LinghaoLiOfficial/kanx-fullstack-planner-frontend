import type { Project } from "@/lib/types/project";

type ProjectTechStackFields = Pick<
  Project,
  "target_stacks_configured" | "target_frontend_stack_items" | "target_backend_stack_items"
>;

export function isProjectTechStackConfigured(project: ProjectTechStackFields) {
  return (
    project.target_stacks_configured ||
    Boolean(project.target_frontend_stack_items?.length) ||
    Boolean(project.target_backend_stack_items?.length)
  );
}
