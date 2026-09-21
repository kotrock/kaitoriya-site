import { siteUrl, columns } from "@/data/site";

const routes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/application", changeFrequency: "monthly", priority: 0.8 },
  { path: "/recycle", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/user-voice", changeFrequency: "monthly", priority: 0.6 },
  { path: "/results", changeFrequency: "weekly", priority: 0.6 },
  { path: "/column", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms-of-use", changeFrequency: "yearly", priority: 0.3 },
  { path: "/tokuhou", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap() {
  const lastModified = new Date();
  const columnRoutes = columns.map((c) => ({
    path: `/column/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...routes, ...columnRoutes].map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
