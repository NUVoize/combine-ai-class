import express, { type Request, type Response } from 'express';
import cors from 'cors';

import { config } from './config';
import { getUserId } from './auth';
import { getTier, consumeUsage, refundUsage } from './entitlements';
import { clientForContent } from './llm';
import { runPipeline } from './core/engine';
import { getProfile, MODELS } from './core/registry';
import type { ContentMode, GenerationMode } from './core/types';

const app = express();
app.use(cors({ origin: config.allowedOrigin }));
app.use(express.json({ limit: '15mb' })); // base64 images can be large

app.get('/healthz', (_req, res) => res.json({ ok: true }));

// UI-safe model list for the dropdowns. Note: recipe text is intentionally NOT included,
// so your prompts never reach the browser.
app.get('/api/prompt-helper/models', (_req, res) => {
  res.json(
    MODELS.map((m) => ({
      id: m.id,
      label: m.label,
      medium: m.medium,
      modes: m.modes,
      defaultMode: m.defaultMode,
      needsVisionForImageInput: m.needsVisionForImageInput,
      status: m.status,
    })),
  );
});

const VALID_MODES: GenerationMode[] = ['txt2img', 'img2img', 'txt2vid', 'img2vid'];

app.post('/api/prompt-helper/generate', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated.' });

  const { modelId, mode, content, inputs, images } = req.body ?? {};

  if (typeof modelId !== 'string') return res.status(400).json({ error: 'modelId is required.' });
  if (!VALID_MODES.includes(mode)) return res.status(400).json({ error: 'Invalid mode.' });
  if (content !== 'sfw' && content !== 'nsfw') return res.status(400).json({ error: 'content must be sfw or nsfw.' });
  if (typeof inputs !== 'object' || inputs === null) return res.status(400).json({ error: 'inputs object is required.' });

  const profile = getProfile(modelId);
  if (!profile) return res.status(404).json({ error: `Unknown model: ${modelId}` });
  if (!profile.modes.includes(mode)) {
    return res.status(400).json({ error: `${profile.label} does not support ${mode}.` });
  }

  const tier = await getTier(userId);
  const meter = await consumeUsage(userId, tier);
  if (!meter.allowed) {
    if (tier === 'none') return res.status(403).json({ error: 'No active plan includes the prompt helper.' });
    return res.status(429).json({ error: 'Daily limit reached for your plan.', used: meter.used, cap: meter.cap });
  }

  try {
    const client = clientForContent(content as ContentMode);
    const prompts = await runPipeline(profile, {
      mode: mode as GenerationMode,
      content: content as ContentMode,
      client,
      inputs: inputs as Record<string, string>,
      images: Array.isArray(images) ? images : undefined,
    });
    res.json({ prompts, usage: { tier: meter.tier, used: meter.used, cap: meter.cap } });
  } catch (err) {
    await refundUsage(userId, tier); // a failed call should not cost a credit
    const message = err instanceof Error ? err.message : 'Generation failed.';
    console.error('[generate] error:', message);
    res.status(502).json({ error: message });
  }
});

app.listen(config.port, () => {
  console.log(`prompt-helper server listening on :${config.port}`);
});
