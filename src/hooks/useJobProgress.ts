import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import type { ProgressUpdate, ProcessingStage } from "@/lib/utils/progress";

interface UseJobProgressOptions {
  jobId?: string;
  onProgress?: (update: ProgressUpdate) => void;
  onComplete?: (update: ProgressUpdate) => void;
  onError?: (error: Error) => void;
}

interface FormattedProgress {
  stage: ProcessingStage;
  percentage: number;
  message: string;
  formattedMessage: string;
}

export function useJobProgress({
  jobId,
  onProgress,
  onComplete,
  onError,
}: UseJobProgressOptions = {}) {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!session?.user?.id) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/jobs/ws`);

    ws.onopen = () => {
      setIsConnected(true);
      // Subscribe to job updates
      ws.send(
        JSON.stringify({
          type: "subscribe",
          jobId,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case "progress":
            const update = message.data as ProgressUpdate;
            setProgress(update);
            onProgress?.(update);

            if (update.stage === "completed") {
              onComplete?.(update);
            } else if (update.stage === "failed") {
              onError?.(new Error(update.error || "Processing failed"));
            }
            break;

          case "error":
            toast({
              title: "Error",
              description: message.message,
              variant: "destructive",
            });
            onError?.(new Error(message.message));
            break;

          default:
            console.warn("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;

      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      onError?.(new Error("WebSocket connection error"));
    };

    wsRef.current = ws;

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [session?.user?.id, jobId, onProgress, onComplete, onError]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      if (cleanup) cleanup();
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  const getFormattedProgress = useCallback((): FormattedProgress | null => {
    if (!progress) return null;

    const { stage, progress: percentage, message } = progress;
    return {
      stage,
      percentage,
      message: message || "",
      formattedMessage: message || `${stage} (${Math.round(percentage)}%)`,
    };
  }, [progress]);

  return {
    isConnected,
    progress,
    formattedProgress: getFormattedProgress(),
    disconnect,
  };
}