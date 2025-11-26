import React, { useContext, useState, useEffect } from 'react';
import { BLOG_POSTS_DATA } from '../const/constants';
import { BlogPost } from '../types/types';
import { slugify } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';
import BlogCard from './blog/BlogCard';




const Blog: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(BLOG_POSTS_DATA.slice(0, 3));
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Our Latest Blog</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Get inspired by our latest travel stories and tips.</p>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogCard post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;