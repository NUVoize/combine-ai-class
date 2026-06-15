# AI Class, Master Course Plan

Working document. This is the single source of truth for how the course is structured, what goes in each purchasable level, and where every piece of content lives. The course name is still a placeholder (AI-class).

## The spine

The whole course teaches one thing: **character consistency**, getting the same identity from picture to picture, and later frame to frame. Everything else is just increasingly powerful roads to that destination:

1. **Foundations:** why consistency is hard at all (concept only).
2. **The cloud road:** easy, accessible, no special hardware. Good, but hits a ceiling.
3. **The local road:** harder, but where real control lives (your own models, datasets, LoRAs).
4. **Video:** the same principles extended into motion (built later).

That split maps cleanly onto purchase levels, which is what makes clean packaging possible.

## Packaging model (CONFIRMED)

Structure: **stacked tiers with a free foundation.** Confirmed.

- **Level 0, Foundations:** free. The hook. Pure concept, sells the rest.
- **Level 1, Cloud Path:** first paid tier (the "basic level" a buyer can purchase and feel complete).
- **Level 2, Local Path:** second paid tier. Buying it includes Level 1.
- **Level 3, Video:** future paid tier or top bundle. Includes everything below.

"Stacked" means a higher level contains everything beneath it, so there is never a half-owned lesson. A Level 1 buyer gets a complete, self-contained skill set and is never shown locked fragments of Level 2.

(Modular a la carte was considered and set aside. We are stacked.)

## Boundary contract (how we keep levels from tangling)

Four rules every lesson must obey, so each level delivers exactly what was paid for:

1. **Each level is complete on its own.** A buyer reaches a real, usable outcome without needing the next level.
2. **Lower levels never depend on higher ones.** Nothing in Level 1 requires owning Level 2.
3. **Advanced concepts are never half-introduced early.** We do not tease LoRAs inside the cloud tier. If it belongs to Level 2, it appears only in Level 2.
4. **Recaps bridge, they do not gate.** When a higher level builds on a lower idea, it gives a short recap so a jump-in buyer is not lost, but that recap never replaces the lower tier's value.

## Terminology (locked)

- **Training dataset:** the term for the set of images used to teach or guide a character. Used in BOTH paid levels. Level 1 teaches the quick version (what it is, how it works). Level 2 goes deep (per model type, captioning, balance). Same name, different depth, on purpose.
- **Reference dataset / control set:** reserved for its real technical meaning in the LoRA and ControlNet world (the SD control or reference set). We do NOT reuse "reference" for the Level 1 concept, to avoid colliding with this established term. It is taught in Level 2 where it actually applies.

---

## LEVEL 0, Foundations (FREE)

**Outcome:** the learner understands *why* getting the same character twice is genuinely hard, and why every later tool exists to solve it.
**Included:** concept only, no software, no hands-on.
**Deliberately NOT here:** any tool walkthrough, any prompting technique, anything that needs an account or a download.
**Status:** DRAFTED (in 00-foundations, pending em-dash cleanup and migration).

Lessons:
- 0.1 How AI image generation actually works (noise to image, not retrieval)
- 0.2 LLMs vs image models (same predict-and-sample brain, both stateless)
- 0.3 Every image is an island (no memory)
- 0.4 Seeds (what they do, why they will not lock a character)
- 0.5 Why the same character is so hard to get twice (the synthesis: text is a lossy handle on a face)

Plus: the course intro ("Before You Start"), which sets tone and positioning.

---

## LEVEL 1, The Cloud Path (first paid tier, the "Starter")

**Who it is for:** people who want to use accessible online models and get good results without diving deep into how AI works. The casual user or hobbyist, not the future power user (yet).
**Outcome:** use accessible online tools to do text-to-image and image-to-image, prompt well, and hold a character reference across scenes with minimal drift, while understanding exactly where this approach stops.
**Core techniques:** text-to-image, image-to-image, and prompting for character consistency (fighting character drift).
**Included:** online cloud tools only (Nano Banana and peers), prompting, the image-to-image character workflow, and an intro-level training dataset used as a base.
**Deliberately NOT here:** no local install, no GPU discussion, no LoRA, no RunPods. Those are Level 2.
**Design principle for this tier:** keep it small and simple, and state the limitations clearly and up front, not buried at the end. This is the smaller, less complicated road, sold honestly as exactly that.
**Prerequisite:** Level 0 concepts (free).

**Module 1A, The Model Landscape**
- 1.1 The three kinds of models: generation, edit, and hybrid (the distinction everyone confuses)
- 1.2 Tour of the cloud tools and how each one actually works
- 1.3 Why model choice matters for a given task

**Module 1B, Prompting Against Character Drift**
- 1.4 Prompting for identity: what text can and cannot carry (callback to 0.5)
- 1.5 What character drift is, and the prompting habits that fight it

**Module 1C, The Image-to-Image Character Workflow (intro level)**
- 1.6 Image-to-image: using a reference image to carry the character (the core move)
- 1.7 Building a small training dataset as a base, and generating new scenes from it
- 1.8 Fixing and holding identity with edit and hybrid models

**Module 1D, The Honest Ceiling**
- 1.9 Where the cloud path runs out of road (sets up Level 2 without teasing its mechanics)

---

## LEVEL 2, The Local Path (second paid tier, the "Pro")

**Outcome:** train and deploy your own LoRAs, build proper datasets, and run local pipelines with the judgement to know which tool fits which job.
**Included:** local models, hardware guidance, RunPods, datasets for training, LoRA training, img2img, advanced control.
**Deliberately NOT here:** video. That is Level 3.
**Prerequisite:** Level 1 (stacked). For jump-in buyers, Module 2A opens with a short recap of the cloud concepts it builds on.

**Module 2A, Why Local and the Landscape**
- 2.1 Why go local: control, freedom from limits, cost over time
- 2.2 The local model families and how they differ
- 2.3 Hardware reality: what each model tier actually demands
- 2.4 RunPods and rented GPUs for when your machine is not enough

**Module 2B, Datasets for Training**
- 2.5 Training datasets in depth: what really makes one good, building on the Level 1 intro
- 2.6 Building a proper dataset per model type
- 2.7 Captioning, balance, and the common dataset mistakes

**Module 2C, LoRA Deep Dive**
- 2.8 What a LoRA is and why it works
- 2.9 Training your first LoRA
- 2.10 The ups and the downs, honestly
- 2.11 The pollution factor: how a LoRA reshapes the base model
- 2.12 Why "bending" the model sometimes fights back

**Module 2D, Advanced Control and Judgement**
- 2.13 img2img: when and why to reach for it
- 2.14 Stacking LoRA and img2img together
- 2.15 When NOT to use a LoRA at all

---

## LEVEL 3, Video (future, top tier or bundle)

**Outcome:** carry a consistent character into motion, and direct full multi-clip scenes, not just isolated clips.
**Included:** video model landscape and requirements, frame-to-frame consistency, carrying your trained character into video, video datasets/LoRAs, and the cinema scene-craft layer (the author's edge), plus assembly.
**Deliberately NOT here:** nothing below it; this is the top tier and includes everything in Levels 0 to 2.
**Prerequisite:** Level 2 (stacked). Builds directly on the locked character from Module 2C.
**Status:** SKELETON DRAFTED (provisional, future tier). Tooling specifics left as fill because AI video moves fastest of all.

**Module 3A, The Video Landscape**
- 3.1 Why video is a harder problem (consistency across frames + temporal coherence)
- 3.2 The video model families (text-to-video, image-to-video, video-to-video)
- 3.3 Hardware and requirements for video (heavier than stills; rented GPUs again)

**Module 3B, Consistency in Motion**
- 3.4 Frame-to-frame drift, the new enemy (identity drift + temporal incoherence)
- 3.5 Carrying your character into video (image-to-video from a locked still; the core move)
- 3.6 Datasets and LoRAs for video (the spine again; most demanding, fastest-moving)

**Module 3C, The Cinema Layer (the author's edge; top-tier crown content)**
- 3.7 Thinking in scenes, not clips (the cinema mindset)
- 3.8 Breaking down a scene, shot by shot (the breakdown / shot list)
- 3.9 Preparing and generating a multi-clip scene (continuity discipline)
- 3.10 The scene builder (FLAGSHIP, inclusion UNDECIDED; placeholder lesson written)

**Module 3D, Assembly and the Honest Ceiling**
- 3.11 Assembling clips into a coherent scene (editing, continuity fixes)
- 3.12 The honest ceiling of AI video (and why the cinema craft outlasts the tools; closes the whole course)

---

## Cross-cutting threads (not their own modules)

**Credibility / positioning.** Two years of testing, close to a thousand LoRAs trained across all models. This is not a lesson, it is the reason to trust the course. It lives in marketing copy and is woven into lessons as "here is what we learned the hard way so you can skip it," never as a standalone module.

**One-on-one support.** Promised in the intro. Policy: included in the **top tier** as a baseline. Also available **a la carte** to anyone, but at full price with no bundle discount, so the pricing itself nudges people toward the top tier. Top-tier members who want extra one-on-one beyond what is included get a reduced rate. Exact included hours, session counts, and prices: TBD.

---

## Perks and tools (PROPOSED perk-to-tier stack)

These are value-adds layered on top of the lessons. They follow the same stacked rule as the levels: a higher tier inherits every perk beneath it. Everything here is PROPOSED and meant to be edited once level names and prices firm up. The cinema-based scene work is the standout, the one thing a competitor with no production background cannot fake, so it is treated as headline material rather than a bonus.

**1. Prompt helper app(s), in-platform, "use as much as you want."**
The recurring-value anchor. Living inside the platform and usable on demand is what makes a tier feel alive month after month instead of a one-time download. Proposed split: a basic or usage-capped version at Level 1 (Cloud), unlimited at the top tier. Tiering the same tool (basic vs unlimited) is one of the cleanest upsell levers available.

**2. Custom notes and workflows.**
Cheap to include, high perceived value. Attach each to the lesson it supports and let them ride across both paid levels. These reinforce the lessons rather than stand alone, so they fit the boundary contract without tangling tiers.

**3. Exclusive LoRAs.**
Belong with Level 2 (Local Path), because that is where the learner is actually taught to run one. Holding them here also keeps the boundary clean (no LoRA value leaks into the cloud tier). Dripping new LoRAs over time gives people a reason to stay subscribed.

**4. Scene preparation and breakdown (the cinema edge).**
Multi-clip scene planning, how to break a scene down shot by shot, what to generate, and how to generate it. Built directly on ten years working in cinema, this is the real professional background behind the course. This is the crown content and the single strongest marketing line. Proposed placement: seed it at the top of the current paid ladder, and let it headline Level 3 (Video) when that launches, since multi-clip planning is the natural bridge into motion.

**5. Scene builder (UNDECIDED, flagship candidate).**
Still on the fence about including it. The tradeoff: including it gives the top tier a signature "only COMBINE has this" tool that raises the ceiling and justifies the price, while holding it back protects it as a separate premium add-on or a later reveal so the crown jewel is not handed away inside a course price. Current lean: include it, but gate it to the very top tier and brand it as the flagship, so it lifts perceived value without diluting it. If it is still rough, soft-launch it as "coming to [top tier]" to build anticipation while it is finished. Decision: TBD.

**Tiering logic at a glance (proposed):**
- Level 1 (Cloud): prompt helper (basic/capped), lesson-attached notes and workflows.
- Level 2 (Local): everything above, plus exclusive LoRAs and the in-depth dataset and LoRA notes.
- Top tier: everything above, plus unlimited prompt helper, one-on-one support (already confirmed), scene prep and breakdown, and the scene builder if included.

Amounts, caps, and exact availability: TBD.

---

## Resolved decisions

1. **Packaging:** stacked tiers. CONFIRMED.
2. **Foundations:** free funnel. CONFIRMED.
3. **Terminology:** both paid levels use "training dataset" (Level 1 = quick explanation, Level 2 = in depth, per model). "Reference dataset / control set" stays reserved for its real LoRA and ControlNet meaning. CONFIRMED.
4. **One-on-one support:** top tier includes it; a la carte at full price (no discount) to push toward top tier; reduced rate for top-tier members who want extra. CONFIRMED (amounts TBD).

---

## Build status

- Level 0: COMPLETE. Intro + 5 lessons live in 00-foundations, em-dash-free.
- Level 1: COMPLETE (draft). All nine lessons written em-dash-free in 10-cloud-path: 1.1 model taxonomy, 1.2 cloud tools tour, 1.3 model choice, 1.4 prompting for identity, 1.5 character drift + habits, 1.6 image-to-image (text-to-image vs image-to-image, solution but not perfect), 1.7 base set / quick training dataset, 1.8 edit + hybrid fixes with the full end-to-end cloud workflow, 1.9 honest ceiling. Each carries fill-in markers for visuals, tool roster, walkthroughs, and video.
- Level 2: COMPLETE (draft). All fifteen lessons written em-dash-free in 20-local-path, across the four modules: 2A (2.1 why local, 2.2 model families, 2.3 hardware reality, 2.4 RunPods/rented GPUs), 2B (2.5 datasets in depth, 2.6 dataset per model, 2.7 captioning + balance), 2C (2.8 what a LoRA is, 2.9 training your first, 2.10 ups and downs, 2.11 pollution factor, 2.12 bending fights back), 2D (2.13 img2img local, 2.14 stacking LoRA + img2img, 2.15 when NOT to use a LoRA). Concept and structure written; technical specifics (hardware numbers, training settings, tool choices, war stories) left as [FILL LATER] for the author's real expertise. 2A opens with a jump-in recap per the boundary contract. Credibility thread (close to 1,000 LoRAs) woven into 2.5, 2.10, 2.11. "Control set / reference dataset" terminology introduced in its real meaning in 2.14.
- Level 3: SKELETON DRAFTED (provisional, future tier). All twelve lessons written em-dash-free in 30-video, across four modules: 3A (3.1 why video is harder, 3.2 video model families, 3.3 video hardware), 3B (3.4 frame-to-frame drift, 3.5 character into video, 3.6 video datasets/LoRAs), 3C the cinema layer (3.7 thinking in scenes, 3.8 scene breakdown, 3.9 multi-clip scene, 3.10 scene builder = FLAGSHIP/UNDECIDED placeholder), 3D (3.11 assembly + continuity, 3.12 honest ceiling, which also closes the whole course). Tooling specifics and the cinema craft itself left as [FILL LATER] for the author. 3.12 ties the full course spine together back to Lesson 0.5.
- Open fill-in: the named cloud tool roster (Level 1), the named video tool roster (Level 3), the scene builder include/hold-back decision, and all [FILL LATER] technical specifics, settings, hardware numbers, walkthroughs, war stories, and visuals across Levels 1, 2, and 3.
- Next logical step: the full course spine now exists end to end (Levels 0 to 3 drafted). From here it is production: lock the tool rosters, decide on the scene builder, and fill the [FILL LATER] slots with real detail, examples, and video.
