import React from 'react';
import { BlogPost } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import BlogCard from '../components/blog/BlogCard';
import { useGetBlogListQuery } from '../redux/api/blogAPI';

const BlogList: React.FC = () => {
    const { data: posts, isLoading, error } = useGetBlogListQuery(undefined);

    return (
        <div className="pt-20">
            <section className="bg-gray-100 dark:bg-gray-800 py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">Our Blog</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">Travel stories, tips, and inspiration from the Heavenly Pathways team.</p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="text-red-500 text-center">Failed to load blog posts</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts?.map((post: BlogPost) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogList;