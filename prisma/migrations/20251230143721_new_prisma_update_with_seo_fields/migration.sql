/*
  Warnings:

  - You are about to drop the column `featuredImage` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `twitterImage` on the `Post` table. All the data in the column will be lost.
  - Made the column `canonicalUrl` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seoDescription` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seoTitle` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "featuredImage",
DROP COLUMN "twitterImage",
ALTER COLUMN "canonicalUrl" SET NOT NULL,
ALTER COLUMN "seoDescription" SET NOT NULL,
ALTER COLUMN "seoTitle" SET NOT NULL;
