import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { useParams } from 'react-router-dom';
import { useGetPostDetailByUrlQuery } from '../redux/api/blogAPI';

interface BlogDetailProps {
  // postId: string;
}

const BlogDetail: React.FC<BlogDetailProps> = () => {
  const { slug } = useParams();
  const { data: apiResponse, isLoading, error } = useGetPostDetailByUrlQuery(slug || '', {
    skip: !slug
  });

  const post = apiResponse?.Data;

  if (isLoading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (error || !post) {
    return (
      <div className="pt-20 h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Blog Post Not Found</h1>
      </div>
    );
  }

  // Helper to extract plain text for excerpt
  const getExcerpt = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const excerpt = getExcerpt(post.Content).substring(0, 160);
  const formattedDate = new Date(post.PublishedOn).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="pt-20">
      <SEO
        title={post.Title}
        description={excerpt}
        image={post.CoverImage || post.ThumbnailImage}
        type="article"
        context={`Blog post titled "${post.Title}". Excerpt: ${excerpt}`}
      />
      <section
        className="h-96 bg-cover bg-center flex items-center justify-center text-white relative"
        style={{ backgroundImage: `url(${post.CoverImage || post.ThumbnailImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl font-extrabold">{post.Title}</h1>
          <p className="text-xl mt-4">{formattedDate}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div
            className="prose lg:prose-xl text-gray-700 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.Content }}
          />
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;