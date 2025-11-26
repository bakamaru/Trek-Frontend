import React, { useState, useEffect } from 'react';
import { BLOG_POSTS_DATA } from '../const/constants';
import { BlogPost } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { useParams } from 'react-router-dom';

interface BlogDetailProps {
 // postId: string;
}

const BlogDetail: React.FC<BlogDetailProps> = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const foundPost = BLOG_POSTS_DATA.find(p => p.id === slug);
      setPost(foundPost || null);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!post) {
    return (
      <div className="pt-20 h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Blog Post Not Found</h1>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <SEO 
        title={post.title} 
        description={post.excerpt}
        image={post.image}
        type="article"
        context={`Blog post titled "${post.title}" by ${post.author}. Excerpt: ${post.excerpt}`}
      />
      <section 
        className="h-96 bg-cover bg-center flex items-center justify-center text-white relative"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl font-extrabold">{post.title}</h1>
          <p className="text-xl mt-4">{post.date} / By {post.author}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
            <div 
                className="prose lg:prose-xl text-gray-700 dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;