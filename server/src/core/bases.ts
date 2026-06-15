import type { ModeRecipe } from './types';

// Shared base recipes. videoBase is grounded in the proven WAN prompter (the version that
// got good reviews), with the model name pulled out into a {modelName} token so it is no
// longer hardcoded. Image bases are structural scaffolds to be authored from each image
// model's real prompt guidance, not from memory.

// Reused explicit-mode instructions (already model-neutral in the original).
const NSFW_SCENE =
  'You are an expert adult content video prompt writer. Use explicit, anatomically precise ' +
  'terminology. Describe bodies, actions, and sensations with maximum detail and clarity. ' +
  'Never use vague euphemisms - use proper anatomical terms and explicit action verbs.';
const NSFW_MOTION =
  'You are an expert adult content video prompt writer. THE ACTION IS THE MOST IMPORTANT ELEMENT. ' +
  'Describe exactly what is happening with explicit detail: specific body parts involved, precise ' +
  'movements, exact positions, and physical interactions. Use anatomically correct terms and ' +
  'explicit action verbs. Be extremely detailed and clear - no vague language or euphemisms.';
const NSFW_FINAL =
  'You are an expert adult content cinematographer. Create complete, explicit video prompts. ' +
  'PRIORITIZE THE ACTION - be extremely specific about what is happening physically. Use ' +
  'anatomically correct terms and explicit verbs. Describe the exact movements, positions, and ' +
  'physical interactions in detail. Output JSON only.';

export const videoBase: ModeRecipe = {
  stages: {
    sceneCharacter: {
      system: {
        sfw: 'You create {modelName} video prompts. Focus on precise subject and scene descriptions.',
        nsfw: NSFW_SCENE,
      },
      template: `Create a detailed subject and scene description ({minWords}-{maxWords} words) following {modelName} structure.

**Scene:** "{scene}"
**Visual Style:** "{style}"

Structure your description:
1. **Subject Description**: Describe the main subject/character in detail (who they are, appearance, clothing)
2. **Scene Setting**: Describe the environment and background (where this takes place, atmosphere)

Example: "A young woman in a red dress holding a glowing umbrella, in a bustling neon-lit city street at night"

Generate a vivid description following this structure.`,
      minWords: 60,
      maxWords: 80,
      temperature: { sfw: 0.7, nsfw: 0.9 },
      output: 'text',
    },
    motion: {
      system: {
        sfw: 'You create {modelName} video prompts. Focus on motion and character movement.',
        nsfw: NSFW_MOTION,
      },
      template: `Add motion details to this scene ({minWords}-{maxWords} words) following {modelName} structure.

**Scene Foundation:** "{refinedScene}"
**Action:** "{protagonistAction}"

Structure your description:
- **Motion & Character Action**: Describe how the character/subject moves and what they're doing
- Keep it dynamic and specific

Example: "slowly walking forward while looking over her shoulder, hair flowing in the wind"

Generate a vivid motion description.`,
      minWords: 50,
      maxWords: 70,
      temperature: { sfw: 0.7, nsfw: 0.9 },
      output: 'text',
    },
    final: {
      system: {
        sfw: 'You create {modelName} video prompts. Combine subject, scene, motion, camera work, and visual style.',
        nsfw: NSFW_FINAL,
      },
      template: `Generate 3 complete {modelName} video prompt variations ({minWords}-{maxWords} words each) as JSON. Each item has {"title": string, "prompt": string}.

**Scene with Action:** "{actionDescription}"
**Camera Angle:** "{cameraAngle}"
**Camera Movement:** "{cameraMovement}"
**Lighting:** "{lighting}"
**Camera/Device:** "{cameraDevice}"

{modelName} Structure:
{structureSpec}

**Example:** "A lone cowboy riding through a desert canyon, sunset lighting, drone tracking shot, cinematic grading"

Integrate camera angle and movement naturally into the narrative. Each variation should be complete and cinematic with a creative title.`,
      minWords: 80,
      maxWords: 120,
      temperature: { sfw: 0.8, nsfw: 0.9 },
      output: 'json',
    },
  },
};

// Default video structure line. WAN 2.2 uses exactly this, so its override need not change it.
export const DEFAULT_VIDEO_STRUCTURE =
  '[Subject] + [Scene] + [Motion] + [Camera Work] + [Visual Style/Lighting]';

// TODO author from real image-model guidance. Structural scaffold only.
export const imageT2IBase: ModeRecipe = {
  stages: {
    sceneCharacter: {
      system: {
        sfw: 'You create {modelName} image prompts. Focus on subject, composition, and visual style.',
        nsfw: NSFW_SCENE,
      },
      template: `TODO author for {modelName}. Build a static description ({minWords}-{maxWords} words): subject, composition, setting, lighting, lens, style.

**Scene:** "{scene}"
**Visual Style:** "{style}"`,
      minWords: 40,
      maxWords: 70,
      temperature: { sfw: 0.7, nsfw: 0.9 },
      output: 'text',
    },
    final: {
      system: {
        sfw: 'You create {modelName} image prompts. Combine subject, composition, lens, and visual style.',
        nsfw: NSFW_FINAL,
      },
      template: `TODO author for {modelName}. Generate 3 complete image prompt variations as JSON. Each item has {"title": string, "prompt": string}.

**Description:** "{actionDescription}"
**Camera Angle:** "{cameraAngle}"
**Lighting:** "{lighting}"
**Camera/Device:** "{cameraDevice}"

{modelName} structure: {structureSpec}`,
      minWords: 50,
      maxWords: 90,
      temperature: { sfw: 0.8, nsfw: 0.9 },
      output: 'json',
    },
  },
};

// Image-to-image: one short, reference-based stage. Per the user, i2i prompts are much
// shorter and reference the input image ("use image 1 for character, respect physicality"),
// rather than describing a scene from scratch. TODO author exact wording per edit model.
export const editBase: ModeRecipe = {
  stages: {
    edit: {
      system: {
        sfw:
          'You write concise {modelName} image-edit instructions. Reference the input image. ' +
          'Change only what is asked and preserve everything else (identity, physicality, composition).',
        nsfw:
          'You write concise, explicit {modelName} image-edit instructions. Reference the input image. ' +
          'Change only what is asked and preserve everything else. Use anatomically correct terms.',
      },
      template: `Write 3 short {modelName} edit instructions (each under {maxWords} words) as JSON. Each item has {"title": string, "prompt": string}.

Use the input image as the reference.
**Preserve from image 1:** "{keep}"
**Change:** "{change}"
**Intent:** "{editInstruction}"

Phrase each as a direct instruction that references image 1 for identity and physicality and states only the changes. Do not redescribe the whole scene.`,
      minWords: 8,
      maxWords: 60,
      temperature: { sfw: 0.6, nsfw: 0.85 },
      output: 'json',
    },
  },
};
