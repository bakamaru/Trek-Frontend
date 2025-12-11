import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';
import BlogCard from './blog/BlogCard';
import { useGetLatestPostsQuery } from '../redux/api/blogAPI';
import { BlogPost } from '../types/types';

// Backend Post model
type ApiPost = {
  PostId: number;
  Title: string;
  Url: string;
  ThumbnailImage: string;
  CoverImage: string;
  Content: string;
  Tags: string;
  Categories: string;
  PostAuthorId: number;
  ViewCount: number;
  PublishedOn: string;
  IsVideoContent: boolean;
  VideoLink: string;
  RecommendationMetaTags: string;
  IsPublic: boolean;
};

type BlogApiResponse = {
  Code: number;
  Message: string;
  Data: ApiPost[];
  Errors?: any[];
};

const Blog: React.FC = () => {
  const {
    data: rawData,
    isLoading,
    error,
  } = useGetLatestPostsQuery({ offset: 1, limit: 3 });

  const response = rawData as BlogApiResponse | undefined;
  const apiPosts: ApiPost[] = response?.Data ?? [];

  // Map API Post -> your BlogPost type
  var ps: any[] = apiPosts.map((p) => ({
    id: p.PostId,
    title: p.Title,
    slug: p.Url,
    // choose cover first, then thumbnail, then fallback
    image:
      p.CoverImage ||
      p.ThumbnailImage ||
      'https://via.placeholder.com/800x600?text=Blog',
    // basic excerpt from content
    excerpt: p.Content ? p.Content.substring(0, 150) + '...' : '',
    // you can tweak these depending on your BlogPost definition
    author: '',
    date: p.PublishedOn,
    tags: p.Tags ? p.Tags.split(',').map((t) => t.trim()) : [],
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

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
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
