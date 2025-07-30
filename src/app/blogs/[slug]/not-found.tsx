import Link from 'next/link'
import './not-found.css'

export default function NotFound() {
  return (
    <div className="blog-not-found">
      <h1 className="not-found-title">Blog Post Not Found</h1>
      <p className="not-found-message">
        Sorry, the blog post you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/blogs" className="back-to-blogs-link">
        ← Back to All Posts
      </Link>
    </div>
  )
} 