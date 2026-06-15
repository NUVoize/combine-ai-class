import { config, assertNsfwConfigured } from './config';
import { anthropicClient, lmStudioClient, type ModelClient } from './core/clients';
import type { ContentMode } from './core/types';

// SFW goes to Anthropic (your key). NSFW goes to your LM Studio instance. This is the only
// place the routing decision lives; the engine just receives whichever client it gets.
export function clientForContent(content: ContentMode): ModelClient {
  if (content === 'nsfw') {
    assertNsfwConfigured();
    return lmStudioClient({
      baseUrl: config.lmStudio.baseUrl,
      model: config.lmStudio.model,
      apiKey: config.lmStudio.apiKey,
    });
  }
  return anthropicClient({ apiKey: config.anthropic.apiKey, model: config.anthropic.model });
}
