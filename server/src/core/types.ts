// Core types. One shared shape; every model is data, not code.
//
// Four orthogonal switches drive the tool, all read from config:
//   medium      image | video         -> picks the pipeline shape
//   model       wan22, ltxv23, ...    -> picks a base recipe + this model's thin override
//   generation  txt2img/img2img/...   -> picks which recipe within the model
//   content     sfw | nsfw            -> picks the backend route + instruction flavor
//
// Quality model: a strong shared BASE recipe per (medium, mode), plus a small per-model
// OVERRIDE expressing only what differs. A model may override a single word count or an
// entire stage. Improving a base lifts every model that extends it; an unauthored model
// still runs the best-possible base rather than nothing.

export type Medium = 'image' | 'video';
export type GenerationMode = 'txt2img' | 'img2img' | 'txt2vid' | 'img2vid';
export type ContentMode = 'sfw' | 'nsfw';

export interface ContentVariant<T> { sfw: T; nsfw: T; }
export type Instruction = ContentVariant<string>;

export type StageId = 'sceneCharacter' | 'motion' | 'final' | 'edit';

// One stage of a recipe. Model-specific wording lives here, never hardcoded in shared logic.
export interface StageRecipe {
  system: Instruction;
  // Body template. {modelName} and {structureSpec} are baked in at resolve time;
  // runtime tokens ({scene}, {minWords}, ...) are filled by the pipeline engine.
  // The token regex matches word characters only, so literal JSON braces survive.
  template: string;
  minWords: number;
  maxWords: number;
  temperature: ContentVariant<number>;
  output: 'text' | 'json';
}

export interface ModeRecipe { stages: Partial<Record<StageId, StageRecipe>>; }

// Identifies which shared base a model's mode extends.
export type BaseId = 'videoBase' | 'imageT2IBase' | 'editBase';

// Recursive partial, for expressing only the delta from a base.
export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

// One model's configuration for one generation mode: which base, its display name,
// optional structure line, and any deeper overrides.
export interface ModeConfig {
  extends: BaseId;
  modelName: string;          // fills {modelName} in the base templates
  structureSpec?: string;     // fills {structureSpec} when the base uses it
  overrides?: DeepPartial<ModeRecipe>;
}

export interface ModelProfile {
  id: string;
  label: string;
  medium: Medium;
  modes: GenerationMode[];
  defaultMode: GenerationMode;
  needsVisionForImageInput: boolean;
  recipes: Partial<Record<GenerationMode, ModeConfig>>;
  status: 'authored' | 'stub';
  notes?: string;
}
