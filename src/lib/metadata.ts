import type { Metadata } from "next";

interface BasePageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}

interface ArticleMetadataOptions extends BasePageMetadataOptions {
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = "/images/ogp.svg",
  imageAlt,
}: BasePageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt ?? title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function buildArticleMetadata({
  title,
  description,
  path,
  image = "/images/ogp.svg",
  imageAlt,
  publishedTime,
  modifiedTime,
}: ArticleMetadataOptions): Metadata {
  return {
    ...buildPageMetadata({ title, description, path, image, imageAlt }),
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      publishedTime,
      modifiedTime,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt ?? title,
        },
      ],
    },
  };
}
