// The engine. Resolves a model's recipe, walks the staged chain, threads each stage's
// output into the next, and returns the final prompt variations. Provider-agnostic: the
// caller passes whichever ModelClient the content mode selected.

import type { ModelProfile, GenerationMode, ContentMode } from './types';
import { resolveRecipe } from './resolver';
import { getChain, renderTemplate } from './pipelines';
import type { ModelClient, ImageInput } from './clients';

export interface PromptResult {
  title: string;
  prompt: string;
}

export interface RunOptions {
  mode: GenerationMode;
  content: ContentMode;
  client: ModelClient;
  // Runtime values for template tokens: scene, style, protagonistAction, cameraAngle,
  // cameraMovement, lighting, cameraDevice, keep, change, editInstruction, etc.
  inputs: Record<string, string>;
  images?: ImageInput[]; // fed to the first stage (image-to-image, image-seeded scene)
  onStage?: (label: string, index: number, total: number) => void;
}

// Tolerant JSON array extraction: strips code fences and grabs the outermost [ ... ].
function extractJsonArray<T>(text: string): T {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(slice) as T;
}

export async function runPipeline(profile: ModelProfile, opts: RunOptions): Promise<PromptResult[]> {
  const recipe = resolveRecipe(profile, opts.mode);
  const chain = getChain(profile.medium, opts.mode);
  const vars: Record<string, string | number> = { ...opts.inputs };

  for (let i = 0; i < chain.length; i++) {
    const step = chain[i];
    const stage = recipe.stages[step.stage];
    if (!stage) throw new Error(`${profile.id}:${opts.mode} is missing stage "${step.stage}"`);

    opts.onStage?.(step.label, i + 1, chain.length);

    const body = renderTemplate(stage.template, {
      ...vars,
      minWords: stage.minWords,
      maxWords: stage.maxWords,
    });

    const out = await opts.client.complete({
      system: stage.system[opts.content],
      prompt: body,
      temperature: stage.temperature[opts.content],
      json: stage.output === 'json',
      maxTokens: stage.output === 'json' ? 2048 : 512,
      images: i === 0 ? opts.images : undefined,
    });

    if (stage.output === 'json') {
      const parsed = extractJsonArray<PromptResult[]>(out);
      if (!Array.isArray(parsed)) throw new Error('Final stage did not return a JSON array.');
      return parsed;
    }

    if (step.outVar) vars[step.outVar] = out.trim();
  }

  throw new Error('Pipeline finished without a terminal JSON stage.');
}
