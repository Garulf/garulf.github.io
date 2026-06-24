import { getAllPosts, getPostBySlug, getSectionData } from '@/lib/content'
import Terminal from '@/components/Terminal/Terminal'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return {
    title: `${post.title} — garulf@github`,
    description: `${post.readTime} · ${post.tags.map(t => '#' + t).join(' ')}`,
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const [whoami, projects, postMetas, initialPost] = await Promise.all([
    getSectionData('whoami'),
    getSectionData('projects'),
    getAllPosts(),
    getPostBySlug(slug),
  ])
  const posts = await Promise.all(postMetas.map(p => getPostBySlug(p.slug)))

  return (
    <Terminal
      whoami={whoami}
      projects={projects}
      posts={posts}
      initialPost={initialPost}
    />
  )
}
