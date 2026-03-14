import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types/types';
import { formatDate } from '../../utils/helpers';
const noImageUrl = import.meta.env.VITE_CDN_PATH + "/no-image.png";
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    return (
        <div key={post.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden group">
            <div className="overflow-hidden">
                <a href={`/blog${post.slug}`}>
                    <img src={post.image || noImageUrl + "?w=500&h=350&mode=crop"} alt={post.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300" />
                </a>
            </div>
            <div className="p-6">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4 space-x-4">
                    <span>{formatDate(post.date)}</span>
                    <span>/</span>
                    <span>By {post.author || "Territory Himalaya Team"}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 h-20">
                    <a href={`/blog${post.slug}`} className="group-hover:text-blue-700 transition-colors duration-300">
                        {post.title}
                    </a>
                </h3>
                <a href={`/blog${post.slug}`} className="font-semibold text-blue-700 hover:underline">
                    Read More
                </a>
            </div>
        </div>
    );
};

export default BlogCard;