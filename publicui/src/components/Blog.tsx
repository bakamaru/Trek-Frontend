import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';
import BlogCard from './blog/BlogCard';
import { useGetLatestPostsQuery } from '../redux/api/blogAPI';
import { BlogPost } from '../types/types';
import { Post } from '../types/blogTypes';
import BlogSkeleton from './BlogSkeleton';



const Blog: React.FC = () => {
  const CACHE_KEY = 'latest_blog_posts_cache';

  const [cachedPosts, setCachedPosts] = React.useState<Post[] | null>(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const {
    data: rawData,
    isLoading,
    error,
  } = useGetLatestPostsQuery({ offset: 1, limit: 3 });

  React.useEffect(() => {
    if (rawData?.Data) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(rawData.Data));
      setCachedPosts(rawData.Data);
    }
  }, [rawData]);

  const apiPosts: Post[] = rawData?.Data ?? cachedPosts ?? [];
  const noImageUrl = import.meta.env.VITE_CDN_PATH + "/no-image.png";

  // Map API Post -> your BlogPost type
  const ps: BlogPost[] = apiPosts.map((p) => ({
    id: String(p.PostId),
    title: p.Title,
    slug: p.Url,
    // choose thumbnail first, then fallback
    image: p.ThumbnailImage || noImageUrl,
    // basic excerpt from content
    excerpt: p.Content ? p.Content.substring(0, 150) + '...' : '',
    content: p.Content || '',
    author: 'Admin',
    date: p.PublishedOn,
  }));

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            Our Latest Blog
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Get inspired by our latest travel stories and tips.
          </p>
        </div>

        {isLoading && ps.length === 0 ? (
          <BlogSkeleton />
        ) : error && ps.length === 0 ? (
          <div className="text-red-500 text-center">Failed to load blog posts</div>
        ) : ps.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No blog posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ps.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
