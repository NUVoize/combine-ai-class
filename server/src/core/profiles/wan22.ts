import type { ModelProfile } from '../types';
import { DEFAULT_VIDEO_STRUCTURE } from '../bases';

// WAN 2.2 (video), authored. Because the proven WAN wording IS the video base, WAN 2.2 is
// just the base with its name filled in. Resolving this reproduces the original
// geminiService strings verbatim (word counts 60-80 / 50-70 / 80-120, temps .7/.9, .7/.9, .8/.9).
// A model with bigger deltas (e.g. LTXV 2.3) would add a few overrides here, nothing more.

export const wan22: ModelProfile = {
  id: 'wan22',
  label: 'WAN 2.2',
  medium: 'video',
  modes: ['txt2vid'],
  defaultMode: 'txt2vid',
  needsVisionForImageInput: true,
  status: 'authored',
  notes:
    'Original also offered image upload, but only to caption an image and seed the scene, ' +
    'not true image-to-video. Kept as txt2vid.',
  recipes: {
    txt2vid: {
      extends: 'videoBase',
      modelName: 'WAN 2.2',
      structureSpec: DEFAULT_VIDEO_STRUCTURE,
    },
  },
};
