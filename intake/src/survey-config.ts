/* ============================================================
   COMBINE intake — question set (EN / RU)
   Edit freely. Every user-facing string is { en, ru }.
   IMPORTANT: option/row VALUES are the English string (opt.en).
   That means the email you receive is always in English, no matter
   which language the student filled the form in.

   Field types: text | email | textarea | select | radio | multi | scale | matrix
   ============================================================ */

export type Lang = 'en' | 'ru'
export type Loc = { en: string; ru: string }
export type Opt = { en: string; ru: string } // canonical value = en

export type Field =
  | { type: 'text' | 'email' | 'textarea'; key: string; q: Loc; hint?: Loc; required?: boolean; placeholder?: Loc }
  | { type: 'select' | 'radio'; key: string; q: Loc; hint?: Loc; required?: boolean; options: Opt[] }
  | { type: 'multi'; key: string; q: Loc; hint?: Loc; required?: boolean; options: Opt[] }
  | { type: 'scale'; key: string; q: Loc; hint?: Loc; required?: boolean; low: Loc; high: Loc }
  | { type: 'matrix'; key: string; q: Loc; hint?: Loc; low: Loc; high: Loc; rows: Opt[] }

export type Section = { id: string; eyebrow: Loc; title: Loc; sub?: Loc; fields: Field[] }

export const SELECT_PLACEHOLDER = '— select —'

// English labels used in the emailed summary (canonical)
export const SCALE_LABELS = ['Never heard of it', 'Total beginner', 'Some basics', 'Comfortable', 'I could teach it']
// Localized labels for on-screen tooltips
export const SCALE_LABELS_LOC: Record<Lang, string[]> = {
  en: SCALE_LABELS,
  ru: ['Не слышал(а) об этом', 'Совсем новичок', 'Кое-что знаю', 'Уверенно', 'Могу учить других'],
}

/* ---- misc UI strings ---- */
export const UI = {
  tag: { en: 'Class Intake', ru: 'Анкета для курса' },
  step: { en: 'Step', ru: 'Шаг' },
  complete: { en: '% complete', ru: '% готово' },
  introEyebrow: { en: 'Before we start', ru: 'Прежде чем начать' },
  h1pre: { en: 'Tell me what you', ru: 'Расскажите, что вы' },
  h1grad: { en: 'actually', ru: 'на самом деле' },
  h1post: { en: 'want to build.', ru: 'хотите создать.' },
  introP1: {
    en: 'AI is a huge field, and I don’t want to waste a single minute of your class teaching things you don’t need. This short questionnaire tells me what you already know, what you’re trying to make, and the gear you’re working with — so your sessions are built around you, not a generic syllabus.',
    ru: 'ИИ — огромная область, и я не хочу тратить ни минуты занятий на то, что вам не нужно. Эта короткая анкета покажет, что вы уже знаете, что хотите создавать и на каком железе работаете — чтобы занятия строились вокруг вас, а не под общий шаблон.',
  },
  introP2: {
    en: 'Seven quick parts, about 4 minutes. Be honest — there are no wrong answers.',
    ru: 'Семь коротких частей, около 4 минут. Отвечайте честно — неправильных ответов нет.',
  },
  meta1: { en: '≈ 4 minutes', ru: '≈ 4 минуты' },
  meta2: { en: '7 parts', ru: '7 частей' },
  meta3: { en: 'Sent straight to us', ru: 'Отправляется напрямую нам' },
  start: { en: 'Start →', ru: 'Начать →' },
  back: { en: '← Back', ru: '← Назад' },
  continue: { en: 'Continue →', ru: 'Продолжить →' },
  submit: { en: 'Submit my answers', ru: 'Отправить ответы' },
  sending: { en: 'Sending…', ru: 'Отправка…' },
  doneTitle: { en: 'Got it — thank you.', ru: 'Готово — спасибо!' },
  doneEmailed: {
    en: 'Your answers just landed in our inbox. We’ll go through them and get back to you at the email you gave, with a plan tailored to exactly what you want to build.',
    ru: 'Ваши ответы уже у нас в почте. Мы их изучим и свяжемся с вами по указанному email с планом, заточенным именно под то, что вы хотите создать.',
  },
  doneFallback: {
    en: 'Your answers are ready. To make 100% sure we receive them, tap the button below — it opens your email app with everything filled in, just hit send. (You can also just close this; we’ll usually still get it.)',
    ru: 'Ваши ответы готовы. Чтобы мы точно их получили, нажмите кнопку ниже — откроется ваше почтовое приложение с уже заполненным письмом, просто нажмите «Отправить». (Можно и просто закрыть — обычно письмо всё равно доходит.)',
  },
  close: { en: 'Close', ru: 'Закрыть' },
  sendEmail: { en: 'Send my answers by email →', ru: 'Отправить ответы по email →' },
  footer: { en: 'COMBINE · AI Education, Visuals, Growth', ru: 'COMBINE · Обучение ИИ, Визуал, Рост' },
  errAnswer: { en: 'Please answer:', ru: 'Пожалуйста, ответьте:' },
  errEmail: { en: 'Please enter a valid email so we can reply.', ru: 'Пожалуйста, введите корректный email, чтобы мы могли ответить.' },
  selectPlaceholder: { en: '— select —', ru: '— выберите —' },
} satisfies Record<string, Loc>

/* ---- helper to keep option lists compact ---- */
const o = (en: string, ru: string): Opt => ({ en, ru })

export const SECTIONS: Section[] = [
  {
    id: 'you',
    eyebrow: { en: 'Part 1 / 7', ru: 'Часть 1 / 7' },
    title: { en: 'You & your goal', ru: 'Вы и ваша цель' },
    sub: {
      en: 'The basics, so I know who I’m building this class around and how to reach you back.',
      ru: 'Основное — чтобы понимать, для кого строится курс, и как с вами связаться.',
    },
    fields: [
      { type: 'text', key: 'name', required: true, q: { en: 'Your name (or handle)', ru: 'Ваше имя (или ник)' }, placeholder: { en: 'e.g. Alex, or @alex_creates', ru: 'напр. Алекс или @alex_creates' } },
      { type: 'email', key: 'email', required: true, q: { en: 'Best email to reach you', ru: 'Ваш email для связи' }, placeholder: { en: 'you@email.com', ru: 'you@email.com' } },
      { type: 'text', key: 'contact_alt', q: { en: 'Discord / Telegram / IG (optional)', ru: 'Discord / Telegram / IG (необязательно)' }, placeholder: { en: '@handle — if you prefer chat over email', ru: '@ник — если удобнее в чате, а не по email' } },
      {
        type: 'multi', key: 'goals',
        q: { en: 'What do you want to create with AI?', ru: 'Что вы хотите создавать с помощью ИИ?' },
        hint: { en: 'Pick everything that applies — this is the single most useful answer for me.', ru: 'Отметьте всё подходящее — это самый полезный для меня ответ.' },
        options: [
          o('A consistent character / virtual influencer', 'Постоянный персонаж / виртуальный инфлюенсер'),
          o('Faceless brand persona / mascot', 'Безликий бренд-персонаж / маскот'),
          o('Fashion & product / e-commerce visuals', 'Мода и товары / визуал для e-commerce'),
          o('Logos & brand / graphic design', 'Логотипы и брендинг / графдизайн'),
          o('Adult / NSFW content', 'Контент для взрослых / NSFW'),
          o('Cinematic video / short films', 'Кинематографичное видео / короткометражки'),
          o('Music videos / motion', 'Клипы / моушн'),
          o('Memes & social content', 'Мемы и контент для соцсетей'),
          o('I just want to learn how this all works', 'Просто хочу понять, как всё это работает'),
        ],
      },
      {
        type: 'textarea', key: 'goal_sentence', required: true,
        q: { en: 'In one sentence: what do you want to walk away being able to do?', ru: 'Одним предложением: что вы хотите научиться делать?' },
        placeholder: { en: 'e.g. "Make the same influencer girl in any outfit and scene, on my own PC."', ru: 'напр. «Делать одну и ту же девушку-инфлюенсера в любой одежде и сцене, на своём ПК».' },
      },
      {
        type: 'radio', key: 'intent', q: { en: 'This is mainly for…', ru: 'В основном это для…' },
        options: [
          o('A personal project / hobby', 'Личного проекта / хобби'),
          o('Building a business / monetizing', 'Бизнеса / монетизации'),
          o('Content creation (Fanvue / OnlyFans / social)', 'Создания контента (Fanvue / OnlyFans / соцсети)'),
          o('Client or agency work', 'Работы с клиентами / агентства'),
          o('Just curious', 'Просто любопытно'),
        ],
      },
      {
        type: 'radio', key: 'timeline', q: { en: 'How urgent is it?', ru: 'Насколько это срочно?' },
        options: [
          o('Just exploring, no rush', 'Просто изучаю, без спешки'),
          o('Want to start within a month', 'Хочу начать в течение месяца'),
          o('ASAP — I have a project waiting', 'Как можно скорее — есть проект'),
        ],
      },
    ],
  },
  {
    id: 'setup',
    eyebrow: { en: 'Part 2 / 7', ru: 'Часть 2 / 7' },
    title: { en: 'Where you’ll run it', ru: 'Где вы будете это запускать' },
    sub: {
      en: 'Local, cloud, or rented GPUs. Most of my students go local with ComfyUI — but I’ll meet you wherever you are.',
      ru: 'Локально, в облаке или на арендованных GPU. Большинство моих учеников работают локально в ComfyUI — но я подстроюсь под вас.',
    },
    fields: [
      {
        type: 'radio', key: 'run_where', required: true,
        q: { en: 'Where do you want to run the tools?', ru: 'Где вы хотите запускать инструменты?' },
        options: [
          o('Local — on my own PC (ComfyUI etc.)', 'Локально — на своём ПК (ComfyUI и т.п.)'),
          o('Cloud web tools — no install', 'Облачные веб-инструменты — без установки'),
          o('Rented GPUs — RunPod / Vast', 'Аренда GPU — RunPod / Vast'),
          o('Not sure yet — help me decide', 'Ещё не знаю — помогите выбрать'),
        ],
      },
      {
        type: 'select', key: 'gpu',
        q: { en: 'What GPU do you have?', ru: 'Какая у вас видеокарта (GPU)?' },
        hint: { en: 'The number-one thing that decides which models you can run locally.', ru: 'Главный фактор того, какие модели вы сможете запускать локально.' },
        options: [
          o(SELECT_PLACEHOLDER, '— выберите —'),
          o('RTX 5090', 'RTX 5090'), o('RTX 5080', 'RTX 5080'), o('RTX 4090', 'RTX 4090'),
          o('RTX 4080 / 4070 Ti', 'RTX 4080 / 4070 Ti'), o('RTX 4070 / 4060', 'RTX 4070 / 4060'),
          o('RTX 3090 / 3090 Ti', 'RTX 3090 / 3090 Ti'), o('RTX 3080 / 3070', 'RTX 3080 / 3070'),
          o('RTX 3060 12GB', 'RTX 3060 12GB'), o('Other NVIDIA', 'Другая NVIDIA'),
          o('AMD GPU', 'GPU AMD'), o('Mac (Apple Silicon M-series)', 'Mac (Apple Silicon, серия M)'),
          o('Laptop GPU', 'GPU ноутбука'), o("I don't know / none yet", 'Не знаю / пока нет'),
        ],
      },
      {
        type: 'select', key: 'vram',
        q: { en: 'How much VRAM (video memory)?', ru: 'Сколько видеопамяти (VRAM)?' },
        hint: { en: 'Usually shown in Task Manager → GPU, or on the box. Guess if unsure.', ru: 'Обычно видно в Диспетчере задач → ГП, или на коробке. Если не уверены — прикиньте.' },
        options: [o(SELECT_PLACEHOLDER, '— выберите —'), o('24GB or more', '24 ГБ или больше'), o('16GB', '16 ГБ'), o('12GB', '12 ГБ'), o('8GB', '8 ГБ'), o('Less than 8GB', 'Меньше 8 ГБ'), o("Don't know", 'Не знаю')],
      },
      {
        type: 'select', key: 'ram',
        q: { en: 'System RAM?', ru: 'Оперативная память (RAM)?' },
        options: [o(SELECT_PLACEHOLDER, '— выберите —'), o('64GB or more', '64 ГБ или больше'), o('32GB', '32 ГБ'), o('16GB', '16 ГБ'), o('Less than 16GB', 'Меньше 16 ГБ'), o("Don't know", 'Не знаю')],
      },
      { type: 'radio', key: 'os', q: { en: 'Operating system?', ru: 'Операционная система?' }, options: [o('Windows', 'Windows'), o('Linux', 'Linux'), o('Mac', 'Mac'), o('Not sure', 'Не уверен(а)')] },
      {
        type: 'radio', key: 'comfy_exp',
        q: { en: 'Have you used ComfyUI (or A1111 / Forge) before?', ru: 'Пользовались ли вы ComfyUI (или A1111 / Forge)?' },
        options: [
          o('Yes, I use it regularly', 'Да, пользуюсь регулярно'),
          o('Installed it but got stuck', 'Установил(а), но застрял(а)'),
          o('No, but I’m ready to', 'Нет, но готов(а) начать'),
          o('What’s ComfyUI?', 'Что такое ComfyUI?'),
        ],
      },
    ],
  },
  {
    id: 'skills',
    eyebrow: { en: 'Part 3 / 7', ru: 'Часть 3 / 7' },
    title: { en: 'What you already know', ru: 'Что вы уже знаете' },
    sub: {
      en: 'Rate yourself honestly — 0 means “never heard of it”, 4 means “I could teach it”. This tells me exactly what to skip and where to spend time.',
      ru: 'Оцените себя честно: 0 — «не слышал(а) об этом», 4 — «могу учить других». Так я пойму, что пропустить, а на что потратить время.',
    },
    fields: [
      {
        type: 'matrix', key: 'skills',
        q: { en: 'How comfortable are you with each of these?', ru: 'Насколько уверенно вы владеете каждым пунктом?' },
        low: { en: '0 · new', ru: '0 · новичок' }, high: { en: '4 · expert', ru: '4 · эксперт' },
        rows: [
          o('Writing image prompts', 'Написание промптов для картинок'),
          o('Samplers / steps / CFG / negatives', 'Сэмплеры / шаги / CFG / негативы'),
          o('Seeds & getting a result twice', 'Сиды и повторяемость результата'),
          o('ComfyUI node graphs', 'Ноды и графы ComfyUI'),
          o('Checkpoints vs LoRAs vs embeddings', 'Чекпоинты vs LoRA vs эмбеддинги'),
          o('img2img & inpainting', 'img2img и inpainting'),
          o('ControlNet / IPAdapter / reference', 'ControlNet / IPAdapter / референсы'),
          o('Training your own LoRA', 'Обучение собственной LoRA'),
          o('Building datasets & captioning', 'Сбор датасетов и разметка (captioning)'),
          o('Local video generation (WAN / LTX…)', 'Локальная генерация видео (WAN / LTX…)'),
        ],
      },
    ],
  },
  {
    id: 'models',
    eyebrow: { en: 'Part 4 / 7', ru: 'Часть 4 / 7' },
    title: { en: 'Models you know', ru: 'Модели, которые вы знаете' },
    sub: {
      en: 'Which of these have you actually used, and which do you want to learn? No wrong answers — “none” is a perfectly good starting point.',
      ru: 'Что из этого вы реально пробовали и что хотите освоить? Неправильных ответов нет — «никакие» это тоже отличная точка старта.',
    },
    fields: [
      {
        type: 'multi', key: 'image_models_used',
        q: { en: 'Image models you’ve used', ru: 'Модели для картинок, которые вы использовали' },
        options: [o('SD 1.5', 'SD 1.5'), o('SDXL', 'SDXL'), o('Pony', 'Pony'), o('Illustrious / NoobAI', 'Illustrious / NoobAI'), o('Flux (dev / schnell)', 'Flux (dev / schnell)'), o('Flux Krea', 'Flux Krea'), o('Qwen-Image', 'Qwen-Image'), o('SD 3.5', 'SD 3.5'), o('HiDream', 'HiDream'), o('Midjourney', 'Midjourney'), o('DALL·E / other web', 'DALL·E / другие веб-сервисы'), o('None yet', 'Пока никакие')],
      },
      {
        type: 'multi', key: 'video_models_used',
        q: { en: 'Video models you’ve used', ru: 'Видео-модели, которые вы использовали' },
        options: [o('WAN 2.1 / 2.2', 'WAN 2.1 / 2.2'), o('LTX / LTXV', 'LTX / LTXV'), o('Hunyuan Video', 'Hunyuan Video'), o('Kling', 'Kling'), o('Runway', 'Runway'), o('Sora', 'Sora'), o('Stable Video Diffusion', 'Stable Video Diffusion'), o('None yet', 'Пока никакие')],
      },
      {
        type: 'textarea', key: 'models_wanted',
        q: { en: 'Which models or tools are you most curious to learn?', ru: 'Какие модели или инструменты вам больше всего интересно освоить?' },
        placeholder: { en: 'e.g. "Flux + Qwen for images, WAN for video" — or "no idea, that’s why I’m here".', ru: 'напр. «Flux + Qwen для картинок, WAN для видео» — или «без понятия, за этим и пришёл(шла)».' },
      },
    ],
  },
  {
    id: 'characters',
    eyebrow: { en: 'Part 5 / 7', ru: 'Часть 5 / 7' },
    title: { en: 'Characters, training & video', ru: 'Персонажи, обучение и видео' },
    sub: {
      en: 'This class is built around character consistency — the same face, image to image, then frame to frame. Let me know how deep you want to go.',
      ru: 'Курс построен вокруг консистентности персонажа — одно и то же лицо от кадра к кадру. Расскажите, насколько глубоко хотите зайти.',
    },
    fields: [
      {
        type: 'radio', key: 'need_consistency',
        q: { en: 'Do you need the same character across many images?', ru: 'Нужен ли вам один и тот же персонаж на многих изображениях?' },
        options: [o('Yes — that’s the whole point', 'Да — это главное'), o('Nice to have', 'Было бы неплохо'), o('No, one-off images are fine', 'Нет, разовые картинки — норм')],
      },
      {
        type: 'radio', key: 'train_own',
        q: { en: 'Do you want to train your own LoRAs / models?', ru: 'Хотите обучать свои LoRA / модели?' },
        options: [o('Yes, definitely', 'Да, определённо'), o('Maybe, if it’s worth it', 'Возможно, если оно того стоит'), o('No, I’d rather use existing ones', 'Нет, лучше использовать готовые'), o('What’s a LoRA?', 'Что такое LoRA?')],
      },
      {
        type: 'radio', key: 'nsfw',
        q: { en: 'Will you be making adult / NSFW content?', ru: 'Будете ли вы создавать контент для взрослых / NSFW?' },
        hint: { en: 'Asked only because it changes which models, tools and settings I’ll steer you toward. Totally fine either way.', ru: 'Спрашиваю только потому, что это меняет, какие модели, инструменты и настройки я порекомендую. Любой ответ — ок.' },
        options: [o('Yes', 'Да'), o('Some of it', 'Частично'), o('No', 'Нет'), o('Prefer not to say', 'Предпочитаю не отвечать')],
      },
      {
        type: 'radio', key: 'video_ambition',
        q: { en: 'How far into video do you want to go?', ru: 'Насколько глубоко хотите уйти в видео?' },
        options: [o('Not interested in video (yet)', 'Видео пока не интересует'), o('Short clips / motion tests', 'Короткие клипы / тесты движения'), o('Full scenes with continuity', 'Полные сцены с непрерывностью'), o('Cinematic shot-by-shot storytelling', 'Кинематографичный покадровый сторителлинг')],
      },
    ],
  },
  {
    id: 'llm',
    eyebrow: { en: 'Part 6 / 7', ru: 'Часть 6 / 7' },
    title: { en: 'Prompting & AI basics', ru: 'Промптинг и основы ИИ' },
    sub: {
      en: 'A quick read on the foundations — how you think about prompts, LLMs, and instructing an AI. No prep needed; just answer as you are today.',
      ru: 'Быстрый срез по основам — как вы понимаете промпты, LLM и то, как «инструктировать» ИИ. Готовиться не нужно, отвечайте как есть.',
    },
    fields: [
      { type: 'scale', key: 'prompt_comfort', q: { en: 'How comfortable are you writing detailed prompts?', ru: 'Насколько уверенно вы пишете подробные промпты?' }, low: { en: 'Never done it', ru: 'Никогда не делал(а)' }, high: { en: 'Very comfortable', ru: 'Очень уверенно' } },
      {
        type: 'radio', key: 'llm_vs_diffusion',
        q: { en: 'Do you know the difference between an LLM (text, like ChatGPT) and an image / diffusion model?', ru: 'Понимаете ли вы разницу между LLM (текст, как ChatGPT) и image / diffusion-моделью?' },
        options: [o('Yes, clearly', 'Да, чётко'), o('Sort of', 'Более-менее'), o('No — please explain it', 'Нет — объясните, пожалуйста')],
      },
      {
        type: 'radio', key: 'system_prompts',
        q: { en: 'Have you ever written instructions / a “system prompt” to steer an AI?', ru: 'Писали ли вы когда-нибудь инструкции / «системный промпт» для ИИ?' },
        options: [o('Yes, often', 'Да, часто'), o('Once or twice', 'Пару раз'), o('No', 'Нет')],
      },
      {
        type: 'multi', key: 'llm_tools',
        q: { en: 'Which AI tools do you already use? (optional)', ru: 'Какими ИИ-инструментами вы уже пользуетесь? (необязательно)' },
        options: [o('ChatGPT', 'ChatGPT'), o('Claude', 'Claude'), o('Gemini', 'Gemini'), o('Local LLM (LM Studio / Ollama)', 'Локальная LLM (LM Studio / Ollama)'), o('Midjourney', 'Midjourney'), o('ComfyUI / A1111', 'ComfyUI / A1111'), o('None of these', 'Ничем из этого')],
      },
    ],
  },
  {
    id: 'logistics',
    eyebrow: { en: 'Part 7 / 7', ru: 'Часть 7 / 7' },
    title: { en: 'Format & anything else', ru: 'Формат и всё остальное' },
    sub: {
      en: 'Last part — how you like to learn, and the space to tell me anything the questions above missed.',
      ru: 'Последняя часть — как вам удобнее учиться, и место, чтобы сказать всё, чего не спросили выше.',
    },
    fields: [
      {
        type: 'radio', key: 'format',
        q: { en: 'How would you prefer to learn?', ru: 'Как вам удобнее учиться?' },
        options: [o('1-on-1 live sessions', 'Индивидуальные живые занятия'), o('Small group', 'Небольшая группа'), o('Self-paced recorded lessons', 'Записанные уроки в своём темпе'), o('A mix', 'Смешанный формат')],
      },
      {
        type: 'radio', key: 'language',
        q: { en: 'Preferred language for the class', ru: 'Предпочитаемый язык курса' },
        options: [o('English', 'Английский'), o('Русский', 'Русский'), o('Français', 'Французский'), o('Either / any', 'Любой'), o('Other', 'Другой')],
      },
      {
        type: 'textarea', key: 'stuck_on',
        q: { en: 'Is there something specific you’re stuck on or dying to figure out right now?', ru: 'Есть ли что-то конкретное, на чём вы застряли или что очень хотите разобрать?' },
        placeholder: { en: 'The more specific, the better I can prep for you.', ru: 'Чем конкретнее, тем лучше я смогу подготовиться.' },
      },
      { type: 'text', key: 'heard_from', q: { en: 'How did you hear about the class? (optional)', ru: 'Откуда вы узнали о курсе? (необязательно)' }, placeholder: { en: 'Friend, Discord, X/Twitter, YouTube…', ru: 'Друг, Discord, X/Twitter, YouTube…' } },
      { type: 'textarea', key: 'anything_else', q: { en: 'Anything else you want me to know? (optional)', ru: 'Что-то ещё, что мне стоит знать? (необязательно)' }, placeholder: { en: 'Budget, schedule, dreams, constraints — whatever helps.', ru: 'Бюджет, расписание, цели, ограничения — всё, что поможет.' } },
    ],
  },
]
