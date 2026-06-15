import type { ModelProfile, Medium, GenerationMode, ModeConfig } from './types';
import { baseForMode } from './resolver';
import { wan22 } from './profiles/wan22';

// Single source of truth for the model dropdown. Stubs carry correct capabilities now and
// auto-extend the right base, so an unauthored model already runs the best-possible base.
// Recipe deltas are authored later from each model's real prompt guidance, not from memory.

function stub(
  id: string, label: string, medium: Medium, modes: GenerationMode[], notes: string,
): ModelProfile {
  const recipes: Partial<Record<GenerationMode, ModeConfig>> = {};
  for (const mode of modes) {
    recipes[mode] = { extends: baseForMode(mode), modelName: label };
  }
  return {
    id, label, medium, modes,
    defaultMode: modes[0],
    needsVisionForImageInput: modes.some((m) => m === 'img2img' || m === 'img2vid'),
    recipes,
    status: 'stub',
    notes,
  };
}

// VERIFY = capability or exact name to confirm before authoring.
const VIDEO_MODELS: ModelProfile[] = [
  wan22,
  stub('wan25', 'WAN 2.5', 'video', ['txt2vid'],
    'VERIFY: "WAN2.5-6" - one model (2.5), two (2.5 and 2.6), or a range? Also verify i2v.'),
  stub('veo3', 'Veo 3', 'video', ['txt2vid'], 'VERIFY: Veo 3, likely i2v capable.'),
  stub('kling30', 'Kling 3.0', 'video', ['txt2vid'], 'VERIFY: Kling 3.0, strong i2v, likely add img2vid.'),
  stub('seedance20', 'Seedance 2.0', 'video', ['txt2vid'], 'VERIFY: ByteDance Seedance 2.0 exact name + i2v.'),
  stub('ltxv23', 'LTX Video 2.3', 'video', ['txt2vid'], 'VERIFY: Lightricks LTXV 2.3 exact name + i2v.'),
];

const IMAGE_MODELS: ModelProfile[] = [
  stub('sd15', 'Stable Diffusion 1.5', 'image', ['txt2img', 'img2img'], 'VERIFY: expose img2img?'),
  stub('flux1dev', 'FLUX.1 dev', 'image', ['txt2img'], 'VERIFY: base is t2i; editing is a separate Kontext model.'),
  stub('flux2dev', 'FLUX.2 dev', 'image', ['txt2img', 'img2img'], 'VERIFY: FLUX.2 dev edit capability + exact name.'),
  stub('flux2klein9b', 'FLUX.2 Klein 9B', 'image', ['txt2img'], 'VERIFY: exact name + does it edit?'),
  stub('qwen2509', 'Qwen-Image 2509', 'image', ['txt2img'], 'VERIFY: Qwen version naming + which are edit models.'),
  stub('qwen2511', 'Qwen-Image 2511', 'image', ['txt2img', 'img2img'], 'VERIFY: is this the edit-capable Qwen entry?'),
  stub('qwen2512', 'Qwen-Image 2512', 'image', ['txt2img', 'img2img'], 'VERIFY: is this the edit-capable Qwen entry?'),
  stub('imageZTurbo', 'Image Z Turbo', 'image', ['txt2img'], 'VERIFY: exact model name + source.'),
  stub('nanoBanana', 'Nano Banana', 'image', ['txt2img', 'img2img'],
    'Primarily an edit/i2i model: the worked example for the i2i recipe shape. VERIFY vision routing (SFW vision on Anthropic, NSFW vision on LM Studio).'),
];

export const MODELS: ModelProfile[] = [...VIDEO_MODELS, ...IMAGE_MODELS];

export const getModelsByMedium = (medium: Medium) => MODELS.filter((m) => m.medium === medium);
export const getProfile = (id: string) => MODELS.find((m) => m.id === id);
export const getMedia = (): Medium[] => ['image', 'video'];
