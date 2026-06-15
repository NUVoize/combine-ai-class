// Pipeline shapes. Owns "what stages exist, in what order, and how their outputs chain"
// (structural, shared by all models). Each ModelProfile owns "what each stage says".

import type { Medium, GenerationMode, StageId } from './types';

export type PipelineKey = `${Medium}:${GenerationMode}`;

// Ordered stages per medium + mode.
export const PIPELINES: Partial<Record<PipelineKey, StageId[]>> = {
  'video:txt2vid': ['sceneCharacter', 'motion', 'final'],
  'video:img2vid': ['sceneCharacter', 'motion', 'final'],
  'image:txt2img': ['sceneCharacter', 'final'],
  'image:img2img': ['edit'],
};

// A chain step wires one stage's text output into the next stage's named template variable.
// outVar omitted = this stage is terminal and returns JSON.
export interface ChainStep { stage: StageId; outVar?: string; label: string; }

export const CHAINS: Partial<Record<PipelineKey, ChainStep[]>> = {
  'video:txt2vid': [
    { stage: 'sceneCharacter', outVar: 'refinedScene', label: 'Scene & character' },
    { stage: 'motion', outVar: 'actionDescription', label: 'Action & motion' },
    { stage: 'final', label: 'Cinematic prompts' },
  ],
  'video:img2vid': [
    { stage: 'sceneCharacter', outVar: 'refinedScene', label: 'Scene & character' },
    { stage: 'motion', outVar: 'actionDescription', label: 'Action & motion' },
    { stage: 'final', label: 'Cinematic prompts' },
  ],
  'image:txt2img': [
    { stage: 'sceneCharacter', outVar: 'actionDescription', label: 'Subject & composition' },
    { stage: 'final', label: 'Image prompts' },
  ],
  'image:img2img': [
    { stage: 'edit', label: 'Edit instructions' },
  ],
};

export function getChain(medium: Medium, mode: GenerationMode): ChainStep[] {
  const chain = CHAINS[`${medium}:${mode}` as PipelineKey];
  if (!chain) throw new Error(`No chain defined for ${medium}:${mode}`);
  return chain;
}

// Fills {token} placeholders. Word-character tokens only, so literal JSON braces survive.
export function renderTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in vars ? String(vars[key]) : whole,
  );
}
