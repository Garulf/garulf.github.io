export interface WhoamiMeta {
  name: string;
  role: string;
  location: string;
  languages: string[];
  github: string;
  mastodon: string;
  coffee: string;
  org: string;
  avatar: string;
}

export interface Project {
  name: string;
  url: string;
  stars: number;
  forks: number;
  lang: string;
  color: string;  // CSS color string e.g. "#f9e2af"
  desc: string;
}

export interface ProjectsMeta {
  projects: Project[];
}

export interface PostMeta {
  slug: string;       // derived from filename, no .md
  title: string;
  date: string;       // ISO date string e.g. "2026-05-18"
  tags: string[];
  readTime: string;   // e.g. "7 min read"
}

export interface Post extends PostMeta {
  contentHtml: string;
}
