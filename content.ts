/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENT — the single source of truth for the whole site.
 *  Edit text here; you never need to touch the components.
 *
 *  Any string that starts with "{{TODO" is rendered on the site as a
 *  dashed placeholder tag, so you can see at a glance what is missing.
 *  Replace it with real text (or delete the line) when you have it.
 * ─────────────────────────────────────────────────────────────
 */

export type Photo = {
  /** Path inside /public. Set to null to show a labelled placeholder frame. */
  src: string | null;
  alt: string;
  /** What belongs here — shown on the placeholder frame when src is null. */
  label: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  name: string;
  oneLiner: string;
  url: string;
  /** Real screenshot / screen recording of the project, from /public/images/projects/. */
  media: Photo & { video?: string | null };
  problem: string;
  built: string;
  learned: string;
  tags: string[];
};

export const site = {
  /**
   * The URL this site lives at (SEO, sitemap, social cards).
   * Filled in automatically from your Vercel project's main domain;
   * set NEXT_PUBLIC_SITE_URL in Vercel only if you add a custom domain.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  title: "Hammad Rasool — Web Developer & Digital Marketing Learner",
  description:
    "Hammad Rasool (AureVon) is a web developer and digital marketing learner in Lahore, Pakistan. Real, live projects built with React, TypeScript and Tailwind CSS.",
  locale: "en_US",
};

export const profile = {
  name: "Hammad Rasool",
  firstName: "Hammad",
  lastName: "Rasool",
  brand: "AureVon",
  roles: ["Web Developer", "Digital Marketing Learner", "Aspiring Professional Marketer"],
  location: "Lahore, Pakistan",
  email: "AureVon9990@gmail.com",
  /** Every address shown in the contact section (first one is the main email). */
  emails: ["AureVon9990@gmail.com", "hammadrasool0009@gmail.com"],
  philosophy:
    "True professional confidence comes from honesty, disciplined study, and genuine curiosity.",
  socials: {
    instagram: "https://www.instagram.com/aurevon9990/",
    github: "{{TODO: GitHub URL}}",
    linkedin: "{{TODO: LinkedIn URL}}",
  },
};

export const photos = {
  /** Hero portrait. The particle portrait is sampled from this image. */
  hero: {
    src: "/images/me/hero.jpg",
    alt: "Hammad Rasool in a navy blazer, leaning on a chair against an orange wall",
    label: "Hero portrait",
    width: 896,
    height: 1200,
  },
  origin: {
    src: "/images/me/origin.jpg",
    alt: "Hammad Rasool seated in a navy blazer, holding an open book",
    label: "Working / study portrait",
    width: 896,
    height: 1200,
  },
  learning: {
    src: "/images/me/learning.jpg",
    alt: "Hammad Rasool in a checked shirt, reading a book in an armchair",
    label: "Learning photo",
    width: 896,
    height: 1200,
  },
  candid: {
    src: "/images/me/candid.jpg",
    alt: "Hammad Rasool smiling, relaxed on a sofa",
    label: "Candid / lifestyle photo",
    width: 588,
    height: 784,
  },
} satisfies Record<string, Photo>;

/** Chapter list — drives the pinned label, the side progress rail and the terminal. */
export const chapters = [
  { id: "noise", num: "01", label: "NOISE" },
  { id: "origin", num: "02", label: "ORIGIN" },
  { id: "lantern", num: "03", label: "THE LANTERN" },
  { id: "work", num: "04", label: "SIGNAL" },
  { id: "toolkit", num: "05", label: "TOOLKIT" },
  { id: "contact", num: "06", label: "TRANSMISSION" },
] as const;

export const hero = {
  shuffleWords: ["build", "market", "learn", "ship"],
  lineBefore: "I",
  lineAfter: "digital experiences.",
  scrollHint: "scroll to find the signal",
};

export const origin = {
  /** Lights up word by word as you scroll. */
  paragraph:
    "I'm Hammad. I build for the web with React, TypeScript and Tailwind CSS, and I'm studying digital marketing so the things I build actually reach people. I don't have a decade behind me. I have work you can click. I would rather show you something real than claim years I haven't lived yet.",
  aside: "Developer by practice. Marketer in training. Learner by default.",
  story: "{{TODO: add a line about your story, goals, or what you want next}}",
};

export const lantern = {
  intro: "Every signal needs a source. These are mine.",
  stops: [
    {
      kicker: "The School",
      title: "NeXskill — Be Productive",
      body: "Practical marketing education: structured campaigns, conversion strategy and performance marketing.",
    },
    {
      kicker: "The Mentor",
      title: "Sir Ahmad Basit",
      body: "Taught me strategic discipline, conversion tracking and ethical transparency.",
    },
    {
      kicker: "The Place",
      title: "Arfa Software Technology Park",
      body: "Where my classes happen, at Arfa Karim Tower in Lahore.",
    },
  ],
};

export const projects: Project[] = [
  {
    id: "quickpercent",
    name: "QuickPercent",
    oneLiner: "An online percentage calculator built for speed and clarity.",
    url: "https://quickpercent-avmu.vercel.app/",
    media: {
      src: null, // e.g. "/images/projects/quickpercent.jpg"
      video: null, // e.g. "/images/projects/quickpercent.mp4"
      alt: "Screenshot of the QuickPercent percentage calculator",
      label: "QuickPercent screenshot",
      width: 1600,
      height: 1000,
    },
    problem:
      "Percentages come up everywhere: discounts, price changes, comparing two values. People want the answer fast, without doing the maths by hand.",
    built:
      "A clean, mobile-friendly calculator that works out percentages, compares values, calculates discounts and explains percentage change. Built with speed, accuracy and SEO-ready metadata in mind.",
    learned: "{{TODO: what you learned building QuickPercent}}",
    tags: ["Vercel", "SEO metadata", "Mobile-first", "{{TODO: stack, e.g. React · Tailwind}}"],
  },
  {
    id: "faunavox",
    name: "FaunaVox",
    oneLiner: "An interactive way to discover animals by sight and sound.",
    url: "https://faunavox-interactive-animal-discovery.ai.studio/",
    media: {
      src: null, // e.g. "/images/projects/faunavox.jpg"
      video: null,
      alt: "Screenshot of FaunaVox, the interactive animal discovery app",
      label: "FaunaVox screenshot",
      width: 1600,
      height: 1000,
    },
    problem:
      "Reading about animals is flat. Seeing them and hearing them makes learning stick.",
    built:
      "An interactive discovery experience: explore animals, view photos, hear real wildlife sounds and read educational facts. Built with Google AI Studio.",
    learned: "{{TODO: what you learned building FaunaVox}}",
    tags: ["Google AI Studio", "Audio", "Interactive", "{{TODO: more stack details}}"],
  },
];

export const toolkit = {
  build: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Responsive layouts",
    "Landing pages",
    "Core Web Vitals",
    "Vercel",
    "Google AI Studio",
    // "{{TODO: add more — JavaScript, Next.js, Git, Figma…}}",
  ],
  grow: [
    "SEO",
    "Performance marketing",
    "ROAS · CPA · CTR · CRO",
    "Funnels",
    "Brand awareness",
    "Customer acquisition",
    "Digital advertising",
  ],
  marquee: "developer. marketer. learner. —",
};

export const contact = {
  headline: "LET'S TALK.",
  lead: "Have a project, a role, or just a question? Send a signal.",
  success: "Signal received.",
  successBody: "Thanks for reaching out. I'll reply to your email soon.",
};
