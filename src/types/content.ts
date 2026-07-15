export type ProjectTheme = { canvas: string; ink: string; accent: string; signal: string };
export type MediaFit = 'contain' | 'cover';
export type MediaFrame = 'presentation' | 'poster' | 'photography';
export type ProjectMedia = { src: string; zoomSrc?: string; alt: string; width: number; height: number; objectPosition?: string; fit?: MediaFit; frame?: MediaFrame };
export type ProjectCardLayout = { x: number; y: number; rotation: number; width: number; height: number };

export type ProjectSection =
  | { type: 'text'; title: string; body: string }
  | { type: 'gallery'; title: string; description?: string; images: ProjectMedia[]; presentation?: boolean };

export type Project = {
  slug: string;
  title: string;
  subtitle?: string;
  agency: string;
  year: string;
  description: string;
  statement: string;
  role: string;
  category: string;
  context: string;
  contribution: string;
  outcome: string;
  featured: boolean;
  order: number;
  theme: ProjectTheme;
  layout: ProjectCardLayout;
  cover: ProjectMedia;
  stage?: ProjectMedia;
  detail: ProjectMedia;
  frames: ProjectMedia[];
  sections: ProjectSection[];
};
