import Script from "next/script";

const BASE_URL = "https://intlsix.com";

/**
 * JSON-LD Organization schema — injected in root locale layout.
 */
export function OrganizationSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hong Kong International Mark Six",
    alternateName: "香港国际六合彩",
    url: BASE_URL,
    description:
      "Hong Kong and International Mark Six draws, zodiac analysis, and lottery information portal.",
    sameAs: ["https://intlsix.com"],
  };

  return (
    <Script
      id="org-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * JSON-LD WebSite schema with SearchAction.
 */
export function WebSiteSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hong Kong International Mark Six",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * JSON-LD Article schema for knowledge/news detail pages.
 */
export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "香江老饕",
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Hong Kong International Mark Six",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * JSON-LD BreadcrumbList schema.
 */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
