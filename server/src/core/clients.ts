// Model clients. One interface, two adapters: Anthropic for SFW, LM Studio for NSFW.
// The content mode decides which client the backend hands to the engine; the engine
// itself stays provider-agnostic. Keys never reach the browser; these run server-side.

export interface ImageInput {
  data: string; // base64, no data: prefix
  mimeType: string;
}

export interface CompletionRequest {
  system: string;
  prompt: string;
  temperature: number;
  json: boolean; // final stages ask for a JSON array; we parse tolerantly
  maxTokens?: number;
  images?: ImageInput[]; // for image-to-image and image captioning
}

export interface ModelClient {
  complete(req: CompletionRequest): Promise<string>;
}

// SFW path. Anthropic Messages API. System prompt is a top-level field, not a message.
export function anthropicClient(opts: { apiKey: string; model?: string }): ModelClient {
  const model = opts.model ?? 'claude-sonnet-4-6';
  return {
    async complete(req) {
      const content: unknown[] = [];
      for (const img of req.images ?? []) {
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: img.mimeType, data: img.data },
        });
      }
      content.push({ type: 'text', text: req.prompt });

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': opts.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: req.maxTokens ?? 1024,
          temperature: req.temperature,
          system: req.system,
          messages: [{ role: 'user', content }],
        }),
      });
      if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
      const data = await res.json();
      return (data.content ?? [])
        .filter((b: { type: string }) => b.type === 'text')
        .map((b: { text: string }) => b.text)
        .join('')
        .trim();
    },
  };
}

// NSFW path. LM Studio exposes an OpenAI-compatible endpoint. baseUrl points at the
// reachable instance (e.g. a RunPod box), not localhost, since the server calls it.
export function lmStudioClient(opts: { baseUrl: string; model: string; apiKey?: string }): ModelClient {
  const url = `${opts.baseUrl.replace(/\/$/, '')}/v1/chat/completions`;
  return {
    async complete(req) {
      const userContent: unknown[] = [{ type: 'text', text: req.prompt }];
      for (const img of req.images ?? []) {
        userContent.push({
          type: 'image_url',
          image_url: { url: `data:${img.mimeType};base64,${img.data}` },
        });
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(opts.apiKey ? { authorization: `Bearer ${opts.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: opts.model,
          temperature: req.temperature,
          max_tokens: req.maxTokens ?? 1024,
          messages: [
            { role: 'system', content: req.system },
            { role: 'user', content: req.images?.length ? userContent : req.prompt },
          ],
        }),
      });
      if (!res.ok) throw new Error(`LM Studio ${res.status}: ${await res.text()}`);
      const data = await res.json();
      return (data.choices?.[0]?.message?.content ?? '').trim();
    },
  };
}
