import { createConnection } from "node:net";

const DEFAULT_TIMEOUT_MS = 15_000;

export class HerdrError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "HerdrError";
  }
}

const resolveSocketPath = (): string => {
  if (process.env.HERDR_SOCKET_PATH) return process.env.HERDR_SOCKET_PATH;

  return `${process.env.HOME ?? ""}/.config/herdr/herdr.sock`;
};

interface RpcEnvelope {
  readonly result?: unknown;
  readonly error?: { readonly code: string; readonly message: string };
}

export const send = (method: string, params: Record<string, unknown>): Promise<unknown> =>
  new Promise((resolve, reject) => {
    let socket: ReturnType<typeof createConnection>;
    try {
      socket = createConnection(resolveSocketPath());
    } catch (err) {
      reject(err);
      return;
    }

    let buffer = "";
    let settled = false;
    const timer = setTimeout(
      () => finish(() => reject(new HerdrError("timeout", `herdr '${method}' timed out`))),
      DEFAULT_TIMEOUT_MS,
    );

    const finish = (action: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      action();
    };

    socket.on("connect", () => {
      socket.write(`${JSON.stringify({ id: `priority-view:${method}`, method, params })}\n`);
    });

    socket.on("data", (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const newline = buffer.indexOf("\n");
      if (newline === -1) return;

      finish(() => {
        let parsed: RpcEnvelope;
        try {
          parsed = JSON.parse(buffer.slice(0, newline));
        } catch {
          reject(new HerdrError("parse_error", `unparseable response from '${method}'`));
          return;
        }

        if (parsed.error) {
          reject(new HerdrError(parsed.error.code, parsed.error.message));
          return;
        }

        resolve(parsed.result);
      });
    });

    socket.on("error", (err) => finish(() => reject(err)));
  });
