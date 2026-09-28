"use client";

import { useEffect, useRef, useState } from "react";
import { CircleStop, Sparkles } from "lucide-react";

import { StreamingOutputViewer } from "@/components/common/StreamingOutputViewer";
import { Button } from "@/components/ui/button";
import type { StreamEvent } from "@/lib/types/streaming";

type StreamRunner = (options: {
  onEvent: (event: StreamEvent) => void;
  signal: AbortSignal;
}) => Promise<void>;

type StreamingGenerationPanelProps = {
  buttonLabel: string;
  loadingLabel: string;
  successLabel?: string;
  outputTitle?: string;
  disabled?: boolean;
  showOutput?: boolean;
  size?: "default" | "sm";
  variant?: "default" | "outline" | "secondary";
  className?: string;
  runStream: StreamRunner;
  onSaved?: (event: Extract<StreamEvent, { type: "saved" }>) => Promise<void> | void;
  onDone?: () => Promise<void> | void;
  formatError?: (error: unknown) => string;
};

function getEventMessage(event: StreamEvent) {
  if ("message" in event && typeof event.message === "string") {
    return event.message;
  }

  if (event.type === "raw_complete") {
    return `原始内容接收完成，共 ${event.text_length} 字符。`;
  }

  if (event.type === "saved") {
    return "生成结果已保存。";
  }

  return null;
}

export function StreamingGenerationPanel({
  buttonLabel,
  loadingLabel,
  successLabel = "生成完成。",
  outputTitle,
  disabled = false,
  showOutput = true,
  size = "default",
  variant = "default",
  className,
  runStream,
  onSaved,
  onDone,
  formatError,
}: StreamingGenerationPanelProps) {
  const abortRef = useRef<AbortController | null>(null);
  const savedRef = useRef(false);
  const doneRef = useRef(false);
  const streamErrorRef = useRef(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const appendMessage = (message: string) => {
    setMessages((current) => [...current, message]);
  };

  const showError = (errorValue: unknown) => {
    const message = formatError
      ? formatError(errorValue)
      : errorValue instanceof Error
        ? errorValue.message
        : "生成失败，请稍后重试。";
    streamErrorRef.current = true;
    setError(message);
    appendMessage(message);
  };

  const handleEvent = async (event: StreamEvent) => {
    if (event.type === "delta") {
      setOutput((current) => `${current}${event.text}`);
      return;
    }

    if (event.type === "error") {
      streamErrorRef.current = true;
      setError(event.message);
      appendMessage(event.message);
      return;
    }

    const message = getEventMessage(event);

    if (message) {
      appendMessage(message);
    }

    if (event.type === "saved") {
      savedRef.current = true;
      await onSaved?.(event);
    }

    if (event.type === "done") {
      doneRef.current = true;
      setDone(true);
      if (!savedRef.current) {
        await onDone?.();
      }
    }
  };

  const handleStart = async () => {
    const controller = new AbortController();
    abortRef.current = controller;
    savedRef.current = false;
    doneRef.current = false;
    streamErrorRef.current = false;
    setRunning(true);
    setOutput("");
    setMessages([]);
    setError(null);
    setDone(false);

    try {
      await runStream({
        signal: controller.signal,
        onEvent: (event) => {
          void handleEvent(event).catch(showError);
        },
      });

      if (!controller.signal.aborted && !streamErrorRef.current) {
        setDone(true);
        if (!doneRef.current) {
          appendMessage(successLabel);
        }

        if (!savedRef.current && !doneRef.current) {
          await onDone?.();
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("已取消生成。");
        appendMessage("已取消生成。");
      } else {
        showError(err);
      }
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size={size} variant={variant} onClick={() => void handleStart()} disabled={disabled || running}>
          <Sparkles className="size-4" />
          {running ? loadingLabel : buttonLabel}
        </Button>
        {running ? (
          <Button type="button" size={size} variant="outline" onClick={handleCancel}>
            <CircleStop className="size-4" />
            取消生成
          </Button>
        ) : null}
      </div>
      {showOutput && (running || output || messages.length || error || done) ? (
        <StreamingOutputViewer
          className="mt-4"
          title={outputTitle}
          output={output}
          messages={messages}
          error={error}
          running={running}
          done={done}
        />
      ) : null}
    </div>
  );
}
