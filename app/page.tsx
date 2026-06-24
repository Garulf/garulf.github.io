import { getSectionData, getAllPosts, getPostBySlug } from '@/lib/content'
import Terminal from '@/components/Terminal/Terminal'

export default async function Home() {
  const [whoami, projects, contact, postMetas] = await Promise.all([
    getSectionData('whoami'),
    getSectionData('projects'),
    getSectionData('contact'),
    getAllPosts(),
  ])

  // Load full post content for inline injection
  const posts = await Promise.all(postMetas.map(p => getPostBySlug(p.slug)))

  return (
    <Terminal
      whoami={whoami}
      projects={projects}
      contact={contact}
      posts={posts}
    />
  )
}
