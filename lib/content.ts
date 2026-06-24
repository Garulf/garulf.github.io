import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import type { WhoamiMeta, ProjectsMeta, PostMeta, Post } from './types'

async function processMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml)
    .process(content)
  return result.toString()
}

export async function getSectionData(name: 'whoami'): Promise<{ meta: WhoamiMeta; contentHtml: string }>
export async function getSectionData(name: 'projects'): Promise<{ meta: ProjectsMeta; contentHtml: string }>
export async function getSectionData(name: 'contact'): Promise<{ meta: WhoamiMeta; contentHtml: string }>
export async function getSectionData(name: string): Promise<{ meta: unknown; contentHtml: string }>
export async function getSectionData(name: string): Promise<{ meta: unknown; contentHtml: string }> {
  const filePath = path.join(process.cwd(), 'content', 'sections', name + '.md')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const contentHtml = await processMarkdown(content)
  return { meta: data, contentHtml }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const postsDir = path.join(process.cwd(), 'content', 'posts')
  const filenames = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))

  const posts: PostMeta[] = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const filePath = path.join(postsDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      tags: (data.tags as string[]) ?? [],
      readTime: data.readTime as string,
    }
  })

  // Sort by date descending (newest first)
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(process.cwd(), 'content', 'posts', slug + '.md')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const contentHtml = await processMarkdown(content)
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    tags: (data.tags as string[]) ?? [],
    readTime: data.readTime as string,
    contentHtml,
  }
}
