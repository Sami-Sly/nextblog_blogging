-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "author" TEXT,
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "dateModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "datePublished" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "featuredImage" TEXT,
ADD COLUMN     "imageAlt" TEXT,
ADD COLUMN     "noIndex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "primaryKeyword" TEXT,
ADD COLUMN     "readingTime" INTEGER,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "twitterImage" TEXT;
