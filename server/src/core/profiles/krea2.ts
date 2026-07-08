import type { ModelProfile } from '../types';

// Krea 2 (image), authored from Krea's official guidance:
//   - https://github.com/krea-ai/krea-2/blob/main/docs/prompting.md
//   - https://github.com/krea-ai/krea-2/blob/main/docs/expansion.txt
// Krea 2 is Krea's own foundation image model (not SD/FLUX based). It reads NATURAL LANGUAGE,
// not keyword tags. Long, detailed single-paragraph prompts yield the best results, though it
// also works with minimal prompts. For literal in-image text, wrap the words in double quotes.
// It rewards clear but non-restrictive style direction and stays faithful to the stated medium.
//
// Only txt2img is exposed. Krea 2's image-reference features (style transfer, moodboards) are
// app-side controls inside Krea's own UI, not an instruction-based edit this tool writes prompt
// text for, so there is no honest img2img recipe to author here.
// Variant note: Krea 2 Large leans photoreal/raw (grain, motion blur, low dynamic range),
// Krea 2 Medium leans illustration/anime/painting. Variant choice happens in Krea, not the prompt.

const KREA_STRUCTURE =
  'Subject + Scene + Composition + Framing + Lighting + Mood + Medium/Style + Technical detail, ' +
  'written as ONE cohesive natural-language paragraph (never a comma-separated keyword tag list). ' +
  'Front-load the medium/style when it is stated. Wrap any literal in-image text in double quotes.';

export const krea2: ModelProfile = {
  id: 'krea2',
  label: 'Krea 2',
  medium: 'image',
  modes: ['txt2img'],
  defaultMode: 'txt2img',
  needsVisionForImageInput: false,
  status: 'authored',
  notes:
    'Authored from Krea official prompting.md + expansion.txt. Natural-language, single-paragraph ' +
    'prompts; quote literal in-image text. Style transfer / moodboards are Krea-app reference tools, ' +
    'not a prompt-text edit mode, so only txt2img is exposed. Large = photoreal/raw, Medium = ' +
    'illustration/painting; variant is chosen in Krea, not here.',
  recipes: {
    txt2img: {
      extends: 'imageT2IBase',
      modelName: 'Krea 2',
      structureSpec: KREA_STRUCTURE,
      overrides: {
        stages: {
          sceneCharacter: {
            system: {
              sfw:
                'You are an expert Krea 2 image-prompt writer. Krea 2 reads natural language, not ' +
                'keyword tags. Write vivid, grounded description in plain prose. Preserve every subject, ' +
                'action, color, and spatial relationship the user gives, and do not invent extra props, ' +
                'characters, or animals. Treat people with dignity; assume clothing covers intimate anatomy.',
              nsfw:
                'You are an expert Krea 2 adult image-prompt writer. Krea 2 reads natural language, not ' +
                'keyword tags. Write vivid, grounded description in plain prose using explicit, ' +
                'anatomically correct terms. Preserve every subject, action, color, and spatial ' +
                'relationship the user gives; do not invent extra elements. No vague euphemisms.',
            },
            template: `Write a single natural-language paragraph ({minWords}-{maxWords} words) describing the subject and scene for a Krea 2 image.

**Scene:** "{scene}"
**Visual style:** "{style}"

Cover, in flowing prose (not a tag list): who or what the subject is and their appearance, what they are doing, the setting around them, and how the shot is composed. Keep all stated colors, actions, and spatial relationships exactly. Do not add objects or characters the scene does not imply. If the scene names literal text to appear in the image, keep it and wrap it in double quotes.`,
            minWords: 45,
            maxWords: 90,
            temperature: { sfw: 0.7, nsfw: 0.85 },
            output: 'text',
          },
          final: {
            system: {
              sfw:
                'You are an expert Krea 2 image-prompt writer. Output natural-language prompts as single ' +
                'cohesive paragraphs, never keyword-tag lists. Honor the stated medium (photo, illustration, ' +
                'painting, 3D render, etc.) and do not pivot away from it. Give clear but non-restrictive ' +
                'style direction. Wrap any literal in-image text in double quotes. Output JSON only.',
              nsfw:
                'You are an expert Krea 2 adult image-prompt writer. Output natural-language prompts as single ' +
                'cohesive paragraphs, never keyword-tag lists. Use explicit, anatomically correct terms. Honor ' +
                'the stated medium and give clear but non-restrictive style direction. Output JSON only.',
            },
            template: `Generate 3 complete Krea 2 image prompts ({minWords}-{maxWords} words each) as a JSON array. Each item is {"title": string, "prompt": string}.

**Subject & scene:** "{actionDescription}"
**Framing / perspective:** "{cameraAngle}"
**Lighting:** "{lighting}"
**Lens / medium / technical:** "{cameraDevice}"

Write each prompt as ONE cohesive natural-language paragraph following the Krea 2 structure:
{structureSpec}

Weave the framing, lighting, and lens/medium details into the prose naturally rather than appending them as tags. Keep the subject, colors, actions, and spatial relationships faithful to the description above. Krea 2 surfaces variety, so make the 3 prompts three distinct aesthetic directions for the same subject (for example a photoreal take, a stylized or illustrated take, and a bolder art-directed take), each with a short evocative title. Wrap any literal in-image text in double quotes.`,
            minWords: 55,
            maxWords: 120,
            temperature: { sfw: 0.8, nsfw: 0.9 },
            output: 'json',
          },
        },
      },
    },
  },
};
