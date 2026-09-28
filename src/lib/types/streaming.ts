export type StreamModule =
  | "business_stories"
  | "blueprint"
  | "api_contract"
  | "db_model";

type StreamEventBase = {
  module: StreamModule;
  [key: string]: unknown;
};

export type StreamEvent =
  | (StreamEventBase & {
      type: "start";
      message: string;
    })
  | (StreamEventBase & {
      type: "delta";
      text: string;
    })
  | (StreamEventBase & {
      type: "raw_complete";
      text_length: number;
    })
  | (StreamEventBase & {
      type: "parsed";
      message: string;
    })
  | (StreamEventBase & {
      type: "saved";
      resource: unknown;
    })
  | (StreamEventBase & {
      type: "done";
      message: string;
    })
  | (StreamEventBase & {
      type: "error";
      code: string;
      status?: number;
      message: string;
    });

