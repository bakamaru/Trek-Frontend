import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types/types';
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    return (
        <div key={post.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden group">
            <div className="overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4 space-x-4">
                    <span>{post.date}</span>
                    <span>/</span>
                    <span>By {post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 h-20">
                    <Link to={`/blog/${post.id}`} className="group-hover:text-blue-700 transition-colors duration-300">
                        {post.title}
                    </Link>
                </h3>
                <Link to={`/blog/${post.id}`} className="font-semibold text-blue-700 hover:underline">
                    Read More →
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;