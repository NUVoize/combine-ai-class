import type {
  ModelProfile, ModeRecipe, StageRecipe, GenerationMode, BaseId, DeepPartial, StageId,
} from './types';
import { videoBase, imageT2IBase, editBase, DEFAULT_VIDEO_STRUCTURE } from './bases';

const BASES: Record<BaseId, ModeRecipe> = { videoBase, imageT2IBase, editBase };

// Default base for a generation mode, so stubs auto-extend the right one.
export function baseForMode(mode: GenerationMode): BaseId {
  switch (mode) {
    case 'txt2vid':
    case 'img2vid':
      return 'videoBase';
    case 'img2img':
      return 'editBase';
    case 'txt2img':
    default:
      return 'imageT2IBase';
  }
}

function mergeStage(base: StageRecipe, ov?: DeepPartial<StageRecipe>): StageRecipe {
  if (!ov) return base;
  return {
    system: {
      sfw: ov.system?.sfw ?? base.system.sfw,
      nsfw: ov.system?.nsfw ?? base.system.nsfw,
    },
    template: ov.template ?? base.template,
    minWords: ov.minWords ?? base.minWords,
    maxWords: ov.maxWords ?? base.maxWords,
    temperature: {
      sfw: ov.temperature?.sfw ?? base.temperature.sfw,
      nsfw: ov.temperature?.nsfw ?? base.temperature.nsfw,
    },
    output: ov.output ?? base.output,
  };
}

// Bake profile-level constants ({modelName}, {structureSpec}) into a template string,
// leaving runtime tokens for the engine.
function bakeConstants(tpl: string, modelName: string, structureSpec: string): string {
  return tpl
    .replace(/\{modelName\}/g, modelName)
    .replace(/\{structureSpec\}/g, structureSpec);
}

// Produce the final, ready-to-run recipe for one model + mode.
export function resolveRecipe(profile: ModelProfile, mode: GenerationMode): ModeRecipe {
  const config = profile.recipes[mode];
  if (!config) throw new Error(`${profile.id} has no config for mode ${mode}`);

  const base = BASES[config.extends];
  const structureSpec = config.structureSpec ?? DEFAULT_VIDEO_STRUCTURE;

  const stages: ModeRecipe['stages'] = {};
  const stageIds = Object.keys(base.stages) as StageId[];

  for (const id of stageIds) {
    const merged = mergeStage(base.stages[id]!, config.overrides?.stages?.[id]);
    stages[id] = {
      ...merged,
      system: {
        sfw: bakeConstants(merged.system.sfw, config.modelName, structureSpec),
        nsfw: bakeConstants(merged.system.nsfw, config.modelName, structureSpec),
      },
      template: bakeConstants(merged.template, config.modelName, structureSpec),
    };
  }
  return { stages };
}
