import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = async (req: Request) => {
  try {
    return await handlers.GET(req);
  } catch (error: unknown) {
    console.error("[Better-Auth GET Error]:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message, message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST = async (req: Request) => {
  try {
    return await handlers.POST(req);
  } catch (error: unknown) {
    console.error("[Better-Auth POST Error]:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message, message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
