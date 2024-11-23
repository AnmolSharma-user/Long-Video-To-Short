import { NextRequest } from "next/server";
import { progressTracker } from "@/lib/utils/progress";
import { getToken } from "next-auth/jwt";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const token = await getToken({ req });
    if (!token?.sub) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = token.sub;

    // Check if the request is a WebSocket upgrade request
    const { socket: ws, response } = await new Promise<any>((resolve) => {
      const upgrade = Reflect.get(req, "socket")?.server?.upgrade;
      if (!upgrade) {
        resolve({
          socket: null,
          response: new Response("WebSocket upgrade not supported", { status: 426 }),
        });
        return;
      }

      upgrade(req, {
        data: { userId },
        onUpgrade: (socket: any) => {
          resolve({ socket, response: null });
        },
      });
    });

    if (response) return response;
    if (!ws) return new Response("WebSocket upgrade failed", { status: 500 });

    // Set up WebSocket connection
    ws.on("message", async (message: string) => {
      try {
        const data = JSON.parse(message);

        switch (data.type) {
          case "subscribe":
            if (data.jobId) {
              // Subscribe to specific job updates
              const progress = progressTracker.getProgress(data.jobId);
              if (progress) {
                ws.send(JSON.stringify({ type: "progress", data: progress }));
              }

              progressTracker.onProgress((update) => {
                if (update.jobId === data.jobId) {
                  ws.send(JSON.stringify({ type: "progress", data: update }));
                }
              });
            } else {
              // Subscribe to all user's job updates
              progressTracker.onProgress((update) => {
                ws.send(JSON.stringify({ type: "progress", data: update }));
              });
            }
            break;

          case "unsubscribe":
            // Handle unsubscribe if needed
            break;

          default:
            ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
      }
    });

    ws.on("close", () => {
      // Clean up any subscriptions
      progressTracker.removeAllListeners();
    });

    return new Response(null, { status: 101 });
  } catch (error) {
    console.error("WebSocket connection error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// WebSocket message types
export interface WebSocketMessage {
  type: "subscribe" | "unsubscribe" | "progress" | "error";
  jobId?: string;
  data?: any;
  message?: string;
}

// Helper function to send WebSocket messages
export function sendMessage(ws: WebSocket, message: WebSocketMessage) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Helper function to handle WebSocket errors
export function handleWebSocketError(ws: WebSocket, error: Error) {
  console.error("WebSocket error:", error);
  sendMessage(ws, {
    type: "error",
    message: "An error occurred",
  });
}

// Helper function to validate job ownership
export function validateJobOwnership(jobId: string, userId: string): boolean {
  // Add your job ownership validation logic here
  return true; // Placeholder
}

// Helper function to parse WebSocket messages
export function parseMessage(data: string): WebSocketMessage {
  try {
    return JSON.parse(data);
  } catch {
    throw new Error("Invalid message format");
  }
}

// Helper function to handle WebSocket upgrades
export function handleUpgrade(req: NextRequest): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const upgrade = Reflect.get(req, "socket")?.server?.upgrade;
    if (!upgrade) {
      reject(new Error("WebSocket upgrade not supported"));
      return;
    }

    upgrade(req, {
      onUpgrade: (socket: WebSocket) => {
        resolve(socket);
      },
    });
  });
}