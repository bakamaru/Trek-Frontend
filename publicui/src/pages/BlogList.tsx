import React, { useState } from 'react';
import { BlogPost } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import BlogCard from '../components/blog/BlogCard';
import { useGetLatestPostsQuery } from '../redux/api/blogAPI';
import { Post } from '../types/blogTypes';
import { motion } from 'framer-motion';

import SEO from '../components/SEO';

const BlogList: React.FC = () => {
    const [page, setPage] = useState(1);
    const limit = 8;

    // accumulate pages here
    const [items, setItems] = useState<Post[]>([]);

    const { data: apiResponse, isLoading, isFetching, error } = useGetLatestPostsQuery({
        offset: page,
        limit: limit
    });

    // Append new page results and dedupe by PostId
    React.useEffect(() => {
        if (!apiResponse) return;
        const incoming: Post[] = apiResponse.Data || [];
        if (incoming.length === 0) return;

        setItems((prev) => {
            const map = new Map<number, Post>();
            prev.forEach((p) => map.set(p.PostId, p));
            incoming.forEach((p) => map.set(p.PostId, p));
            return Array.from(map.values());
        });
    }, [apiResponse]);

    // Determine whether more pages exist based on last fetch size
    const lastFetchCount = (apiResponse?.Data || []).length;
    const hasMore = lastFetchCount >= limit;

    const handleLoadMore = () => {
        if (!hasMore) return;
        setPage((p) => p + 1);
        // optional: smooth scroll to show loading area
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    return (
        <>
            <SEO
                title="Travel Blog - Territory Himalayas | Trekking Tips & Stories"
                description="Read our latest travel stories, trekking tips, and guides for exploring the Himalayas. Stay inspired for your next adventure."
            />
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://backend.territoryhimalaya.com/assets/bg/mountainrange.jpg?w=1800&h=500&mode=crop"
                        alt="Himalayan Mountains"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-4"
                    >
                        Our Blog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-200"
                    >
                        Travel stories, tips, and inspiration from the Territory Himalayas team.
                    </motion.p>
                </div>
            </div>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    {isLoading && items.length === 0 ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="text-red-500 text-center">Failed to load blog posts</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {items.map((post: Post) => {
                                    // Map Post (PascalCase) to BlogPost (camelCase) expected by BlogCard
                                    const mappedPost: BlogPost = {
                                        id: post.Url, // Using Url as ID for navigation as per BlogDetail usage
                                        title: post.Title,
                                        slug: post.Url,
                                        image: post.ThumbnailImage,
                                        date: new Date(post.PublishedOn).toLocaleDateString(),
                                        author: 'Admin', // Post DTO has PostAuthorId but no name, defaulting to Admin or empty
                                        excerpt: '', // Post DTO has Content, excerpt is usually derived
                                        content: post.Content
                                    };
                                    return <BlogCard key={post.PostId} post={mappedPost} />;
                                })}
                            </div>

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="flex justify-center mt-12">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={!hasMore || isFetching}
                                        className={`px-6 py-3 rounded-md ${(!hasMore || isFetching) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        {isFetching ? 'Loading...' : hasMore ? 'Load More' : 'No more posts'}
                                    </button>
                                </div>)}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default BlogList;