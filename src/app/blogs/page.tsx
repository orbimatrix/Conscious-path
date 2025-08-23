import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'
import './blogs.css'

interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  mainImage?: {
    alt?: string
  }
  publishedAt?: string
  author?: {
    name: string
  }
  categories?: Array<{
    title: string
  }>
}

async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    author->{name},
    categories[]->{title}
  }`
  
  return await client.fetch(query)
}

export default async function BlogsPage() {
  const posts = await getPosts()

  return (
    <div className="blogs-container">
      <div className="blogs-header">
        <h1 className="blogs-title">Blog Posts</h1>
        <p className="blogs-subtitle">Discover insights and wisdom from our conscious community</p>
      </div>
      
      <div className="blogs-grid">
        {posts.map((post: BlogPost) => (
          <Link href={`/blogs/${post.slug.current}`} key={post._id} className="blog-card">
            <div className="blog-card-image">
              {post.mainImage && (
                <Image
                  src={urlFor(post.mainImage).width(400).height(250).url()}
                  alt={post.mainImage.alt || post.title}
                  className="blog-image"
                  width={400}
                  height={250}
                  unoptimized
                />
              )}
            </div>
            <div className="blog-card-content">
              <h2 className="blog-card-title">{post.title}</h2>
              <div className="blog-card-meta">
                {post.author && (
                  <span className="blog-author">By {post.author.name}</span>
                )}
                {post.publishedAt && (
                  <span className="blog-date">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>
              {post.categories && post.categories.length > 0 && (
                <div className="blog-categories">
                  {post.categories.map((category) => (
                    <span key={category.title} className="blog-category">
                      {category.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="blogs-empty">
          <p>No blog posts found. Check back soon for new content!</p>
        </div>
      )}
    </div>
  )
} 