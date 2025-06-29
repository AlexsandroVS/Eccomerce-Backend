/*
  Warnings:

  - You are about to drop the column `price_modifier` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `price` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "price_modifier",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
