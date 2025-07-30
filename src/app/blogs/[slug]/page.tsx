import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import './blog-post.css'

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    author->{name},
    categories[]->{title},
    body
  }`
  
  const post = await client.fetch(query, { slug })
  return post
}

async function getPostSlugs() {
  const query = `*[_type == "post"] {
    slug
  }`
  
  return await client.fetch(query)
}

interface PostSlug {
  slug: {
    current: string
  }
}

export async function generateStaticParams() {
  const posts = await getPostSlugs()
  
  return posts.map((post: PostSlug) => ({
    slug: post.slug.current,
  }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="blog-post-container">
      <div className="blog-post-header">
        <Link href="/blogs" className="back-link">
          ← Back to Blogs
        </Link>
        
        <div className="blog-post-meta">
          {post.publishedAt && (
            <span className="post-date">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
          {post.author && (
            <span className="post-author">By {post.author.name}</span>
          )}
        </div>
        
        <h1 className="blog-post-title">{post.title}</h1>
        
                 {post.categories && post.categories.length > 0 && (
           <div className="post-categories">
             {post.categories.map((category: { title: string }) => (
               <span key={category.title} className="post-category">
                 {category.title}
               </span>
             ))}
           </div>
         )}
      </div>
      
      {post.mainImage && (
        <div className="blog-post-image-container">
                     <img
             src={urlFor(post.mainImage).width(800).height(400).url()}
             alt={post.mainImage.alt || post.title}
             className="blog-post-image"
           />
        </div>
      )}
      
      <div className="blog-post-content">
        {post.body && (
          <PortableText
            value={post.body}
            components={{
              block: {
                h1: ({children}) => <h1 className="content-h1">{children}</h1>,
                h2: ({children}) => <h2 className="content-h2">{children}</h2>,
                h3: ({children}) => <h3 className="content-h3">{children}</h3>,
                h4: ({children}) => <h4 className="content-h4">{children}</h4>,
                normal: ({children}) => <p className="content-p">{children}</p>,
              },
              list: {
                bullet: ({children}) => <ul className="content-ul">{children}</ul>,
                number: ({children}) => <ol className="content-ol">{children}</ol>,
              },
              listItem: {
                bullet: ({children}) => <li className="content-li">{children}</li>,
                number: ({children}) => <li className="content-li">{children}</li>,
              },
            }}
          />
        )}
      </div>
      
      <div className="blog-post-footer">
        <Link href="/blogs" className="back-to-blogs-btn">
          ← Back to All Posts
        </Link>
      </div>
    </div>
  )
} 