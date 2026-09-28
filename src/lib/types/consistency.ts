export type ConsistencyCheck = {
  status: "passed" | "warning" | "failed";
  items: ConsistencyCheckItem[];
};

export type ConsistencyCheckItem = {
  level: "info" | "warning" | "error";
  code: string;
  message: string;
  source: "blueprint" | "api_contract" | "db_model" | "context_pack";
};
