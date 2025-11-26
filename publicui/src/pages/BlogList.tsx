import React, { useContext, useState, useEffect } from 'react';
import { BLOG_POSTS_DATA } from '../const/constants';
import { BlogPost } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import BlogCard from '../components/blog/BlogCard';


const BlogList: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPosts(BLOG_POSTS_DATA);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

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
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <BlogCard post={post} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogList;