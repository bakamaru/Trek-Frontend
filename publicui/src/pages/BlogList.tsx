import React, { useState } from 'react';
import { BlogPost } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import BlogCard from '../components/blog/BlogCard';
import { useGetLatestPostsQuery } from '../redux/api/blogAPI';
import { Post } from '../types/blogTypes';

const BlogList: React.FC = () => {
    const [page, setPage] = useState(1);
    const limit = 8;
    const { data: apiResponse, isLoading, error } = useGetLatestPostsQuery({
        offset: page,
        limit: limit
    });

    const posts = apiResponse?.Data || [];
    const totalRows = posts.length > 0 ? posts[0].RowTotal : 0;
    const totalPages = Math.ceil(totalRows / limit);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="pt-20">
            <section className="bg-gray-100 dark:bg-gray-800 py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">Our Blog</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">Travel stories, tips, and inspiration from the Territory Himalayas team.</p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="text-red-500 text-center">Failed to load blog posts</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map((post: Post) => {
                                    // Map Post (PascalCase) to BlogPost (camelCase) expected by BlogCard
                                    const mappedPost: BlogPost = {
                                        id: post.Url, // Using Url as ID for navigation as per BlogDetail usage
                                        title: post.Title,
                                        image: post.CoverImage || post.ThumbnailImage || '',
                                        date: new Date(post.PublishedOn).toLocaleDateString(),
                                        author: 'Admin', // Post DTO has PostAuthorId but no name, defaulting to Admin or empty
                                        excerpt: '', // Post DTO has Content, excerpt is usually derived
                                        content: post.Content
                                    };
                                    return <BlogCard key={post.PostId} post={mappedPost} />;
                                })}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-12 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className={`px-4 py-2 rounded-md ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        Previous
                                    </button>

                                    <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                        Page {page} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className={`px-4 py-2 rounded-md ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogList;