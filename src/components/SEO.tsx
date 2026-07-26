import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  url?: string;
  schema?: any;
}

export const SEO: React.FC<SEOProps> = ({ 
  title = "Blousia® | Premium Designer Women's Blouses",
  description = "Discover our exclusive collection of handcrafted, premium women's blouses. AI-assisted styling and bespoke customization available.",
  type = "website",
  image = "/pwa-512x512.png",
  url = "https://blousia.com",
  schema
}) => {
  const fullTitle = title === "Blousia® | Premium Designer Women's Blouses" ? title : `${title} | Blousia®`;
  
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Blousia",
    "url": url,
    "logo": "https://blousia.com/pwa-512x512.png",
    "description": description
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};
