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
  /** Brand logo, shown on a panel in the project's own colour until a screenshot is added. */
  logo?: { src: string; width: number; height: number; bg: string };
  problem: string;
  built: string;
  /** Optional — the row is hidden when left out. */
  learned?: string;
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
    github: "",
    linkedin: "https://www.linkedin.com/in/hammad-rasool6767/",
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
  { id: "experience", num: "04", label: "EXPERIENCE & EDUCATION" },
  { id: "work", num: "05", label: "SIGNAL" },
  { id: "toolkit", num: "06", label: "TOOLKIT" },
  { id: "contact", num: "07", label: "TRANSMISSION" },
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
  story: "Looking to grow your business online? Let's connect or send me a message.",
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
      src: "/images/projects/quickpercent.jpg",
      video: null, // e.g. "/images/projects/quickpercent.mp4"
      alt: "QuickPercent home page: “Calculate Percentages. Get Answers Fast.”",
      label: "QuickPercent screenshot",
      width: 679,
      height: 424,
    },
    logo: { src: "/images/projects/quickpercent-logo.png", width: 739, height: 137, bg: "#fff8f7" },
    problem:
      "Percentages come up everywhere: discounts, price changes, comparing two values. People want the answer fast, without doing the maths by hand.",
    built:
      "A free, mobile-friendly suite of 8 dedicated calculators: work out percentages, compare values, find price discounts and understand percentage change. Every calculation runs instantly in the browser, with zero server tracking, and the site ships with SEO-ready metadata.",
    tags: ["Vercel", "SEO metadata", "Mobile-first", "Client-side", "Privacy-first"],
  },
  {
    id: "faunavox",
    name: "FaunaVox",
    oneLiner: "An interactive wildlife encyclopedia for young explorers.",
    url: "https://faunavox-interactive-animal-discovery.ai.studio/",
    media: {
      src: "/images/projects/faunavox.jpg",
      video: null,
      alt: "FaunaVox home page: “Discover Animals. See Them. Hear Them. Learn.”",
      label: "FaunaVox screenshot",
      width: 728,
      height: 455,
    },
    logo: { src: "/images/projects/faunavox-logo.png", width: 1057, height: 185, bg: "#faf8f5" },
    problem:
      "Reading about animals is flat. Seeing them and hearing them makes learning stick, especially for kids.",
    built:
      "A digital wildlife book for curious kids, parents and classrooms. It answers three questions about every animal: what does it look like, what is its name, and what sound does it make? Explore animals with photos and facts, or play real wildlife sounds in the Sound Explorer. Built with Google AI Studio.",
    tags: ["Google AI Studio", "Audio", "Interactive", "For kids & classrooms"],
  },
  {
    id: "aura-clothing",
    name: "Aura Clothing",
    oneLiner: "A premium menswear storefront for a shirt brand selling to the USA and UK.",
    url: "https://auraclothing-eight.vercel.app",
    media: {
      src: "/images/projects/aura-clothing.jpg",
      video: null,
      alt: "Aura Clothing home page: a model in a navy blazer under a UFO light beam, with giant AURA lettering",
      label: "Aura Clothing screenshot",
      width: 872,
      height: 545,
    },
    logo: { src: "/images/projects/aura-clothing-logo.png", width: 678, height: 188, bg: "#0a1124" },
    problem:
      "A clothing brand lives or dies on first impressions. Shoppers decide in seconds whether a store feels premium enough to trust with their money.",
    built:
      "A dark, premium storefront for AURA-CLOTHING, a menswear brand selling shirts in the USA and UK. A cinematic hero (“Wear the signal”) with a UFO light beam over the model, collections for Formal, Casual, Statement and Old Money, a shop with a cart, and social share previews so the brand looks right wherever the link is posted.",
    tags: ["Vercel", "E-commerce", "Brand website", "Responsive"],
  },
];

export type Role = {
  title: string;
  org: string;
  type: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  /** Short, scannable points. */
  points: string[];
};

export type Study = {
  level: string;
  field: string;
  school: string;
  start: string;
  end: string;
  grade: string;
  summary: string;
  points: string[];
};

/** Education, as listed on LinkedIn. Newest first. */
export const education = {
  /** Headline numbers shown above the timeline. */
  highlights: [
    { value: "A+", label: "Grade in both Matric and FSc" },
    { value: "3rd", label: "All Pakistan Hockey Tournament, nationwide" },
    { value: "Captain", label: "College hockey team" },
  ],
  studies: [
    {
      level: "Intermediate",
      field: "FSc Pre-Medical",
      school: "Aspire College Gujranwala",
      start: "Aug 2024",
      end: "Mar 2026",
      grade: "A+",
      summary:
        "Completed FSc Pre-Medical with an A+ grade while competing in hockey at district and national level.",
      points: [
        "Captain of the college hockey team: leadership, teamwork and sportsmanship",
        "Represented the district in hockey tournaments and competitive events",
        "Secured 3rd position nationwide with the team at the All Pakistan Hockey Tournament",
        "Kept strong academic performance alongside college sports",
      ],
    },
    {
      level: "Matric",
      field: "Science (Biology, Physics, Chemistry)",
      school: "The Scholars Garrison",
      start: "Aug 2022",
      end: "Sep 2024",
      grade: "A+",
      summary:
        "Completed Matriculation in Science with an A+ grade, balancing academics with an active role in the school's hockey.",
      points: [
        "Active hockey player, building discipline, leadership and sportsmanship",
        "Developed communication, collaboration and time-management skills through sport",
        "Balanced academic excellence with extracurricular activities",
      ],
    },
  ] satisfies Study[],
};

/** Professional experience, as listed on LinkedIn. Newest first. */
export const experience = {
  intro:
    "Great marketing brings visitors. A great website turns them into customers. I help businesses do both.",
  lead:
    "Digital Marketing Specialist and Website Developer, focused on one goal: driving measurable growth through strategy, creativity and data.",
  roles: [
    {
      title: "Web Developer",
      org: "NeXskill — Be Productive",
      type: "Full-time",
      start: "Nov 2026",
      end: "Present",
      location: "Lahore, Pakistan · Remote",
      summary: "I design and develop modern, responsive websites that look great and perform even better.",
      points: [
        "Designed and developed modern, responsive websites for clients and internal projects",
        "Built high-converting landing pages optimised for speed, user experience and conversions",
        "Ensured websites work smoothly on mobile, tablet and desktop",
        "Applied SEO best practices to improve visibility on Google",
        "Collaborated with the team to deliver projects on time with clean, maintainable code",
      ],
    },
    {
      title: "Digital Marketing Specialist",
      org: "Self-employed",
      type: "Full-time",
      start: "Aug 2026",
      end: "Present",
      location: "Lahore, Pakistan · Remote",
      summary:
        "I help businesses build a powerful online presence and achieve measurable, sustainable growth, combining strategic marketing with high-performing websites to generate more leads, increase sales and maximise return on investment.",
      points: [
        "Paid advertising: plan, launch and optimise data-driven campaigns across Google, Meta, YouTube and TikTok",
        "Website development: modern, fast, fully responsive websites and landing pages built to convert",
        "SEO: proven strategies that improve search visibility and attract high-quality organic traffic",
      ],
    },
  ] satisfies Role[],
};

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
