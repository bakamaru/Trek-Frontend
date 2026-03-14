import React, { useMemo } from 'react';

import { useLocation } from 'react-router-dom';
import {
  useGetSeoByUrlQuery,
  useGenerateJsonLdForWebsiteQuery,
  useGenerateJsonLdForPageQuery,
  useGenerateJsonLdForPageByProductQuery,
  useGetSeoByProductIdQuery,
} from '../redux/api/seoAPI';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  seoType?: string; // 'page', 'product', 'category', 'article', 'website' etc.
  productId?: number;
  context?: string; // Content context for AI generation (optional)
}

const SEO: React.FC<SEOProps> = ({
  title: fallbackTitle,
  description: fallbackDescription,
  image: fallbackImage,
  type = 'website',
  seoType,
  productId,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // 1. Resolve effective SEO type and Product ID
  const effectiveSeoType = useMemo(() => {
    if (seoType) return seoType;
    if (currentPath.startsWith('/product/') || currentPath.startsWith('/trek/') || currentPath.startsWith('/tour/')) return 'product';
    if (currentPath.startsWith('/blog/') || currentPath.startsWith('/post/')) return 'article';
    return 'page';
  }, [currentPath, seoType]);

  const effectiveProductId = useMemo(() => {
    if (productId) return productId;

    // Try to extract ID from URL (e.g., /product/slug-123, /trek/name-456)
    if (effectiveSeoType === 'product' || effectiveSeoType === 'article') {
      const parts = currentPath.split('/');
      const lastPart = parts[parts.length - 1];
      const match = lastPart.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return 0;
  }, [currentPath, effectiveSeoType, productId]);
  const isProductBased = (effectiveSeoType === 'product' || effectiveSeoType === 'article') && (effectiveProductId > 0);

  const { data: jsonLdWebsite } = useGenerateJsonLdForWebsiteQuery();

  const { data: seoByUrl } = useGetSeoByUrlQuery(
    { url: currentPath, type: effectiveSeoType },
    { skip: isProductBased == true || !currentPath }
  );
  const { data: seoByProduct } = useGetSeoByProductIdQuery(
    { productId: effectiveProductId, type: effectiveSeoType },
    { skip: isProductBased == false }
  );

  const rawSeoData = isProductBased ? seoByProduct : seoByUrl;
  const seoData = rawSeoData?.Data || rawSeoData;

  const jsonLdScripts = [];
  const websiteLd = jsonLdWebsite?.Data || jsonLdWebsite;

  // Helper to extract JSON from <script> tags if present
  const extractJsonLd = (content: any) => {
    if (!content) return null;
    if (typeof content === 'string') {
      const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/i;
      const match = content.match(scriptRegex);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return content;
  };

  if (websiteLd) {
    jsonLdScripts.push(extractJsonLd(websiteLd));
  }

  const siteName = 'Territory Himalaya';
  const metaTitle = useMemo(() => {
    const rawTitle = seoData?.MetaTitle || fallbackTitle || '';
    if (!rawTitle) return siteName;
    return rawTitle.includes(siteName) ? rawTitle : `${rawTitle} | ${siteName}`;
  }, [seoData?.MetaTitle, fallbackTitle]);

  const metaDescription = seoData?.MetaDescription || fallbackDescription || 'Discover amazing tours, treks, and travel experiences with Territory Himalayas.';
  const metaImage = seoData?.Image || fallbackImage || import.meta.env.VITE_CDN_PATH + '/assets/logo.png';
  const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}${currentPath}` : '';

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} key="description" />
      <link rel="canonical" href={canonicalUrl} key="canonical" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={isProductBased ? 'article' : type} key="og:type" />
      <meta property="og:title" content={metaTitle} key="og:title" />
      <meta property="og:description" content={metaDescription} key="og:description" />
      <meta property="og:image" content={metaImage} key="og:image" />
      <meta property="og:url" content={canonicalUrl} key="og:url" />
      <meta property="og:site_name" content={siteName} key="og:site_name" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={metaTitle} key="twitter:title" />
      <meta name="twitter:description" content={metaDescription} key="twitter:description" />
      <meta name="twitter:image" content={metaImage} key="twitter:image" />

      {/* JSON-LD Injection */}
      {jsonLdScripts.map((scriptContent, index) => (
        scriptContent && (
          <script key={`json-ld-${index}`} type="application/ld+json">
            {typeof scriptContent === 'string' ? scriptContent : JSON.stringify(scriptContent)}
          </script>
        )
      ))}
    </>
  );
};

export default SEO;